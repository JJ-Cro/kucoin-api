import { WebsocketClient } from '../../src/WebsocketClient.js';

type Internals = {
  onWsMessage(event: unknown, wsKey: string, ws: unknown): Promise<unknown>;
  isWsPong(msg: unknown): boolean;
};

const WS_KEY = 'spotPublicV1';

const frame = (data: string) => ({ type: 'message', data });

const tickerAll = (subject: string) =>
  JSON.stringify({
    topic: '/market/ticker:all',
    type: 'message',
    subject,
    data: {
      bestAsk: '80000.2',
      bestAskSize: '0.5',
      bestBid: '80000.1',
      bestBidSize: '0.4',
      price: '80000.1',
      sequence: '1',
      size: '0.01',
      time: 1792994289896,
    },
  });

const depth = (symbol: string, levels = 50) =>
  JSON.stringify({
    type: 'message',
    topic: `/spotMarket/level2Depth50:${symbol}`,
    subject: 'level2',
    data: {
      asks: Array.from({ length: levels }, (_, i) => [`${100 + i}`, '1']),
      bids: Array.from({ length: levels }, (_, i) => [`${99 - i}`, '1']),
      timestamp: 1,
    },
  });

describe('KuCoin WebsocketClient message handling', () => {
  const build = (
    options: ConstructorParameters<typeof WebsocketClient>[0] = {},
  ) => {
    const client = new WebsocketClient(options);
    const updates: unknown[] = [];
    const responses: unknown[] = [];
    client.on('update', (e) => updates.push(e));
    client.on('response', (e) => responses.push(e));
    client.on('exception', (e) => responses.push(e));
    return { client: client as unknown as Internals, updates, responses };
  };

  afterEach(() => jest.restoreAllMocks());

  describe('pong detection', () => {
    it.each([
      ['a classic pong', '{"id":"1545910590801","type":"pong"}'],
      [
        'a pong with timestamp',
        '{"id":"1545910590801","type":"pong","timestamp":1764215232000000}',
      ],
    ])('recognises %s', (_case, data) => {
      const { client } = build();
      expect(client.isWsPong({ data })).toBe(true);
    });

    it('does not scan or swallow a large data push that happens to contain "pong"', async () => {
      const { client, updates } = build();
      const payload = JSON.stringify({
        type: 'message',
        topic: '/market/snapshot:PONG-USDT',
        subject: 'trade.snapshot',
        data: { name: 'ping pong token', padding: 'x'.repeat(400) },
      });

      expect(client.isWsPong({ data: payload })).toBe(false);
      await client.onWsMessage(frame(payload), WS_KEY, {});

      expect(updates).toHaveLength(1);
    });

    it('never emits a pong as an update', async () => {
      const { client, updates } = build();

      await client.onWsMessage(frame('{"id":"1","type":"pong"}'), WS_KEY, {});

      expect(updates).toHaveLength(0);
    });
  });

  describe('dataMessageFilter', () => {
    it('emits every data push when no filter is configured (default)', async () => {
      const { client, updates } = build();

      await client.onWsMessage(frame(tickerAll('BTC-USDT')), WS_KEY, {});
      await client.onWsMessage(frame(tickerAll('XYZ-BTC')), WS_KEY, {});

      expect(updates).toHaveLength(2);
    });

    it('drops rejected data pushes before parsing them, and emits the rest', async () => {
      const tracked = new Set(['BTC-USDT']);
      const { client, updates } = build({
        dataMessageFilter: (raw) =>
          !raw.includes('"topic":"/market/ticker:all"') ||
          [...tracked].some((s) => raw.includes(`"subject":"${s}"`)),
      });
      const parse = jest.spyOn(JSON, 'parse');

      await client.onWsMessage(frame(tickerAll('XYZ-BTC')), WS_KEY, {});
      expect(parse).not.toHaveBeenCalled();
      expect(updates).toHaveLength(0);

      await client.onWsMessage(frame(tickerAll('BTC-USDT')), WS_KEY, {});
      await client.onWsMessage(frame(depth('ETH-USDT')), WS_KEY, {});
      expect(updates).toHaveLength(2);
    });

    it('passes the raw frame and the wsKey to the filter', async () => {
      const filter = jest.fn().mockReturnValue(true);
      const { client } = build({ dataMessageFilter: filter });
      const raw = tickerAll('BTC-USDT');

      await client.onWsMessage(frame(raw), WS_KEY, {});

      expect(filter).toHaveBeenCalledWith(raw, WS_KEY);
    });

    it.each([
      ['welcome', '{"id":"hQvf8jkno","type":"welcome"}'],
      ['ack', '{"id":"1545910660739","type":"ack"}'],
      ['error', '{"id":"1","type":"error","code":400,"data":"ping timeout"}'],
    ])('never filters the %s control frame', async (_case, data) => {
      const filter = jest.fn().mockReturnValue(false);
      const { client, responses, updates } = build({
        dataMessageFilter: filter,
      });

      await client.onWsMessage(frame(data), WS_KEY, {});

      expect(filter).not.toHaveBeenCalled();
      expect(responses.length + updates.length).toBeGreaterThan(0);
    });

    it('fails safe: a push whose type is not near the start is parsed as usual', async () => {
      const filter = jest.fn().mockReturnValue(false);
      const { client, updates } = build({ dataMessageFilter: filter });
      const late = JSON.stringify({
        topic: '/market/ticker:all',
        subject: 'BTC-USDT',
        data: { padding: 'x'.repeat(400) },
        type: 'message',
      });

      await client.onWsMessage(frame(late), WS_KEY, {});

      expect(filter).not.toHaveBeenCalled();
      expect(updates).toHaveLength(1);
    });

    it('processes the frame as usual and logs when the filter throws', async () => {
      const { client, updates } = build({
        dataMessageFilter: () => {
          throw new Error('filter blew up');
        },
      });
      const error = jest.fn();
      (client as unknown as { logger: Record<string, unknown> }).logger = {
        trace: jest.fn(),
        info: jest.fn(),
        error,
      };

      await client.onWsMessage(frame(tickerAll('BTC-USDT')), WS_KEY, {});

      expect(updates).toHaveLength(1);
      expect(error).toHaveBeenCalledWith(
        expect.stringContaining('isDiscardable'),
        expect.objectContaining({
          wsKey: WS_KEY,
          exception: expect.any(Error),
        }),
      );
    });

    it('still processes the frame when the logger itself throws', async () => {
      const { client, updates } = build({
        dataMessageFilter: () => {
          throw new Error('filter blew up');
        },
      });
      (client as unknown as { logger: Record<string, unknown> }).logger = {
        trace: jest.fn(),
        info: jest.fn(),
        error: () => {
          throw new Error('logger blew up');
        },
      };

      await client.onWsMessage(frame(tickerAll('BTC-USDT')), WS_KEY, {});

      expect(updates).toHaveLength(1);
    });
  });
});
