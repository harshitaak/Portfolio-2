# SVG CSS Colorizer wrapper for Windows PowerShell
# Usage: .\colorize.ps1 -SVG icon.svg -CSS styles.css -Out icon.inline.svg

param(
    [Parameter(Mandatory=$true, HelpMessage="Path to input SVG file")]
    [string]$SVG,

    [Parameter(Mandatory=$true, HelpMessage="Path to CSS file with custom properties")]
    [string]$CSS,

    [Parameter(Mandatory=$true, HelpMessage="Path to write the modified SVG")]
    [string]$Out
)

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$pythonScript = Join-Path $scriptPath "svg_colorize.py"

# Run the Python script
python3 $pythonScript --svg $SVG --css $CSS --out $Out
