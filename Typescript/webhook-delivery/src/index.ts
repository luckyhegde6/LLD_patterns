import { createHmac } from "node:crypto";
export type DeliveryStatus = "PENDING" | "DELIVERED" | "RETRY_WAIT" | "DEAD";
export interface Webhook { id: string; url: string; secret: string; }
export interface WebhookEvent { id: string; type: string; payload: unknown; createdAt: Date; }
export interface Delivery { id: string; webhookId: string; eventId: string; status: DeliveryStatus; attempts: number; nextAttemptAt: Date; lastError?: string; }
export interface HttpClient { post(url: string, body: string, headers: Record<string, string>, timeoutMs: number): Promise<{ status: number }>; }
export interface DeliveryStore { save(delivery: Delivery): Promise<void>; }
export class WebhookDispatcher {
 constructor(private readonly client: HttpClient, private readonly store: DeliveryStore, private readonly maxAttempts = 5, private readonly timeoutMs = 5000) {
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1 || timeoutMs <= 0) throw new Error("Invalid retry or timeout configuration");
 }
 async deliver(webhook: Webhook, event: WebhookEvent, delivery: Delivery): Promise<Delivery> {
  if (delivery.webhookId !== webhook.id || delivery.eventId !== event.id) throw new Error("Delivery identity mismatch");
  if (delivery.status === "DELIVERED" || delivery.status === "DEAD") return delivery;
  const body = JSON.stringify({ id: event.id, type: event.type, createdAt: event.createdAt.toISOString(), data: event.payload });
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = createHmac("sha256", webhook.secret).update(`${timestamp}.${body}`).digest("hex");
  try {
   const response = await this.client.post(webhook.url, body, { "content-type": "application/json", "x-webhook-id": event.id, "x-webhook-timestamp": timestamp, "x-webhook-signature": `sha256=${signature}` }, this.timeoutMs);
   if (response.status >= 200 && response.status < 300) delivery.status = "DELIVERED";
   else this.fail(delivery, `HTTP ${response.status}`);
  } catch (error) { this.fail(delivery, error instanceof Error ? error.message : String(error)); }
  await this.store.save(delivery);
  return delivery;
 }
 private fail(delivery: Delivery, reason: string): void {
  delivery.attempts += 1;
  delivery.lastError = reason;
  if (delivery.attempts >= this.maxAttempts) delivery.status = "DEAD";
  else {
   delivery.status = "RETRY_WAIT";
   const baseMs = Math.min(60_000 * 2 ** (delivery.attempts - 1), 3_600_000);
   delivery.nextAttemptAt = new Date(Date.now() + Math.floor(baseMs * (0.5 + Math.random())));
  }
 }
}
