/**
 * Cheap checks on raw WebSocket frames, used on the hot path before a frame is parsed.
 *
 * Both only look at the start of a frame (or at short frames), so their cost does not grow
 * with the size of a market-data push.
 */

/** KuCoin's pong (`{"id":"...","type":"pong","timestamp":...}`) is well under this. */
const PONG_FRAME_MAX_LENGTH = 256;

/** How far into a frame a data push's `"type":"message"` is expected to appear. */
const FRAME_HEAD_LENGTH = 256;

const DATA_PUSH_MARKER = '"type":"message"';

/**
 * True for a heartbeat reply. Only short frames are inspected, so a data push whose text
 * happens to contain "pong" (a symbol or token name, for example) is never mistaken for one.
 */
export function isPongFrame(data: unknown): boolean {
  return (
    typeof data === 'string' &&
    data.length <= PONG_FRAME_MAX_LENGTH &&
    data.includes('pong')
  );
}

/**
 * True for a data push (`"type":"message"` near the start of the frame).
 *
 * Control frames (welcome, ack, error, pong) return false, and so does a push whose type
 * is not found near the start: callers treat both as "not filterable", which fails safe.
 * `lastIndexOf` from a fixed position scans only the head and does not copy it.
 */
export function isDataPushFrame(raw: string): boolean {
  return raw.lastIndexOf(DATA_PUSH_MARKER, FRAME_HEAD_LENGTH) !== -1;
}
