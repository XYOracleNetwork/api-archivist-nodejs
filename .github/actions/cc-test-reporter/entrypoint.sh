#!/bin/bash -e

# Execute the subcommand passed into us
cc-test-reporter ${1}
time=$(date)
echo ::set-output name=time::$time
