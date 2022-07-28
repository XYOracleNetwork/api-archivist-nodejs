import { parse, parseValue } from 'graphql'
import jsonLogic, { add_operation, AdditionalOperation, apply, RulesLogic } from 'json-logic-js'
import Parser from 'tree-sitter'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const JavaScript = require('tree-sitter-javascript')

const etherscan = {
  _archive: 'crypto-price-witness',
  _client: 'js',
  _hash: 'e2cea65d6edd47f989ff69ce9c3fa2cb88701ec7633b043a91097e2929531ac8',
  _id: '62e1fb7e2b73ac88954d08b2',
  _observeDuration: 850,
  _timestamp: 1658977150287,
  fastGasPrice: 21,
  gasUsedRatio: [0, 0.541059411841768, 0.315635066666667, 0.5426802, 0.999748433333333],
  lastBlock: 15228424,
  proposeGasPrice: 20,
  safeGasPrice: 19,
  schema: 'network.xyo.blockchain.ethereum.gas.etherscan',
  suggestBaseFee: 18.454535356,
  timestamp: 1658977140871,
}
const etherchainv1 = {
  _archive: 'crypto-price-witness',
  _client: 'js',
  _hash: '186f9b708903e3f85010f614988557aa1ff6cfff14777a5adf88777c176fac44',
  _id: '62e1fbbaabeb1d90e63cd24f',
  _observeDuration: 73,
  _timestamp: 1658977210434,
  currentBaseFee: 16.4,
  fast: 1.5,
  fastest: 2.4,
  recommendedBaseFee: 33.3,
  safeLow: 1,
  schema: 'network.xyo.blockchain.ethereum.gas.etherchain.v1',
  standard: 1,
  timestamp: 1658977200080,
}
const etherchainv2 = {
  _archive: 'crypto-price-witness',
  _client: 'js',
  _hash: '50b5fe2d9bfe934060e1bc5280540a8f3b27c4e2c5d36b8a1ed7b44e5fd1b87e',
  _id: '62e1fbbaabeb1d90e63cd250',
  _observeDuration: 83,
  _timestamp: 1658977210434,
  code: 200,
  data: {
    fast: 21321265016,
    priceUSD: 1614.13,
    rapid: 23646680509,
    slow: 6000000000,
    standard: 13000000000,
    timestamp: 1658977194501,
  },
  schema: 'network.xyo.blockchain.ethereum.gas.etherchain.v2',
  timestamp: 1658977200091,
}

const uniswap = {
  _archive: 'crypto-price-witness',
  _client: 'js',
  _hash: 'bef73d36488c71ef4f3fc75a33fae1c66528fcf3f943308571b8e6ce77ac3e61',
  _id: '62e283ababeb1d90e642810d',
  _observeDuration: 11413,
  _timestamp: 1659012011449,
  pairs: [
    {
      tokens: [
        {
          address: '0x55296f69f40Ea6d20E478533C15A6B08B654E758',
          symbol: 'xyo',
          value: 0.00000896773,
        },
        {
          address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'weth',
          value: 111511,
        },
      ],
    },
    {
      tokens: [
        {
          address: '0x55296f69f40Ea6d20E478533C15A6B08B654E758',
          symbol: 'xyo',
          value: 0.0148782,
        },
        {
          address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          symbol: 'usdt',
          value: 67.2123,
        },
      ],
    },
    {
      tokens: [
        {
          address: '0x55296f69f40Ea6d20E478533C15A6B08B654E758',
          symbol: 'xyo',
          value: 0.014039,
        },
        {
          address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          symbol: 'dai',
          value: 71.2301,
        },
      ],
    },
    {
      tokens: [
        {
          address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
          symbol: 'wbtc',
          value: 1527240,
        },
        {
          address: '0x55296f69f40Ea6d20E478533C15A6B08B654E758',
          symbol: 'xyo',
          value: 6.54777e-7,
        },
      ],
    },
    {
      tokens: [
        {
          address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
          symbol: 'link',
          value: 453.816,
        },
        {
          address: '0x55296f69f40Ea6d20E478533C15A6B08B654E758',
          symbol: 'xyo',
          value: 0.00220354,
        },
      ],
    },
    {
      tokens: [
        {
          address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
          symbol: 'wbtc',
          value: 14.0836,
        },
        {
          address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'weth',
          value: 0.0710048,
        },
      ],
    },
    {
      tokens: [
        {
          address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          symbol: 'dai',
          value: 1.00004,
        },
        {
          address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          symbol: 'usdc',
          value: 0.999959,
        },
      ],
    },
    {
      tokens: [
        {
          address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          symbol: 'usdc',
          value: 0.000616944,
        },
        {
          address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'weth',
          value: 1620.89,
        },
      ],
    },
    {
      tokens: [
        {
          address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          symbol: 'usdc',
          value: 0.000617196,
        },
        {
          address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'weth',
          value: 1620.23,
        },
      ],
    },
    {
      tokens: [
        {
          address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          symbol: 'dai',
          value: 1.00002,
        },
        {
          address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          symbol: 'usdc',
          value: 0.999983,
        },
      ],
    },
    {
      tokens: [
        {
          address: '0x853d955aCEf822Db058eb8505911ED77F175b99e',
          symbol: 'frax',
          value: 0.999762,
        },
        {
          address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          symbol: 'usdc',
          value: 1.00024,
        },
      ],
    },
    {
      tokens: [
        {
          address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
          symbol: 'wbtc',
          value: 22826.3,
        },
        {
          address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          symbol: 'usdc',
          value: 0.000043809,
        },
      ],
    },
    {
      tokens: [
        {
          address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          symbol: 'usdc',
          value: 0.999853,
        },
        {
          address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          symbol: 'usdt',
          value: 1.00015,
        },
      ],
    },
  ],
  schema: 'network.xyo.crypto.market.uniswap',
  timestamp: 1659012011418,
}
const coingecko = {
  _archive: 'crypto-price-witness',
  _client: 'js',
  _hash: '277cd5c60ee90b9cd06206afdf4f89bfcc0e7a91b51db501fc33d0a1b5610a81',
  _id: '62e283e6abeb1d90e64284b5',
  _observeDuration: 783,
  _timestamp: 1659012070924,
  assets: {
    ada: {
      btc: 0.00002163,
      eth: 0.00030472,
      eur: 0.488106,
      usd: 0.495442,
    },
    btc: {
      btc: 1,
      eth: 14.068021,
      eur: 22545,
      usd: 22884,
    },
    busd: {
      btc: 0.00004342,
      eth: 0.00061145,
      eur: 0.979882,
      usd: 0.994609,
    },
    doge: {
      btc: 0.00000288,
      eth: 0.00004062,
      eur: 0.065066,
      usd: 0.066044,
    },
    dot: {
      btc: 0.00033067,
      eth: 0.00465702,
      eur: 7.46,
      usd: 7.58,
    },
    eth: {
      btc: 0.07099216,
      eth: 1,
      eur: 1602.25,
      usd: 1626.33,
    },
    sol: {
      btc: 0.00173417,
      eth: 0.02442315,
      eur: 39.14,
      usd: 39.73,
    },
    usdc: {
      btc: 0.00004371,
      eth: 0.00061556,
      eur: 0.986471,
      usd: 1.001,
    },
    usdt: {
      btc: 0.0000437,
      eth: 0.00061548,
      eur: 0.986332,
      usd: 1.001,
    },
    wbtc: {
      btc: 1.000635,
      eth: 14.092397,
      eur: 22584,
      usd: 22923,
    },
    xyo: {
      btc: 6.28282e-7,
      eth: 0.00000885,
      eur: 0.01417995,
      usd: 0.01439307,
    },
  },
  schema: 'network.xyo.crypto.market.coingecko',
  timestamp: 1659012060785,
}

describe.skip('graphql', () => {
  const graphql = `query Hero($episode: Episode, $withFriends: Boolean!) {
    hero(episode: $episode) {
      name
      friends @include(if: $withFriends) {
        name
      }
    }
  }`
  it('parse', () => {
    const results = parse(graphql)
    console.log(results)
  })
  it.skip('parseValue', () => {
    const results = parseValue(graphql)
    console.log(results)
  })
})

describe.skip('tree-sitter', () => {
  it('parse', () => {
    const parser = new Parser()
    parser.setLanguage(JavaScript)
    const sourceCode = 'let x = 1; console.log(x);'
    const tree = parser.parse(sourceCode)
    console.log(tree)
  })
})
describe.skip('map/reduce', () => {
  it('parse', () => {
    const filterPredicate = (n: number | undefined): n is number => !!n
    const coingeckoPrice = coingecko?.assets?.xyo?.usd
    const uniswapPrice = uniswap.pairs
      .map((p) => p.tokens)
      .filter((t) => t.some((t) => t.symbol === 'xyo'))
      ?.find((t) => t.some((t) => t.symbol === 'usdt'))
      ?.find((t) => t.symbol === 'xyo')?.value
    const xyoPrice = [coingeckoPrice, uniswapPrice].filter<number>(filterPredicate).reduce((a, b) => a + b) / 2
    // const average = (prices: number[]) => prices.reduce((a, b) => a + b) / prices.length
    console.log(coingeckoPrice)
    console.log(uniswapPrice)
    console.log(xyoPrice)
  })
})
describe('JSON Logic', () => {
  it('parse', () => {
    const coingeckoPrice = apply({ var: 'assets.xyo.usd' }, coingecko)
    console.log(coingeckoPrice)
    console.log('===============================')

    // const getTokenPairs: RulesLogic<AdditionalOperation> = { map: [{ var: 'uniswap.pairs' }, { var: 'tokens' }] }

    const getXyoTokenFromPair: RulesLogic<AdditionalOperation> = { filter: [{ var: 'tokens' }, { '===': [{ var: 'symbol' }, 'xyo'] }] }
    const tokens = uniswap.pairs
      .map((p) => p.tokens)
      .filter((t) => t.some((t) => t.symbol === 'xyo'))
      ?.find((t) => t.some((t) => t.symbol === 'usdt'))
    console.log(tokens)
    const a = apply(getXyoTokenFromPair, { tokens })
    console.log(a)
    console.log('===============================')

    const singularArray = uniswap.pairs
      .map((p) => p.tokens)
      .filter((t) => t.some((t) => t.symbol === 'xyo'))
      ?.find((t) => t.some((t) => t.symbol === 'usdt'))
      ?.map((x) => x)
    singularArray?.pop()
    console.log(singularArray)
    const getXyoTokenFromArray: RulesLogic<AdditionalOperation> = { reduce: [{ var: 'tokens' }, { or: [{ var: 'current' }, { var: 'accumulator' }] }, {}] }
    const b = apply(getXyoTokenFromArray, { tokens: singularArray })
    console.log(b)
    console.log('===============================')

    const token = uniswap.pairs
      .map((p) => p.tokens)
      .filter((t) => t.some((t) => t.symbol === 'xyo'))
      ?.find((t) => t.some((t) => t.symbol === 'usdt'))
      ?.find((t) => t.symbol === 'xyo')
    console.log(token)
    const getTokenPrice: RulesLogic<AdditionalOperation> = { var: 'token.value' }
    const c = apply(getTokenPrice, { token })
    console.log(c)
    console.log('===============================')

    // TODO: How to do rule nesting
    // https://github.com/jwadhams/json-logic-js/#compound
    const combined = apply(getTokenPrice, { token: apply(getXyoTokenFromArray, { tokens: apply(getXyoTokenFromPair, { tokens }) }) })
    console.log(combined)
  })
})
