#!/bin/bash -eux

# Ensure the keyfile has the exact file permissions Mongo requires
chmod 400 /etc/mongodb/mongodb.key
