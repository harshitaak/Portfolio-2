#!/bin/bash
# SVG CSS Colorizer wrapper for bash
# Usage: ./colorize.sh --svg icon.svg --css styles.css --out icon.inline.svg

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PYTHON_SCRIPT="$SCRIPT_DIR/svg_colorize.py"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --svg)
            SVG="$2"
            shift 2
            ;;
        --css)
            CSS="$2"
            shift 2
            ;;
        --out)
            OUT="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Validate arguments
if [[ -z "$SVG" || -z "$CSS" || -z "$OUT" ]]; then
    echo "Usage: $0 --svg <path> --css <path> --out <path>"
    exit 1
fi

# Run the Python script
python3 "$PYTHON_SCRIPT" --svg "$SVG" --css "$CSS" --out "$OUT"
