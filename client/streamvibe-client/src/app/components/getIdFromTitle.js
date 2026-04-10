// Converts text to HTML-compatible ID (lowercase, spaces → dashes)
const getIdFromTitle = (title) => {
  return title.toLocaleLowerCase().replaceAll(' ', '-')
}

export default getIdFromTitle