# 📡 Data-fetching Strategy

Two approaches were considered for obtaining data:

1. Browser-based scraping (e.g., Playwright, Selenium)  
2. Direct API data fetching

---

## 🌐 Option 1: Browser-based Scraping

**✅ Pros:**
- Mimics real user activity, making automated access harder to detect.
- Ensures high data accuracy by capturing exactly what a human user would see.

**❌ Cons:**
- **Fragility** - Small UI or layout changes can easily break the scraping logic.
- **Higher compute requirement** - Running headless browsers at scale is resource-intensive.
- **Parsing overhead** - Extracted data usually requires additional cleaning and transformation.

---

## 🔗 Option 2: API Data Fetching

**✅ Pros:**
- Provides well-structured and consistently formatted data.
- Requires minimal compute resources for data retrieval.
- Produces less load on the target website, reducing the risk of being blocked.

**❌ Cons:**
- Requires technical discovery of available API endpoints.
- Limited to the data exposed by the API — If the API changes or is deprecated, adjustments will be required.

---

## 🏆 Decision:

**API-based data fetching** was selected for its lower compute overhead and well-structured data.
