# Infrastructure Choice

Two architectural approaches were considered for deployment:

1. **Server-based** — (e.g., Virtual Private Server, a.k.a. VPS)
2. **Serverless** — (e.g., AWS Lambda & managed services)

---

## 💻 Option 1: Server-based

This approach is appealing because:

- It enables end-to-end local testing.
- Deployment is straightforward using Docker containers.

However, VPS instances from budget-friendly providers often inherit IP addresses with poor reputations due to past misuse, which increases the likelihood of being blocked by third-party websites.

A proof-of-concept was conducted with:

- DigitalOcean
- AWS LightSail

Both instances failed to fetch the target homepage via a simple `curl` command. It validated that IP-based blocking was already in place for these providers.

---

## ☁️ Option 2: Serverless

Although serverless solutions are harder to test locally, they offer a key advantage:

- Dynamic outbound IP ranges

This makes it difficult for third-party websites to block requests based on static IP lists, enhancing reliability for external data access.

---

## ✅ Decision:

Serverless was selected for its superior resilience against IP-based blocking.
