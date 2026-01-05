# Notification System 📬📱  
(Explained Like I’m 5)

---

## The Story

Imagine you want to tell your friends something.

Some friends:
- Like letters ✉️
- Like phone messages 📱
- Like app messages 🔔

You don’t shout at everyone yourself.

You tell a **helper**:
> “Please tell everyone for me.”

---

## What the Helper Does

The helper:
- Writes down what to say
- Puts messages in a line
- Sends them one by one

If someone doesn’t hear it:
> “I’ll try again later.”

---

## What the System Is Really Doing

- **Notification** → the message
- **Queue** → the waiting line
- **Dispatcher** → the helper
- **Channels** → different ways to send
  - Email
  - SMS
  - Push

Each channel is tried **separately**.

---

## What If Something Goes Wrong?

- Email fails? Try again.
- Phone is off? Try later.
- App crashed? Message waits safely.

Important rule:
> “Never send the same message twice by mistake.”

So the helper keeps a checklist.

---

## Why This Is Important

- Messages should not block the app
- One failure should not break others
- Messages must be delivered **once**

So:
- Everything is async
- Failures are retried
- Duplicates are prevented

---

## Interview Thought (Grown-Up Words)

> “A notification system is about **reliability, idempotency, and graceful failure**.”

If you can explain it with helpers and letters,
you truly understand it.

