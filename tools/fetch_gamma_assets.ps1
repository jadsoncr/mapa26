<#
PowerShell helper to download candidate Gamma assets and fonts.
Run locally from the repo root with: `powershell -ExecutionPolicy Bypass -File .\tools\fetch_gamma_assets.ps1`

This script downloads permissively-licensed example assets (Unsplash/Pixabay) and Google Fonts woff2 files.
It is a convenience tool — verify the license of each downloaded file before using in production.
#>

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $repoRoot

# Ensure directories
$gammaDir = Join-Path $repoRoot 'assets\gamma'
$fontsDir = Join-Path $repoRoot 'layout\fonts'
New-Item -ItemType Directory -Force -Path $gammaDir | Out-Null
New-Item -ItemType Directory -Force -Path $fontsDir | Out-Null

# Candidate URLs (you can edit these to preferred images)
# Candidate hero/background URLs (script will try each in order until one succeeds)
# Prefer an exact export from the Gamma PDF; these are permissive candidates to use temporarily.
$heroCandidates = @(
    # Unsplash source by query (returns a random matching photo)
    'https://source.unsplash.com/1600x900/?beige,texture,paper',
    # Alternative texture query
    'https://source.unsplash.com/1600x900/?soft,beige,background',
    # Pixabay sample search image (direct download candidate)
    'https://cdn.pixabay.com/photo/2017/08/10/07/44/paper-2611106_1280.jpg'
)

# Candidate symbolic illustration URLs (PNGs preferred)
$symbolCandidates = @(
    'https://cdn.pixabay.com/photo/2013/07/13/13/41/butterfly-159212_1280.png',
    'https://openclipart.org/download/2821',
    'https://cdn.pixabay.com/photo/2016/03/31/19/56/butterfly-1294340_1280.png'
)

# Google Fonts CSS endpoints (we will fetch woff2 file URLs from stylesheets)
$cormorantCss = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&display=swap'
$interCss = 'https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap'

Write-Host 'Downloading candidate hero background (trying candidates)...'
$heroTarget = Join-Path $gammaDir 'hero-bg.jpg'
$downloadedHero = $false
foreach($u in $heroCandidates){
    try{
        Invoke-WebRequest -Uri $u -OutFile $heroTarget -UseBasicParsing -ErrorAction Stop -TimeoutSec 30
        Write-Host "Wrote $heroTarget from $u"
        $downloadedHero = $true
        break
    } catch {
        Write-Warning "Failed to download from $u — trying next candidate"
    }
}
if(-not $downloadedHero){ New-Item -Path (Join-Path $gammaDir 'hero-bg.jpg.TODO') -ItemType File -Force | Out-Null }

Write-Host 'Downloading candidate symbolic illustration (trying candidates)...'
$symbolTarget = Join-Path $gammaDir 'symbolic-illustration.png'
$downloadedSymbol = $false
foreach($u in $symbolCandidates){
    try{
        Invoke-WebRequest -Uri $u -OutFile $symbolTarget -UseBasicParsing -ErrorAction Stop -TimeoutSec 30
        Write-Host "Wrote $symbolTarget from $u"
        $downloadedSymbol = $true
        break
    } catch {
        Write-Warning "Failed to download from $u — trying next candidate"
    }
}
if(-not $downloadedSymbol){ New-Item -Path (Join-Path $gammaDir 'symbolic-illustration.png.TODO') -ItemType File -Force | Out-Null }

function Download-Woff2FromGoogleCss($cssUrl, $fontNamePref, $outDir){
    try{
        $css = (Invoke-WebRequest -Uri $cssUrl -UseBasicParsing -ErrorAction Stop).Content
        # parse for woff2 URL
        if($css -match 'url\((https:[^)]*\.woff2)'){
            $woff2 = $Matches[1]
            $fileName = "$fontNamePref-woff2"
            $out = Join-Path $outDir ([IO.Path]::GetFileName($woff2))
            Write-Host "Downloading $woff2 -> $out"
            Invoke-WebRequest -Uri $woff2 -OutFile $out -UseBasicParsing -ErrorAction Stop
            Write-Host "Wrote $out"
            return $out
        } else {
            Write-Warning "No woff2 URL found in CSS for $cssUrl"
            return $null
        }
    } catch {
        Write-Warning "Failed to fetch CSS or download font: $_"
        return $null
    }
}

Write-Host 'Attempting to download Cormorant Garamond woff2 from Google Fonts CSS...'
$c1 = Download-Woff2FromGoogleCss -cssUrl $cormorantCss -fontNamePref 'CormorantGaramond' -outDir $fontsDir
Write-Host 'Attempting to download Inter woff2 from Google Fonts CSS...'
$c2 = Download-Woff2FromGoogleCss -cssUrl $interCss -fontNamePref 'Inter' -outDir $fontsDir

# If downloads failed, create TODO files
if(-not $c1){ New-Item -Path (Join-Path $fontsDir 'CormorantGaramond-FAILED.TODO') -ItemType File -Force | Out-Null }
if(-not $c2){ New-Item -Path (Join-Path $fontsDir 'Inter-FAILED.TODO') -ItemType File -Force | Out-Null }

Write-Host 'Done. Please review files in assets/gamma and layout/fonts. Replace with original Gamma exports when available.'
Pop-Location
