Candidate resources for Gamma assets (temporary — verify licenses)

Goal: provide near-identical visual assets until you can supply the originals exported from the Gamma PDF.

Hero background candidates (high-res, free-to-use options to consider):
- Unsplash (search): https://unsplash.com/s/photos/beige-texture
  - Quick download endpoint example (random matching image): `https://source.unsplash.com/1600x900/?beige,texture,paper`
- Pexels (search): https://www.pexels.com/search/beige%20texture/
  - Prefer selecting one high-res JPG from Pexels and adding it to `/assets/gamma/hero-bg.jpg`.
- Pixabay (direct candidate example): https://pixabay.com/images/search/beige%20paper/
  - Example direct JPG used as fallback in script: `https://cdn.pixabay.com/photo/2017/08/10/07/44/paper-2611106_1280.jpg`

Symbolic illustration candidates (butterfly / decorative PNG with transparency):
- Pixabay (search): https://pixabay.com/images/search/butterfly%20png/
  - Example direct PNGs used as candidates in the script:
    - `https://cdn.pixabay.com/photo/2013/07/13/13/41/butterfly-159212_1280.png`
    - `https://cdn.pixabay.com/photo/2016/03/31/19/56/butterfly-1294340_1280.png`
- OpenClipart (search / download): https://openclipart.org/search/?query=butterfly
  - Example direct download endpoint used as candidate: `https://openclipart.org/download/2821`

Fonts (preferred):
- `Cormorant Garamond` (used in layout). Source: Google Fonts — https://fonts.google.com/specimen/Cormorant+Garamond
  - The script will attempt to download woff2 files from Google Fonts CSS, but you can also manually download and place:
    - `/layout/fonts/CormorantGaramond-Regular.woff2`
    - `/layout/fonts/CormorantGaramond-SemiBold.woff2`
- `Inter` for UI text: https://rsms.me/inter/ or Google Fonts https://fonts.google.com/specimen/Inter
  - Manual filename: `/layout/fonts/Inter-Regular.woff2`

Suggested local filenames (place in repo):
- /assets/gamma/hero-bg.jpg  <-- original Gamma hero JPG (or candidate download)
- /assets/gamma/symbolic-illustration.png <-- transparent PNG (candidate)
- /layout/fonts/CormorantGaramond-Regular.woff2
- /layout/fonts/CormorantGaramond-SemiBold.woff2
- /layout/fonts/Inter-Regular.woff2

Licensing notes:
- Prefer assets with permissive licenses (Unsplash, Pexels, Pixabay CC0) for temporary use.
- Keep the original Gamma exports if available; replace placeholders with originals and remove candidate attribution.

How to proceed:
1. Run the script `tools/fetch_gamma_assets.ps1` (created next) to attempt automated download of candidates.
2. Review downloaded files in `assets/gamma/` and `layout/fonts/`, confirm visual match.
3. Replace with Gamma originals when you provide them.

If you want, I can suggest 3 specific Unsplash/Pixabay image URLs to pick from — tell me if you prefer that and I will list exact URLs.