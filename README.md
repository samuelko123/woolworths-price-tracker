# Woolworths Price Tracker

A web application that tracks the price history of Woolworths products.

## Serverless Architecture

<img alt="diagram" src="./docs/architecture.png" />

## ⚙️ Technical Decisions

### 🏗️ Infrastructure Choice

Two architectural approaches were considered for deployment:

1. **Server-based** — (e.g., Virtual Private Server, a.k.a. VPS)  
2. **Serverless** — (e.g., AWS Lambda & managed services)

---

#### 💻 Option 1: Server-based

This approach is appealing because:
- It enables end-to-end local testing.
- Deployment is straightforward using Docker containers.

However, VPS instances from budget-friendly providers often inherit IP addresses with poor reputations due to past misuse, which increases the likelihood of being blocked by third-party websites.

A proof-of-concept was conducted with:
- DigitalOcean  
- AWS LightSail  

Both instances failed to fetch the target homepage via a simple `curl` command. It validated that IP-based blocking was already in place for these providers.

---

#### ☁️ Option 2: Serverless

Although serverless solutions are harder to test locally, they offer a key advantage:
- Dynamic outbound IP ranges

This makes it difficult for third-party websites to block requests based on static IP lists, enhancing reliability for external data access.

---

#### ✅ Decision:
Serverless was selected for its superior resilience against IP-based blocking.

---

### 📡 Data-fetching Strategy

Two approaches were evaluated for retrieving data:

1. **Browser-based scraping** — (e.g., Playwright, Selenium)  
2. **Direct API data fetching**

---

#### 🌐 Option 1: Browser-based Scraping

This approach mimics real user activity, making detection by the target website more difficult. It also ensures data accuracy, as the output reflects exactly what a user would see.

However, this method presents challenges:
- ⚠️ **Fragility** — Small UI or layout changes can break the scraper.
- 💡 **Higher compute requirements** — Running headless browsers at scale is resource-intensive.
- 🧹 **Parsing overhead** — Extracted data often requires additional cleaning and transformation.

---

#### 🔗 Option 2: API Data Fetching

This strategy involves directly interacting with the target website’s available API endpoint — which, in this case, was accessible.

Benefits of this approach:
- ✅ Data is **well-structured** and consistently formatted.
- 💡 Requires **minimal compute resources**.
- ♻️ Produces **less load on the target website**, reducing the likelihood of being blocked.
- 🧠 Aligns more closely with the website’s intended usage patterns.

---

#### ✅ Decision:
Given the availability of a stable API endpoint and the reduced overhead on both compute resources and the target website, API-based data fetching was selected for this project.
