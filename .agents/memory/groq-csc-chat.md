---
name: Groq CSC chatbot integration
description: Groq-backed support responses need server-side model and safety guardrails.
---

Use Groq only from the API server with the key kept in Replit Secrets. Model availability can vary by key, so verify the selected model with a live request before relying on it. Keep a server-side response sanitizer and explicit CSC system prompt because model output may otherwise invent fees, URLs, deadlines, or document requirements.

**Why:** A valid Groq key may reject commonly documented model IDs, and support users need trustworthy answers rather than plausible but unverified government-service details.

**How to apply:** When changing the model or prompt, run a live `/api/chat` request and verify the response contains no invented numeric fee, deadline, URL, or secret-collection request.