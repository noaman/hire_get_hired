# Pitch deck PDF export

Generates **`hogh_vc_pitch_presentation.pdf`** — one page per slide, **no** navigation, **no** speaker notes (notes live in hidden blocks and are omitted from print).

## One-time setup

From the repo root:

```bash
npm install
npx playwright install chromium
```

## Export

```bash
npm run export:pitch-pdf
```

Output: `docs/pdf/hogh_vc_pitch_presentation.pdf`

## Manual alternative

Open `hogh_vc_pitch_presentation.html` in Chrome → **Print** → Destination **Save as PDF** → enable **Background graphics** → Landscape. Print CSS in the file hides chrome and stacks slides one per page.
