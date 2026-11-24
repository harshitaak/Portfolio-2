# SVG Colorize + Inline Workflow for Large SVGs with Hardcoded Colors
# This script replaces hardcoded hex colors with CSS variables and prepares for inlining

param(
    [string]$SvgPath = "",
    [string]$HtmlPath = "",
    [hashtable]$ColorMap = @{
        "#FF0000" = "var(--color-2)"
        "#FFBB00" = "var(--color-2)"
        "#EEFF00" = "var(--color)"
        "#00E6FF" = "var(--color-3)"
        "white" = "var(--ink)"
    }
)

if (-not $SvgPath -or -not (Test-Path $SvgPath)) {
    Write-Host "Usage: .\colorize-inline-workflow.ps1 -SvgPath 'path/to/Fig.svg' -HtmlPath 'path/to/page.html' -ColorMap @{'#FF0000'='var(--color)'}"
    exit 1
}

Write-Host "🎨 SVG Colorize + Inline Workflow" -ForegroundColor Cyan
Write-Host ""

# Step 1: Read SVG
Write-Host "Step 1: Reading SVG file..." -ForegroundColor Yellow
$svgContent = Get-Content $SvgPath -Raw
Write-Host "✓ Loaded $(([math]::Round((Get-Item $SvgPath).Length / 1KB, 2))) KB" -ForegroundColor Green

# Step 2: Replace colors
Write-Host ""
Write-Host "Step 2: Replacing hardcoded colors with CSS variables..." -ForegroundColor Yellow
foreach ($hexColor in $ColorMap.Keys) {
    $cssVar = $ColorMap[$hexColor]
    if ($svgContent -match $hexColor) {
        $count = ($svgContent | Select-String -Pattern $hexColor -AllMatches).Matches.Count
        $svgContent = $svgContent -replace [regex]::Escape($hexColor), $cssVar
        Write-Host "  ✓ Replaced $hexColor → $cssVar ($count occurrence$(if ($count -ne 1) { 's' }))" -ForegroundColor Green
    }
}

# Step 3: Remove XML declaration
Write-Host ""
Write-Host "Step 3: Cleaning XML declaration..." -ForegroundColor Yellow
$svgContent = $svgContent -replace '<\?xml[^>]*\?>\s*', ''
Write-Host "✓ Removed XML declaration (not valid in HTML)" -ForegroundColor Green

# Step 4: Set responsive dimensions
Write-Host ""
Write-Host "Step 4: Making SVG responsive..." -ForegroundColor Yellow
# Replace width with 100% (or "stretch" works in modern browsers)
$svgContent = $svgContent -replace 'width="\d+"', 'width="100%"'
# Replace height with auto for responsive aspect ratio
$svgContent = $svgContent -replace 'height="\d+"', 'height="auto"'
Write-Host "✓ Set width=""100%"" height=""auto"" for responsive sizing" -ForegroundColor Green

# Step 5: Save to temp and show path
$tempPath = "$env:TEMP\svg-colorized.svg"
$svgContent | Set-Content $tempPath -Encoding UTF8
Write-Host ""
Write-Host "✓ SVG prepared at: $tempPath" -ForegroundColor Green
Write-Host ""

# Step 6: Inline into HTML if path provided
if ($HtmlPath -and (Test-Path $HtmlPath)) {
    Write-Host "Step 5: Inlining into HTML..." -ForegroundColor Yellow
    $htmlContent = Get-Content $HtmlPath -Raw

    # Simple replacement: look for img tag with src pointing to the SVG
    $imgPattern = '<img\s+[^>]*src="[^"]*Fig.*?svg"[^>]*\s*/?\s*>'

    if ($htmlContent -match $imgPattern) {
        $htmlContent = $htmlContent -replace $imgPattern, "      $svgContent"
        Set-Content -Path $HtmlPath -Value $htmlContent -Encoding UTF8
        Write-Host "✓ SVG inlined into $HtmlPath" -ForegroundColor Green
        Write-Host ""
        Write-Host "🎉 Complete! Your SVG will now:" -ForegroundColor Green
        Write-Host "   • Use CSS variables for dynamic theming"
        Write-Host "   • Adapt to light/dark mode automatically"
        Write-Host "   • Update when theme colors change"
    } else {
        Write-Host "⚠ Could not find img tag in HTML. Paste the SVG manually:" -ForegroundColor Yellow
        Write-Host "   Copy from: $tempPath" -ForegroundColor Gray
    }
} else {
    Write-Host "📋 Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Copy the SVG from: $tempPath" -ForegroundColor Gray
    Write-Host "   2. Find the <img> tag in your HTML" -ForegroundColor Gray
    Write-Host "   3. Replace it with the SVG content" -ForegroundColor Gray
    Write-Host "   4. Verify CSS variables are in scope on :root" -ForegroundColor Gray
}
