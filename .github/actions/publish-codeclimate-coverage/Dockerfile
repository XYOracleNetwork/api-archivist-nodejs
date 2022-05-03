# Only, using Node here because:
#   - We use it elsewhere in our build/deploy so it's audited
#   - It already has curl/gpg installed
#   - We might want to pivot to a Node GitHub action
#   - We might want to run Node.js code
FROM node:16

WORKDIR /reporter

ENV VERSION=0.10.3
ENV REPORTER=test-reporter-${VERSION}-linux-amd64

# Download the binary
RUN curl -L -O https://codeclimate.com/downloads/test-reporter/test-reporter-${VERSION}-linux-amd64
# Download the hash
RUN curl -L -O https://codeclimate.com/downloads/test-reporter/test-reporter-${VERSION}-linux-amd64.sha256
# Verify the hash
RUN grep test-reporter-${VERSION}-linux-amd64  test-reporter-${VERSION}-linux-amd64.sha256 | shasum -a 256 -c -

# Download the signature
RUN curl -L -O https://codeclimate.com/downloads/test-reporter/test-reporter-${VERSION}-linux-amd64.sha256.sig
# Import public key
RUN gpg --keyserver  keys.openpgp.org --recv-keys 9BD9E2DD46DA965A537E5B0A5CBF320243B6FD85
# Verify the signature
RUN gpg --verify test-reporter-${VERSION}-linux-amd64.sha256.sig test-reporter-${VERSION}-linux-amd64.sha256

# Move the verified binary to a directory in the PATH
RUN cp ./test-reporter-${VERSION}-linux-amd64 /usr/local/bin
RUN chmod +x /usr/local/bin/test-reporter-${VERSION}-linux-amd64

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
