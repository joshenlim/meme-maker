export const splitIntoColumns = (memes, columns = 4) => {
  const data = {}
  for (let column = 0; column < columns; column++) {
    const columnContent = memes.filter((meme, idx) => idx % columns === column)
    data[column] = columnContent
  }
  return Object.values(data)
}