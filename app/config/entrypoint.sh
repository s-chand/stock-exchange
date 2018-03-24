#!/bin/bash

set -eux

npm run prune
npm run migration
npm run seed
npm start