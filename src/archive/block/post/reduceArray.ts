const reduceArray = <T>(items: T[][]) => {
  return items.reduce((acc, value) => acc.concat(value), [])
}
export default reduceArray
