# Using Node here because:
#   - We use it elsewhere in our build/deploy so it's audited
#   - It already has curl/gpg installed
#   - We might want to pivot to a Node GitHub action
#   - We might want to run Node.js code
FROM node:16

WORKDIR /reporter

# The Version of the pre-compiled CodeClimate test-reporter to use
ENV VERSION=0.10.3
ENV REPORTER=test-reporter-${VERSION}-linux-amd64

# Download the binary
RUN curl -sSL -O https://codeclimate.com/downloads/test-reporter/${REPORTER}
# Download the hash
RUN curl -sSL -O https://codeclimate.com/downloads/test-reporter/${REPORTER}.sha256
# Verify the hash
RUN grep ${REPORTER}  ${REPORTER}.sha256 | shasum -a 256 -c -

# Download the signature
RUN curl -sSL -O https://codeclimate.com/downloads/test-reporter/${REPORTER}.sha256.sig
# Import public key
RUN gpg --keyserver  keys.openpgp.org --recv-keys 9BD9E2DD46DA965A537E5B0A5CBF320243B6FD85
# Verify the signature
RUN gpg --verify ${REPORTER}.sha256.sig ${REPORTER}.sha256

# Make the binary executable
RUN chmod +x ${REPORTER}

# Move the verified binary to a directory in the PATH
RUN cp ${REPORTER} /usr/local/bin/cc-test-reporter

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
