# 📡 Data-fetching Strategy

Two approaches were evaluated for retrieving data:

1. **Browser-based scraping** (e.g. Playwright, Selenium)
2. **Direct API data fetching**

---

## 🌐 Option 1: Browser-based Scraping

This approach mimics real user activity, making detection by the target website more difficult. It also ensures data accuracy, as the output reflects exactly what a user would see.

However, this method presents challenges:

- **Fragility** — Small UI or layout changes can break the scraper.
- **Higher compute requirements** — Running headless browsers at scale is resource-intensive.
- **Parsing overhead** — Extracted data often requires additional cleaning and transformation.

---

## 🔗 Option 2: API Data Fetching

This strategy involves directly interacting with the target website’s available API endpoint — which, in this case, was accessible.

Benefits of this approach:

- Data is **well-structured** and consistently formatted.
- Requires **minimal compute resources**.
- Produces **less load on the target website**, reducing the likelihood of being blocked.
- Aligns more closely with the website’s intended usage patterns.

---

## ✅ Decision:

Given the availability of a stable API endpoint and the reduced overhead on both compute resources and the target website, API-based data fetching was selected for this project.
