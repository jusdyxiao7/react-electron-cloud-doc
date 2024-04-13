/**
 * @作者 Conor Sun
 * @开源仓库 $ http://github.com/jusdyxiao7
 * @创建时间 2024/4/13 0013 下午 13:57
 */
export const flattenArr = (arr) => {
  return arr.reduce((map, item) => {
      map[item.id] = item
      return map
  }, {})
}

export const objToArr = (obj) => {
  return Object.keys(obj).map(key => obj[key])
}
