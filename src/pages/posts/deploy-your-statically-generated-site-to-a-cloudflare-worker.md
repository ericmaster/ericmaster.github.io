---
layout: ../../layouts/MarkdownPostLayout.astro
title: Deploy your statically generated site to a Cloudflare Worker
published: false
tags:
  - Devops
  - SSG
  - Cloudflare
  - Workers
  - Deployment
slug: deploy-your-statically-generated-site-to-a-cloudflare-worker
pubDate: 2025-05-28T16:49:00.000Z
image:
  url: assets/images/developer-launching-rocket-towards-cloudflare-cloud.png
  alt: Uploading application to cloudflare
description: If you're building a static site (or even a SSR one) with tools
  like Astro, Hugo, or Next.js, you can supercharge its performance by deploying
  it to the edge with Cloudflare Workers. This post walks you through the entire
  process, from generating your site and setting up a Worker project with
  wrangler, to configuring your site and going live. You'll also learn how to
  set up a custom domain. It's a step-by-step guide to getting your site fast,
  secure, and live on the edge in minutes!
---
Static sites are fast, secure, and easy to maintain, and when served from the edge, they're nearly unbeatable in performance. In this post, I’ll walk you through the deployment process of a statically generated site (like one from Next.js, Astro, Hugo, or Eleventy) to **Cloudflare Workers**.

Whether you're a fan of `npm run build` or `hugo -D`, this guide will help you serve your site directly from Cloudflare's edge locations.

---

## 🧱 Prerequisites

Before you begin, make sure you have:

- A statically generated site (any framework like Astro, Hugo, Next.js `export`, Eleventy, etc.)
- [Node.js](https://nodejs.org/) installed
- A Cloudflare account
---

## 1. Generate Your Static Site

Generate your production-ready static files using your preferred framework. For example:

```bash
npm run build
```

This will output a directory like `dist/`, `out/`, or `public/` — your final static site files.

---

## 2. Create a New Worker via Cloudflare Dashboard

1. Go to the [Cloudflare Workers Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Compute (Workers) > Create**
3. Select the **"Workers"** tab
4. Select the **"Start with Hello World!"** option as the starter and give your Worker a name

Once created, you’ll be redirected to your Worker’s dashboard.

---

## 3. Link Your Project with Wrangler

Make sure the `wrangler` CLI is installed in your project:
```bash
npm install -D wrangler
```

From your terminal, link your local project:

```bash
npx wrangler init --from-dash <YOUR_WORKER_NAME>
```
This will generate a new `wrangler.jsonc` file which contains all the configuration for your worker.

Almost there, now, let's make sure everything works as exepected by previewing your project locally

```bash
npx wrangler dev
```
This will execute a local server on port 8787, so you can access your site on [http://localhost:8787](http://localhost:8787)

---

## 4. Deploy Your Site

Run the following to push your static site and Worker to Cloudflare:

```bash
wrangler deploy
```

You’ll receive a live URL like:

```
https://my-static-site.<your-subdomain>.workers.dev
```

---

## 🌐 Add a Custom Domain

To use your own domain:

1. Ensure DNS is managed by Cloudflare, if not, [add the Domain to Cloudflare](https://developers.cloudflare.com/fundamentals/setup/manage-domains/add-site/)
2. In the Cloudflare dashboard, go to **Compute(Workers) > Your Worker > Settings**
3. Under **Domains & Routes** click on **+ Add* and enter your domain (e.g. `example.com`). I will automatically add the corresponding DNS record and proxy through cloudflare network.

---

## ✅ Final Thoughts

Deploying static sites with the new Cloudflare Workers flow is faster and more intuitive than ever. By combining edge performance with developer-friendly tooling, it’s a fantastic choice for everything from blogs to full-scale documentation sites.

If you want to skip deploying your site manually via wrangler CLI, you can connect to a repository (Github or Gitlab) and configure build and deploy commands for a CI/CD-ready static hosting.

---

### 🔗 Resources

- [Cloudflare Workers Dashboard Getting Started](https://developers.cloudflare.com/workers/get-started/dashboard/)
- [Wrangler Docs](https://developers.cloudflare.com/workers/wrangler/)

---

Have feedback or questions? Share them or reach out [@yourhandle].
Happy deploying! ⚡

