from datetime import datetime, timezone
from src.dispatcher import Webhook, WebhookEvent, Delivery, DeliveryStatus, WebhookDispatcher

class Client:
    def __init__(self, status): self.status, self.headers = status, None
    def post(self, url, body, headers, timeout):
        self.headers = headers
        return self.status

class Store:
    def save(self, delivery): self.saved = delivery

def test_success_is_signed_and_persisted():
    client, store = Client(204), Store()
    event = WebhookEvent("e1", "order.created", {"id": 1}, datetime.now(timezone.utc))
    result = WebhookDispatcher(client, store).deliver(Webhook("w1", "https://example.test", "secret"), event, Delivery("d1", "w1", "e1"))
    assert result.status == DeliveryStatus.DELIVERED
    assert client.headers["x-webhook-signature"].startswith("sha256=")
    assert store.saved is result

def test_failure_enters_retry_state():
    event = WebhookEvent("e1", "changed", {}, datetime.now(timezone.utc))
    result = WebhookDispatcher(Client(503), Store()).deliver(Webhook("w1", "https://example.test", "s"), event, Delivery("d1", "w1", "e1"))
    assert result.status == DeliveryStatus.RETRY_WAIT
    assert result.attempts == 1
