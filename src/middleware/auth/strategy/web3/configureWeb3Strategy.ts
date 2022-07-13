import passport from 'passport'

export const web3StrategyName = 'web3'
export const web3Strategy = passport.authenticate(web3StrategyName, { session: false })

export const configureWeb3Strategy = () => {
  // passport.use(web3StrategyName, new Web3AuthStrategy())
}
