#!/bin/bash -eux

# HACK: We're backgrounding the join to our Replica Set because
# the default cointainer boostrap scripts strip away our replSet
# CLI arguments causing it fail.
# https://github.com/docker-library/mongo/blob/ee1d6955bcc15c4a74ef6fcc60a5a5bc37739bf7/6.0/docker-entrypoint.sh#L310
# So this method waits till the real startup happens (with our CLI args)
# so that it can run succesfully
join_replica_set() {
  echo "Sleeping to allow server to start"
  # TODO: Instead of hardcoded sleep we could grab the forked PID
  # and wait for it to transition from running to <defunct>. Do so
  # if this becomes problematic.
  sleep 5
  echo "Joining replica set"
  mongosh -u "${MONGO_INITDB_ROOT_USERNAME}" -p "${MONGO_INITDB_ROOT_PASSWORD}" --quiet /opt/mongo/joinReplicaSet.js
  echo "Joined replica set"
}

# Ensure the keyfile has the exact file permissions Mongo requires
chmod 600 /etc/mongodb/mongodb.key

# Background the function execution to allow the script to complete
join_replica_set &
