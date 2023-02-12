#!/bin/bash

cd ../lib/rnmapbox/

yarn link

cd ../../

yarn link "@rnmapbox/maps"

yarn install
