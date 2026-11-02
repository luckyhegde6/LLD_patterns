import { describe, expect, it, vi } from "vitest";
import { WebhookDispatcher, type HttpClient, type Delivery } from "../src";

const webhook = { id: "w1", url: "https://example.test/hook", secret: "secret" };
const event = { id: "evt1", type: "order.created", payload: { orderId: "o1" }, createdAt: new Date("2026-01-01T00:00:00Z") };
const makeDelivery = (): Delivery => ({ id: "d1", webhookId: "w1", eventId: "evt1", status: "PENDING", attempts: 0, nextAttemptAt: new Date() });

describe("WebhookDispatcher", () => {
 it("marks 2xx delivered and signs the request", async () => {
  const post = vi.fn(async (_url: string, _body: string, headers: Record<string, string>) => {
   expect(headers["x-webhook-signature"]).toMatch(/^sha256=[a-f0-9]{64}$/);
   expect(headers["x-webhook-id"]).toBe("evt1");
   return { status: 204 };
  });
  const save = vi.fn(async () => {});
  const result = await new WebhookDispatcher({ post } as unknown as HttpClient, { save }).deliver(webhook, event, makeDelivery());
  expect(result.status).toBe("DELIVERED");
  expect(save).toHaveBeenCalledOnce();
 });
 it("moves non-2xx delivery to retry wait", async () => {
  const client = { post: vi.fn(async () => ({ status: 503 })) } as unknown as HttpClient;
  const result = await new WebhookDispatcher(client, { save: async () => {} }).deliver(webhook, event, makeDelivery());
  expect(result.status).toBe("RETRY_WAIT");
  expect(result.attempts).toBe(1);
 });
});
