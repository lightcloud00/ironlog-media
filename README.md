# ironlog.co

Marketing, support, privacy, and blog pages for IronLog.

## Tech Stack
- Static HTML/CSS
- Cloudflare Pages Functions for `/api/contact`

## Setup
```bash
git clone https://github.com/lightcloud00/ironlog-media.git
cd ironlog-media
```

The contact endpoint expects a Cloudflare KV binding named `LEADS`. If the binding is unavailable, the homepage form falls back to a `mailto:` support draft.

## License
MIT
