#!/usr/bin/env bash

set -euo pipefail

cd "$(git rev-parse --show-toplevel)"
./scripts/plot.sh test-out/box-corners.csv
