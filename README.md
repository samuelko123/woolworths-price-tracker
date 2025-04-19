# Woolworths Price Tracker

A web application that tracks the price history of Woolworths products.

## Serverless Architecture

<img alt="diagram" src="./docs/architecture.png" />

## Technical Decisions

### Infrastructure

There are two choices available:

1. Server-based (e.g. Virtual Private Server - VPS)
2. Serverless (e.g. AWS Lambda and managed services)

## Option 1: Server-based

The VPS-based approach is attractive because it allows end-to-end testing locally and straightforward deployment via Docker containers. However, VPS servers, particularly those from affordable cloud providers, often inherit IP addresses with poor reputations due to historical abuse. This leads to higher chances of being blocked by third-party websites.

I conducted proof-of-concept tests using DigitalOcean and AWS LightSail, where both instances were unable to fetch the target homepage using a `curl` command. This suggests IP-based blocking is already in place against these providers, reducing the viability of this approach.

## Option 2: Serverless

While serverless solutions are less convenient to test locally, they offer a key advantage:
a dynamic pool of outbound IP addresses. This makes it harder for third-party websites to apply broad IP-based blocks, increasing reliability for external data access.

AWS was chosen over alternatives like Azure or Google Cloud primarily to expand my hands-on experience with AWS. I already have significant exposure to Azure, and this project offered a valuable opportunity to deepen my familiarity with AWS services and deployment patterns.
