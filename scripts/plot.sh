#!/usr/bin/env bash

set -euo pipefail

if ! command -v gnuplot &>/dev/null; then
    echo "gnuplot is required for plotting data, please install it."
    exit 1
fi

mkdir -p test-out
npm test &>/dev/null || { echo "Tests failed"; exit 1; }
gnuplot --persist -c "gplot/3d-splot.gpi" "$@"
