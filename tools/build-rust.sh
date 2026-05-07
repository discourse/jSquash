#!/bin/bash
set -e

SCRIPTDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if [ ! -z "$RUST_IMG" ]
then
  # Get part after ":" (https://stackoverflow.com/a/15149278/439965).
  IMG_SUFFIX=-${RUST_IMG#*:}
fi
IMG_NAME=squoosh-rust$IMG_SUFFIX
docker build -t $IMG_NAME --build-arg RUST_IMG - < "$SCRIPTDIR/rust.Dockerfile"
if [ -t 0 ]
then
  DOCKER_TTY_FLAGS="-it"
else
  DOCKER_TTY_FLAGS="-i"
fi
docker run $DOCKER_TTY_FLAGS --rm -v $PWD:/src $IMG_NAME "$@"
docker run --rm -v $PWD:/src --entrypoint chown $IMG_NAME -R "$(id -u):$(id -g)" /src/pkg /src/target 2>/dev/null || true
