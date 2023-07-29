function select2Format(data, id, text) {
  if (!data) return []
  return data.map(i => ({ id: i[id], text: i[text]}))
}

export {
  select2Format
}