#!/bin/sh

set -eux

# Let Wait for postgres

/opt/app/wait-for-it.sh postgres:5432 -t 20

# Let's wait a lttle more
sleep 5

npm run migration
npm start