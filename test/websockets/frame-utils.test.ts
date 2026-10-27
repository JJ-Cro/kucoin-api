import {
  isDataPushFrame,
  isPongFrame,
} from '../../src/lib/websocket/frame-utils.js';

describe('frame-utils', () => {
  describe('isPongFrame()', () => {
    it.each([
      '{"id":"1545910590801","type":"pong"}',
      '{"id":"1545910590801","type":"pong","timestamp":1764215232000000}',
    ])('recognises %s', (frame) => {
      expect(isPongFrame(frame)).toBe(true);
    });

    it('ignores a long frame even if it contains "pong"', () => {
      const push = JSON.stringify({
        type: 'message',
        topic: '/market/snapshot:PONG-USDT',
        data: { name: 'ping pong token', padding: 'x'.repeat(300) },
      });

      expect(isPongFrame(push)).toBe(false);
    });

    it('checks frames up to and including 256 characters', () => {
      const wrapper = '{"type":"pong","p":""}';
      const atLimit = wrapper.replace(
        '""',
        `"${'x'.repeat(256 - wrapper.length)}"`,
      );

      expect(atLimit).toHaveLength(256);
      expect(isPongFrame(atLimit)).toBe(true);
      expect(isPongFrame(`${atLimit} `)).toBe(false);
    });

    it.each([undefined, null, 42, {}, Buffer.from('pong')])(
      'rejects a non-string (%p)',
      (frame) => {
        expect(isPongFrame(frame)).toBe(false);
      },
    );
  });

  describe('isDataPushFrame()', () => {
    it('recognises a data push', () => {
      expect(
        isDataPushFrame(
          '{"topic":"/market/ticker:all","type":"message","subject":"BTC-USDT","data":{}}',
        ),
      ).toBe(true);
    });

    it.each([
      '{"id":"hQvf8jkno","type":"welcome"}',
      '{"id":"1545910660739","type":"ack"}',
      '{"id":"1","type":"error","code":400,"data":"ping timeout"}',
      '{"id":"1","type":"pong"}',
    ])('rejects the control frame %s', (frame) => {
      expect(isDataPushFrame(frame)).toBe(false);
    });

    it('only looks at the head: a type far into the frame is not matched', () => {
      const late = `{"data":"${'x'.repeat(300)}","type":"message"}`;

      expect(isDataPushFrame(late)).toBe(false);
    });
  });
});
