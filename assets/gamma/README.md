Gamma assets folder — TEMP placeholders and TODOs

Files expected (1:1 with Gamma PDF):
- hero-bg.jpg    -> Place the Gamma hero JPG here.
- symbolic-illustration.png -> Place the Gamma illustration PNG here.
- [icons/...]

Current placeholders provided:
- hero-bg-placeholder.svg
- symbolic-illustration-placeholder.svg
- *.TODO files indicate missing original assets.

Next steps for you:
- Upload the original images from the Gamma PDF export into this folder using the exact filenames above.
- Provide original fonts (if any) so we can remove fallback and mark TODO as resolved.

Automated candidate fetch (optional):
- I created a convenience script `tools/fetch_gamma_assets.ps1` that attempts to download candidate hero/background and a symbolic illustration, and will also try to fetch `woff2` font files from Google Fonts CSS.
- Usage (run locally from the repo root):
	PowerShell:
	```powershell
	powershell -ExecutionPolicy Bypass -File .\tools\fetch_gamma_assets.ps1
	```
- Notes:
	- The script writes files to `assets/gamma/` and `layout/fonts/`.
	- The hero image URL inside the script is a placeholder — open `tools/fetch_gamma_assets.ps1` to replace with the exact Unsplash/Pexels image URL you prefer before running.
	- Verify each downloaded file's license/attribution. Replace with the original Gamma exports when available.

If you want, tell me to pick 3 exact Unsplash/Pixabay image URLs and I will update the script with those specific choices.
