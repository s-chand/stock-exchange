#!/bin/bash

set -eux

# Let Wait for postgres

/opt/app/wait-for-it.sh ${PGHOST}:5432 -t 20

# Let's wait a lttle more
sleep 5

npm run prune
npm run migration
npm run seed
npm start