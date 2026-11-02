from __future__ import annotations
import hashlib
import hmac
import json
import random
import time
from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from typing import Any, Protocol

class DeliveryStatus(str, Enum):
    PENDING = "PENDING"
    DELIVERED = "DELIVERED"
    RETRY_WAIT = "RETRY_WAIT"
    DEAD = "DEAD"

@dataclass
class Webhook:
    webhook_id: str
    url: str
    secret: str

@dataclass
class WebhookEvent:
    event_id: str
    event_type: str
    payload: Any
    created_at: datetime

@dataclass
class Delivery:
    delivery_id: str
    webhook_id: str
    event_id: str
    status: DeliveryStatus = DeliveryStatus.PENDING
    attempts: int = 0
    next_attempt_at: float = 0
    last_error: str | None = None

class HttpClient(Protocol):
    def post(self, url: str, body: str, headers: dict[str, str], timeout: float) -> int: ...

class DeliveryStore(Protocol):
    def save(self, delivery: Delivery) -> None: ...

class WebhookDispatcher:
    def __init__(self, client: HttpClient, store: DeliveryStore, max_attempts: int = 5, timeout: float = 5.0):
        if max_attempts < 1 or timeout <= 0:
            raise ValueError("max_attempts and timeout must be positive")
        self.client, self.store = client, store
        self.max_attempts, self.timeout = max_attempts, timeout

    def deliver(self, webhook: Webhook, event: WebhookEvent, delivery: Delivery) -> Delivery:
        if (delivery.webhook_id, delivery.event_id) != (webhook.webhook_id, event.event_id):
            raise ValueError("delivery identity mismatch")
        if delivery.status in (DeliveryStatus.DELIVERED, DeliveryStatus.DEAD):
            return delivery
        body = json.dumps({"id": event.event_id, "type": event.event_type, "createdAt": event.created_at.isoformat(), "data": event.payload}, separators=(",", ":"), sort_keys=True)
        timestamp = str(int(time.time()))
        digest = hmac.new(webhook.secret.encode(), f"{timestamp}.{body}".encode(), hashlib.sha256).hexdigest()
        headers = {"content-type": "application/json", "x-webhook-id": event.event_id, "x-webhook-timestamp": timestamp, "x-webhook-signature": f"sha256={digest}"}
        try:
            status = self.client.post(webhook.url, body, headers, self.timeout)
            if 200 <= status < 300:
                delivery.status = DeliveryStatus.DELIVERED
            else:
                self._fail(delivery, f"HTTP {status}")
        except Exception as exc:
            self._fail(delivery, str(exc))
        self.store.save(delivery)
        return delivery

    def _fail(self, delivery: Delivery, reason: str) -> None:
        delivery.attempts += 1
        delivery.last_error = reason
        if delivery.attempts >= self.max_attempts:
            delivery.status = DeliveryStatus.DEAD
        else:
            delivery.status = DeliveryStatus.RETRY_WAIT
            base = min(60 * (2 ** (delivery.attempts - 1)), 3600)
            delivery.next_attempt_at = time.time() + base * random.uniform(0.5, 1.5)
