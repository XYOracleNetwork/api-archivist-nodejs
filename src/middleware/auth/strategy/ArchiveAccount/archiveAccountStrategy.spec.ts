describe('ArchiveAccountStrategy', () => {
  describe('with no archive permissions', () => {
    describe('with allowed address', () => {
      it('allows operation by address', async () => {
        // TODO:
      })
    })
    describe('with anonymous', () => {
      it('allows operation', async () => {
        // TODO:
      })
    })
  })
  describe('with archive permissions', () => {
    describe('for allowing', () => {
      describe('address', () => {
        describe('with allowed address', () => {
          it('allows operation by address', async () => {
            // TODO:
          })
        })
        describe('with address not in allowed list', () => {
          it('disallows operation by address', async () => {
            // TODO:
          })
        })
        describe('with anonymous', () => {
          it('disallows operation', async () => {
            // TODO:
          })
        })
      })
      describe('schema', () => {
        describe('with allowed schema', () => {
          it('allows operation by address', async () => {
            // TODO:
          })
        })
        describe('with schema not in allowed list', () => {
          it('disallows operation by address', async () => {
            // TODO:
          })
        })
      })
    })
    describe('for rejecting', () => {
      describe('address', () => {
        describe('with disallowed address', () => {
          it('disallows operation by address', async () => {
            // TODO:
          })
        })
        describe('with address not in disallowed list', () => {
          it('TODO: allows operation by address', async () => {
            // TODO:
          })
        })
        describe('with anonymous address', () => {
          it('TODO: allows operation by address', async () => {
            // TODO:
          })
        })
      })
      describe('schema', () => {
        describe('with disallowed schema', () => {
          it('disallows operation by address', async () => {
            // TODO:
          })
        })
        describe('with schema not in disallowed list', () => {
          it('allows operation by address', async () => {
            // TODO:
          })
        })
      })
    })
  })
})
