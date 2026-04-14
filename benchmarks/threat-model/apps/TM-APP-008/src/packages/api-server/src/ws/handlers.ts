import { WebSocket } from 'ws';
import { logger } from '../utils/logger';

/**
 * WebSocket channel subscription management.
 * Maintains a map of channels to sets of subscribed WebSocket connections.
 */

const channels = new Map<string, Set<WebSocket>>();

/**
 * Subscribe a WebSocket connection to a channel.
 */
export function handleSubscribe(ws: WebSocket, channelName: string): void {
  if (!channels.has(channelName)) {
    channels.set(channelName, new Set());
  }
  channels.get(channelName)!.add(ws);
  logger.debug('WebSocket: subscribed to channel', { channel: channelName });

  ws.on('close', () => {
    handleUnsubscribe(ws, channelName);
  });
}

/**
 * Unsubscribe a WebSocket connection from a channel.
 */
export function handleUnsubscribe(ws: WebSocket, channelName: string): void {
  const subs = channels.get(channelName);
  if (subs) {
    subs.delete(ws);
    if (subs.size === 0) {
      channels.delete(channelName);
    }
  }
  logger.debug('WebSocket: unsubscribed from channel', { channel: channelName });
}

/**
 * Broadcast a message to all subscribers of a channel.
 */
export function broadcastToChannel(channelName: string, event: Record<string, unknown>): void {
  const subs = channels.get(channelName);
  if (!subs || subs.size === 0) return;

  const message = JSON.stringify(event);
  let delivered = 0;

  subs.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
      delivered++;
    }
  });

  logger.debug('WebSocket: broadcast', {
    channel: channelName,
    subscribers: subs.size,
    delivered,
  });
}

/**
 * Get the number of subscribers on a channel.
 */
export function getChannelSubscriberCount(channelName: string): number {
  return channels.get(channelName)?.size || 0;
}

/**
 * Get all active channels.
 */
export function getActiveChannels(): string[] {
  return Array.from(channels.keys());
}
