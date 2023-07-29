import dayjs from 'dayjs'
require('dayjs/locale/ru')

function formatDate(date) {
  return dayjs(date).format("DD/MM/YYYY")
}

export {
  formatDate
}
