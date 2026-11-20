# Adeel Builds portfolio

A static, production-ready portfolio for Adeel Builds. No build step or framework is required.

## Preview locally

From this folder, run:

```powershell
npx serve .
```

Then open the local URL printed in the terminal. Any static HTTP server also works. Opening `index.html` directly is enough for a quick content check, but a local server is recommended for testing canonical URLs and browser behaviour.

## Replace before public launch

- `FORM_ENDPOINT` at the top of `script.js` is empty. In this state, the form correctly opens WhatsApp with the submitted details. Add an HTTPS form endpoint only if direct form POST delivery is wanted.
- The canonical URL, Open Graph URL/image, JSON-LD URL and sitemap currently use the private Sites deployment URL. Replace them if a custom public domain is connected.

## Editable constants

The fixed contact constants are at the top of `script.js` and mirrored in one config comment in `index.html`:

- `BRAND`
- `EMAIL`
- `WHATSAPP_NUMBER`
- `WHATSAPP_LINK`
- `FORM_ENDPOINT`

## Asset notes

The six editorial images were generated specifically for this site. Each has 640, 960 and 1440 pixel WebP and JPG variants. The HTML uses `<picture>`, responsive `srcset`, explicit dimensions and lazy loading below the fold.

`assets/myimage.png` is Adeel's source portrait. The site serves optimized 480 and 800 pixel WebP/JPG derivatives while preserving the original file.
