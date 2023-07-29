export const select2Settings = {
  language: {
    errorLoading: function () {
      return 'Введите название в поиске выше';
    },
    loadingMore: function () {
      return 'Загрузка данных…';
    },
    noResults: function () {
      return 'Совпадений не найдено';
    },
    searching: function () {
      return 'Поиск…';
    },
    removeAllItems: function () {
      return 'Удалить все элементы';
    },
    removeItem: function () {
      return 'Удалить элемент';
    },
    search: function () {
      return 'Поиск';
    }
  },
  placeholder: 'Выберите из списка',
  containerCssClass: 'm-1'
}
export const select2SettingsMulti = {
  language: {
    errorLoading: function () {
      return 'Введите название в поиске выше';
    },
    loadingMore: function () {
      return 'Загрузка данных…';
    },
    noResults: function () {
      return 'Совпадений не найдено';
    },
    searching: function () {
      return 'Поиск…';
    },
    removeAllItems: function () {
      return 'Удалить все элементы';
    },
    removeItem: function () {
      return 'Удалить элемент';
    },
    search: function () {
      return 'Поиск';
    }
  },
  placeholder: 'Выберите из списка',
  containerCssClass: 'm-1',
  multiple: true
}

function select2Format(data, id, text) {
  if (!data) return []
  return data.map(i => ({ id: i[id], text: i[text]}))
}

export {
  select2Format
}
