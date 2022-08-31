# HACK: We're backgrounding the join to our Replica Set because
# the default cointainer boostrap scripts strip away our replSet
# CLI arguments causing it fail.
# https://github.com/docker-library/mongo/blob/ee1d6955bcc15c4a74ef6fcc60a5a5bc37739bf7/6.0/docker-entrypoint.sh#L310
# So this method waits till the real startup happens (with our CLI args)
# so that it can run succesfully
join_replica_set() {
  echo "Sleeping to allow server to start"
  sleep 10
  echo "Joining replica set"
  mongosh -u root -p example --quiet /healthcheck/healthcheck.js
  echo "Joined replica set"
}

join_replica_set &
