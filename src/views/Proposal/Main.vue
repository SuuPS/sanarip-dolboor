<template>
  <div>
    <h2 class="intro-y text-lg font-medium mt-10">Заявки</h2>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
        <div class="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
          <div class="w-56 relative text-gray-700 dark:text-gray-300">
            <input
              type="text"
              class="form-control w-56 box pr-10 placeholder-theme-13"
              placeholder="Поиск..."
            />
            <SearchIcon
              class="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"
            />
          </div>
        </div>
      </div>
      <div class="intro-y box rounded-xl mt-3 col-span-12">
        <div class="flex flex-col sm:flex-row items-center border-b border-gray-200 dark:border-dark-5">
          <div class="grid grid-cols-12 gap-2 w-full rounded-xl border border-gray-400 dark:border-dark-5">
            <div class="col-span-12 pb-3 pt-3">
              <EasyDataTable
                v-model:server-options="serverOptions"
                :server-items-length="serverItemsLength"
                :headers="headers"
                :items="shortenedContent"
                :rows-per-page="5"
                :rows-per-page-message="'Показать по'"
                :rows-of-page-separator-message="'из'"
                :empty-message="'Данные не найдены'"
                theme-color="#2e69d9"
                table-class-name="customize-table"
                :alternating="true"
                buttons-pagination
                :headerItemClassName="'whitespace-nowrap'"
                :bodyItemClassName="'whitespace-nowrap'">
                <template>
                  <div class="previous-page__click-button first-page" data-v-c9da5286="">
                    <span class="arrow arrow-right" data-v-c9da5286=""></span>
                  </div>
                  <div class="buttons-pagination" data-v-4c681fa2="" data-v-19cc4b1b="" style="--40dd4f07: #2e69d9;">
                    <div class="item button active" data-v-4c681fa2="">1</div>
                  </div>
                  <div class="next-page__click-button last-page" data-v-c9da5286="">
                    <span class="arrow arrow-left" data-v-c9da5286="">
                    </span>
                  </div>
                </template>
                <template #item-actions="item">
                  <div class="dropdown">
                    <button
                      class="dropdown-toggle btn btn-sm btn-primary shadow-md px-2"
                      aria-expanded="false">
                    <span class="flex items-center justify-center">
                      <ChevronDownIcon class="w-4 h-4 mr-2"/> Действия
                    </span>
                    </button>
                    <div class="dropdown-menu w-52">
                      <div class="dropdown-menu__content box dark:bg-dark-1 p-2">
                        <a
                          href="javascript:;"
                          data-toggle="modal"
                          data-target="#specialist-add-modal"
                          @click="openModal(item.id)"
                          class="flex items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"
                        >
                          <CheckIcon class="w-4 h-4 mr-2"/>
                          Одобрить
                        </a>
                        <a
                          href="javascript:;"
                          data-toggle="modal"
                          data-target="#user-schedule-modal"
                          @click="loadUserSchedule()"
                          class="flex items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"
                        >
                          <XIcon class="w-4 h-4 mr-2"/>
                          Отклонить
                        </a>
                      </div>
                    </div>
                  </div>
                </template>
                <template #item-fio="item">
                  {{ item.lastName }} {{ item.firstName }} {{ item.patronymic }}
                </template>
              </EasyDataTable>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, watch, reactive} from "vue";
import {ProductService, ProposalService} from "@/services"
import EasyDataTable, {Header, ServerOptions, Item} from "vue3-easy-data-table";
import 'vue3-easy-data-table/dist/style.css';

const headers = ref([
  {text: 'Действия', value: 'actions'},
  {text: 'Статус заявки', value: 'statusZayavki'},
  {text: 'Номер документа', value: 'registrasionyiNomerSgr'},
  {text: 'Дата документа', value: 'dataRegistrasii'},
  {text: 'Номер бланка', value: 'nomerBlanka'},
  {text: 'Продукция', value: 'name'},
  {text: 'Изготовитель', value: 'naimenovanieIAddressIzgotovitelya'},
  {text: 'Заявитель', value: 'naimenovanieIAdressZaiavitela'},
  {text: 'Действие до ', value: 'srokDistvia'},
  {text: 'Кто подписал ', value: 'doljnost'},
])

const items = ref([]);

const shortenedContent = computed(() =>
  items.value.map((item) => {
    return {
      ...item,
      name: item.name.substring(0, 50) + '...',
      naimenovanieIAddressIzgotovitelya: item.naimenovanieIAddressIzgotovitelya.substring(0, 50) + '...',
      naimenovanieIAdressZaiavitela: item.naimenovanieIAdressZaiavitela.substring(0, 50) + '...',
      srokDistvia: item.srokDistvia ? item.srokDistvia.name : '',
      doljnost: item.doljnost ? item.doljnost.name : '',
      statusZayavki: item.statusZayavki ? item.statusZayavki.name : ''
    };

    return item;
  })
);

const serverItemsLength = ref(0);
const serverOptions = ref({
  page: 1,
  rowsPerPage: 5,
});

const restApiUrl = computed(() => {
  const {page, rowsPerPage, sortBy, sortType} = serverOptions.value;
  console.log(sortBy);
  console.log(sortType);
  if (sortBy && sortType) {
    return `http://localhost:8080/api?page=${page}&limit=${rowsPerPage}&sortBy=${sortBy}&sortType=${sortType}`;
  } else {
    return `http://localhost:8080/api?page=${page}&limit=${rowsPerPage}`;
  }
});

const loading = ref(false);

async function loadFromServer() {
  loading.value = true;
  try {
    const response = await ProposalService.getProposalList(
      {page: serverOptions.value.page, size: serverOptions.value.rowsPerPage}
    )
    console.log(response.data)
    items.value = response.data.content;
    serverItemsLength.value = response.data.size;
    loading.value = false;
  } catch (e) {
    console.log(e)
  }
}

// first load when created
loadFromServer();

watch(
  serverOptions,
  (value) => {
    loadFromServer();
  },
  {deep: true}
);
</script>
