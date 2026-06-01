# Coach Site — TSV-Powered Template

A single-file, SEO-optimized coaching website you can re-skin for any cold pitch by editing **one TSV file**. No build step, no framework. Works for Business, Lifestyle, and Spiritual coaches.

## Files

| File | What it is |
|------|-----------|
| `index.html` | The renderer. Fetches `coach-data.tsv` on load and builds every section dynamically. **You don't edit this.** |
| `coach-data.tsv` | **The only file you edit.** All copy, colors, SEO, services, pricing, FAQs, blog posts, alt text. |
| `build.js` | Optional. Re-embeds a fallback copy of the TSV into `index.html` (for offline / `file://` use). |
| `_headers` | Cloudflare Pages config — serves the TSV with the right MIME type. |

## How it works

1. `index.html` loads → `fetch('coach-data.tsv')` → parses every sheet → renders.
2. **Add/remove rows in the TSV = content changes instantly.** Add a 4th service or a new blog post, push, done — the renderer detects it. No code changes.
3. If the TSV can't be fetched (e.g. opening the file directly off disk), it falls back to an embedded copy inside `index.html`.

## Editing the TSV

It's a **multi-sheet** TSV. Each sheet starts with `#sheetname`, then a header row, then data rows. Columns are **tab-separated** (real tabs, not spaces).

```
#pricing
tier_name   price   billing   features                              is_popular   order
Starter     1500    monthly   Monthly call|Email support            false        1
Growth      4000    monthly   Bi-weekly calls|Slack|Strategy doc    true         2
```

- **List fields** (features, deliverables, about points) use `|` to separate items.
- **HTML fields** (about story, FAQ answers, blog content) accept inline HTML like `<p>`, `<h2>`, `<ul>`, `<blockquote>`.
- **Show/hide sections** via `config`: `show_blog`, `show_pricing`, `show_testimonials`, `show_faq` = `true`/`false`.
- **Branding** (colors, fonts, name, SEO title/description, Cal.com link, socials) all live in the `#config` sheet.

> **Easiest workflow:** open `coach-data.tsv` in Google Sheets (File → Import → keep tab-separated), edit, then File → Download → **Tab-separated values (.tsv)** and replace the file. Or edit directly on GitHub.

### Sheets included
`config` · `nav` · `meta` (section headings) · `hero` · `about` · `services` · `testimonials` · `pricing` · `faq` · `blog` · `cta_final` · `footer`

## Booking (Cal.com)

Set `calcom_link` in `#config` to your Cal.com path, e.g. `yourname/discovery-call`. Every "Book" button opens it in an embedded modal. (You can also paste a full `https://cal.com/...` URL.)

## Photos

Use any Unsplash image URL in the relevant TSV cell (`hero → image`, `about → image`, `blog → image`, `testimonials → photo`). The renderer auto-appends sizing params (`w`, `q`, `auto=format`) for fast loading. Always fill the matching `*_alt` field for SEO/accessibility.

## Deploy: GitHub → Cloudflare Pages

```bash
# from this folder
git add .
git commit -m "Coach site"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

Then in Cloudflare:
1. **Workers & Pages → Create → Pages → Connect to Git** → pick the repo.
2. Build settings: **Framework preset = None**, **Build command = empty**, **Build output directory = `/`** (root).
3. Deploy. Your site is live at `https://<repo>.pages.dev`.

To update content later: edit `coach-data.tsv`, commit, push — Cloudflare redeploys automatically.

### Optional: refresh the offline fallback
After editing the TSV, run this once so the embedded fallback inside `index.html` matches (only matters for `file://` use; Cloudflare always serves the live TSV):
```bash
node build.js
```

## Re-skinning for a new pitch

1. Copy this folder.
2. Edit `#config` (name, colors, Cal.com, SEO) + swap copy/photos in the other sheets.
3. For a Lifestyle/Spiritual coach: change `coach_type`, soften the tone in `hero`/`about`, swap icons (`heart`, `sparkles`), update services/pricing names.
4. Push to a new repo → new Cloudflare project. ~10 minutes per prospect.

## SEO included out of the box
Dynamic `<title>` + meta description + Open Graph + Twitter cards · JSON-LD schema (Person, Organization, Service, FAQPage, Review/AggregateRating) · semantic headings · descriptive alt text · lazy-loaded responsive images · mobile-first responsive layout.
