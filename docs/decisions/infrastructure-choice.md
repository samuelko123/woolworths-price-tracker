## 🏗️ Infrastructure Choice

Two approaches were considered for deployment:

1. Server-based (e.g., Virtual Private Server, a.k.a. VPS)  
2. Serverless (e.g., AWS Lambda and managed services)

---

### 💻 Option 1: Server-based

**✅ Pros:**
- Allows end-to-end local testing.
- Straightforward Docker-based deployment.
- Flat rate for VPS hosting.

**❌ Cons:**
- Higher risk of IP-based blocking by third-party websites:
  - VPS IP addresses often have a poor reputation due to historical abuse.
  - Proof-of-concept with DigitalOcean and AWS LightSail failed to fetch the target homepage using `curl`.
- Manual DevOps management:
  - Deployment pipeline.
  - SSL certificate renewal.
  - VPS security.
  - Disaster recovery.

---

### ☁️ Option 2: Serverless

**✅ Pros:**
- Offers dynamic outbound IP ranges, reducing the risk of being blocked.
- Infrastructure managed by the provider.
- Built-in high availability and fault tolerance.
- Built-in auto-scaling.

**❌ Cons:**
- Harder to test locally.
- Requires active management of serverless resource usage:
  - Manage via Infrastructure-as-Code (IaC).
  - Set up billing alerts.

---

### 🏆 Decision:

**Serverless** was selected for its resilience against IP-based blocking and fault tolerance.
