#!/bin/sh

set -e

host="$1"
shift
cmd="$@"

timeout=60
count=0

until PGPASSWORD=$DB_PASSWORD psql -h "$host" -U $DB_USERNAME -d $DB_NAME -c '\q'; do
  >&2 echo "PostgreSQL is unavailable - sleeping"
  sleep 1
  count=$((count+1))
  if [ $count -ge $timeout ]; then
    >&2 echo "Timeout reached - PostgreSQL not available"
    exit 1
  fi
done

>&2 echo "PostgreSQL is up - executing command"
exec $cmd