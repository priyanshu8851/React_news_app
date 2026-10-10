# New-z

A responsive editorial news reader built with React and Vite. It searches Google News RSS through a Netlify Function and opens each result in an in-app story detail route.

## Run locally

```sh
npm install
npm run dev
```

The Vite development server serves the interface and locally invokes the same function handler used in production. No API key or local environment setup is needed.

## Deploy to Netlify

The included `netlify.toml` builds the Vite app and deploys `netlify/functions/news.js`. No API key or secret configuration is required.

The function fetches RSS search results for India in English, follows only Google News redirect responses to resolve a publisher URL, and never fetches or parses publisher page content. The feed has no published API key requirement, but Google can change or rate-limit this RSS surface. It provides headlines, snippets, publisher names, dates, and sometimes image URLs; it does not provide full article text or reliable author/category metadata. New-z labels feed text as an excerpt and only shows a publisher link when a valid non-Google HTTPS URL was resolved. Provider images are used when supplied; otherwise a locally rendered, topic-aware editorial illustration is shown and labeled as an illustration so it is not mistaken for an article photograph. Failed provider images fall back to the same artwork.

Because the feed does not expose stable pagination or a canonical per-article API, New-z displays the current search results and resolves a directly opened detail route by searching for its headline again. Stories with no verifiable publisher URL remain readable while in the current session, but a direct reload may not be able to retrieve them.

## Checks

```sh
npm run lint
npm run build
```

## Identity links

The app is branded New-z and retains the “Made by Priyanshu” attribution. The existing GitHub link points to [priyanshu8851/React_news_app](https://github.com/priyanshu8851/React_news_app). No portfolio URL was present in the project source when this update was made.
