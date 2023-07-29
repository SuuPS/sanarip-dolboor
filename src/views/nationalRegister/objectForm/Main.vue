<script setup>

import {useRoute} from 'vue-router';
import {computed, reactive, watchEffect, watch, onMounted, ref, toRefs} from 'vue';
import {
  CodeProductService, CodeTnVedService, DurationService, TypeFirmService,
  CountryService, PositionWorkService, ProductService, ConformityService, VidTovara
} from "@/services";
import {createToast} from "mosha-vue-toastify";
import {helpers, required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import Select2 from "vue3-select2-component";
import {select2Settings, select2SettingsMulti} from "@/helpers/select2Settings";
import {jsPDF} from "jspdf";
import font from "@/assets/js/times_new_roman";
import BackgroundImage from '@/assets/talon.png'
import BackgroundImage2 from '@/assets/tanon2.png'
import store from '@/store'

const user = store.state.auth.user.user;

const cause = ref(null)
const thisPage = ref('MAIN')

function changePage(page) {
  thisPage.value = page
}

const couseList = ref([])

const selectedFile = ref(null)

const uploadedFiles = ref([])

const onChangeFile = (event) => {
  selectedFile.value = event.target.files[0];
  uploadFile(event.target.files[0]);
};

const showUploadedFiles = () => {
  ProductService.getPdfProductById(id).then(
    (response) => {
      if (response.status == 200) {
        uploadedFiles.value = response.data
      }
    },
    (error) => {
      console.log(error)
    }
  )
};

const downloadFile = (fileId, name) => {
  ProductService.getPdfById(fileId).then(
    (response) => {
      if (response.status == 200) {
        const fileURL = window.URL.createObjectURL(new Blob([response.data], {type: response.headers['content-type']}));
        const fURL = document.createElement('a');

        fURL.href = fileURL;
        fURL.setAttribute('download', `${name}`);
        document.body.appendChild(fURL);

        fURL.click();
      }
    },
    (error) => {
      console.log(error)
    }
  )
}

const downloadXML = () => {
  ProductService.getXMLById(id).then(
    (response) => {
      if (response.status == 200) {
        const fileURL = window.URL.createObjectURL(new Blob([response.data], {type: response.headers['content-type']}));
        const fURL = document.createElement('a');

        fURL.href = fileURL;
        fURL.setAttribute('download', `${product.registrasionyiNomerSgr}.xml`);
        document.body.appendChild(fURL);

        fURL.click();
      }
    },
    (error) => {
      console.log(error)
    }
  )
}

const idCode = ref(null)

const showModalDelete = (item) => {
  idCode.value = item.id
}

const deleteFile = () => {
  ProductService.delPdfById(idCode.value).then(
    (response) => {
      if (response.status == 200) {
        showUploadedFiles()
      }
    },
    (error) => {
      console.log(error)
    }
  )
}

const getFileFormat = (fileName) => {
  const parts = fileName.split('.');
  if (parts.length > 1) {
    return '.' + parts.pop();
  } else {
    return '';
  }
}

async function uploadFile(file) {
  ProductService.uploadPdf(id, file).then(response => {
    createToast({
      title: 'Файл загружен!'
    }, {
      type: 'success',
      position: 'top-right',
      showIcon: true,
    })

  }).catch(error => {
    createToast({
      title: 'Произошла ошибка!',
    }, {
      type: 'danger',
      position: 'top-right',
      showIcon: true
    })
  })
}

const route = useRoute();

const id = route.query.id;
const method = route.query.method;

const loading = ref(false)

const listCodeProduct = ref([])
const listCodeTnVed = ref([])
const listDuration = ref([])
const listTypeFirm = ref([])
const listCountry = ref([])
const listPositionWork = ref([])
const listVidTovara = ref([])
const conformityList = ref([])

const props = defineProps({
  callback: Function,
});

function addcomments(array) {
  if (array.length < 4) {
    array.push({name: null})
  }
}

function delcomments(array, index) {
  array.splice(index, 1)
}

const statusSystemFotBtn = computed(() => {
  if (statusSystem?.value != 'ready') {
    return 2
  } else {
    return 1
  }
})

const statusSystem = ref(null)

const numberSgr = computed(() => {
  const count = product.count.id == null || product.count.id == '' ? 'X' : product.count.id

  const codeProduct = findElementById(listCodeProduct.value, product.codeProductsId)?.code ?? '  ';
  const codeSootvetstvie = findElementById(conformityList.value, product.vsootvetstviiId)?.code ?? '  ';
  const codeOrganizationCount = user.organization.count.id ?? '  ';
  const codeDepartament = user.department?.code ?? '  ';
  const dataRegistrasii = product.dataRegistrasii;

  const codeISO = user.organization.country.codeISO;
  const codeCountry = user.organization.country.code.substr(0, 2);
  const codeData = dataRegistrasii ? new Date(dataRegistrasii).toLocaleString('default', {
    month: '2-digit',
    year: '2-digit'
  }) : '  ';

  return `№.${codeISO}.${codeCountry}.${codeOrganizationCount}.${codeDepartament}.${codeProduct}.${codeSootvetstvie}.${count}.${codeData}`;
});

const product = reactive({
  id: null,
  codeProductsId: null,
  codeTnVedId: null,  //Код ТН ВЭД
  name: null,           //Продукция
  oblastPrimeneniya: null, //Область применения продукции
  izgotovlenyDocumenty: null, //Изготовлено в соответствии с документами

  naimenovanieIAddressIzgotovitelya: null, //Наименование и адрес изготовителя
  stranaIzgotovitelyaTovaraId: null, //Страна изготовителя товара
  naimenovanieIAdressZaiavitela: null, //Наименование и адрес заивителя
  stranaZayavitelyaTovaraId: null, //Страна заявителя товара
  registerNumberOrgn: null, //Регистрационный номер
  registerNumberInn: null,
  typeFirmyId: null, //Тип фирмы
  vsootvetstviiId: null, //Соответствует

  sootvetstviuet: null, //В Соответствии
  svidetelstvoVydanoNaOsnovaniiProtokolyIssledovaniy: null,// Свидетельсто выдано на основании нету
  pokazateliBezopasnosti: null,// Показатели безопасности
  informatsiyaNanosimayaNaEtiketku: null, //Информация наносимая на этикетку
  vidTovaraId: null,// Вид товара нету

  registrasionyiNomerSgr: numberSgr,
  dataRegistrasii: null,
  nomerBlanka: null,
  srokDistviaId: null,
  doljnostId: null,
  fio: null,

  nameDop: [],
  oblastPrimeneniyaDop: [],
  naimenovanieIAddressIzgotovitelyaDop: [],
  naimenovanieIAdressZaiavitelaDop: [],
  svidetelstvoVydanoNaOsnovaniiProtokolyIssledovaniyDop: [],
  pokazatel: [],

  count: {
    id: null
  },

  cause: []
})

function addpokazateliList() {
  if (product.pokazatel.length < 4) {
    product.pokazatel.push({
      gigienicheskayaHararakteristiki: null,
      labaratornieIssledovaniya: null,
      gigienicheskyeNormativy: null
    })
  }
}

const productRules = reactive({
  codeProductsId: {
    required: helpers.withMessage('Выберите числовой код продукции', required)
  },
  codeTnVedId: {
    required: helpers.withMessage('Выберите Код ТН ВЭД', required)
  },
  name: {
    required: helpers.withMessage('Это поле обязательное', required)
  },
  oblastPrimeneniya: {
    required: helpers.withMessage('Это поле обязательное', required)
  },
  izgotovlenyDocumenty: {
    required: helpers.withMessage('Это поле обязательное', required)
  },
  naimenovanieIAddressIzgotovitelya: {
    required: helpers.withMessage('Это поле обязательное', required)
  },
  stranaIzgotovitelyaTovaraId: {
    required: helpers.withMessage('Выбериет страну изготовления', required)
  },
  naimenovanieIAdressZaiavitela: {
    required: helpers.withMessage('Это поле обязательное', required)
  },
  stranaZayavitelyaTovaraId: {
    required: helpers.withMessage('Выбериет страну заявителья', required)
  },
  registerNumberOrgn: {
    required: helpers.withMessage('Это поле обязательное', required)
  },
  registerNumberInn: {
    required: helpers.withMessage('Это поле обязательное', required)
  },
  vsootvetstviiId: {
    required: helpers.withMessage('Выбериет один из вариантов', required)
  },
  typeFirmyId: {
    required: helpers.withMessage('Выбериет тип фирмы', required)
  },


  sootvetstviuet: {
    required: helpers.withMessage('Это поле обязательное', required)
  },
  svidetelstvoVydanoNaOsnovaniiProtokolyIssledovaniy: {
    required: helpers.withMessage('Это поле обязательное', required)
  },
  pokazateliBezopasnosti: {
    required: helpers.withMessage('Это поле обязательное', required)
  },
  informatsiyaNanosimayaNaEtiketku: {
    required: helpers.withMessage('Это поле обязательное', required)
  },
  vidTovaraId: {
    required: helpers.withMessage('Выбериет вид товара', required)
  },
  registrasionyiNomerSgr: {
    required: false
  },
  dataRegistrasii: {
    required: false
  },
  nomerBlanka: {
    required: false
  },
  srokDistviaId: {
    required: helpers.withMessage('Выберите срок действия', required)
  },
  doljnostId: {
    required: false
  },
  fio: {
    required: false
  }
})

const v$ = useVuelidate(productRules, product)

function fillObject(item) {
  product.id = item.id
  product.count.id = item.count.id
  product.nomerBlanka = item.nomerBlanka
  product.codeProductsId = item.codeProducts.id
  product.codeTnVedId = item.codeTnVed.id
  product.name = item.name
  product.oblastPrimeneniya = item.oblastPrimeneniya
  product.naimenovanieIAddressIzgotovitelya = item.naimenovanieIAddressIzgotovitelya
  product.stranaIzgotovitelyaTovaraId = item.stranaIzgotovitelyaTovara.id
  product.stranaZayavitelyaTovaraId = item.stranaZayavitelyaTovara.id
  product.registerNumberOrgn = item.registerNumberOrgn
  product.registerNumberInn = item.registerNumberInn
  product.typeFirmyId = item.typeFirmy.id
  product.vsootvetstviiId = item.vsootvetstvii.id
  product.sootvetstviuet = item.sootvetstviuet
  product.svidetelstvoVydanoNaOsnovaniiProtokolyIssledovaniy = item.svidetelstvoVydanoNaOsnovaniiProtokolyIssledovaniy
  product.pokazateliBezopasnosti = item.pokazateliBezopasnosti
  product.informatsiyaNanosimayaNaEtiketku = item.informatsiyaNanosimayaNaEtiketku
  product.vidTovaraId = item.vidTovara.id
  product.izgotovlenyDocumenty = item.izgotovlenyDocumenty
  numberSgr.value = item.registrasionyiNomerSgr
  product.srokDistviaId = item.srokDistvia.id
  product.nameDop = item.nameDop
  product.oblastPrimeneniyaDop = item.oblastPrimeneniyaDop
  product.naimenovanieIAddressIzgotovitelyaDop = item.naimenovanieIAddressIzgotovitelyaDop
  product.naimenovanieIAdressZaiavitelaDop = item.naimenovanieIAdressZaiavitelaDop
  product.svidetelstvoVydanoNaOsnovaniiProtokolyIssledovaniyDop = item.svidetelstvoVydanoNaOsnovaniiProtokolyIssledovaniyDop
  product.pokazatel = item.pokazatel
  product.naimenovanieIAdressZaiavitela = item.naimenovanieIAdressZaiavitela
  product.dataRegistrasii = item.dataRegistrasii
  product.doljnostId = item.doljnost ? item.doljnost.id : null
  product.fio = item.fio
  product.nomerBlanka = item.nomerBlanka

  if (method == 'COPY') {
    product.id = null
    product.count.id = null
    product.nomerBlanka = null
  } else if (method == 'EDIT' && item.statusSystem.code == 'ready') {
    product.dataRegistrasii = null
    product.doljnostId = null
    product.fio = null
    product.nomerBlanka = null
  }
}

async function createProduct() {
  v$.value.$touch()
  if (v$.value.$invalid) {
    createToast({
      title: 'Ошибка!',
      description: 'Обязательно заполните все поля.',
    }, {
      type: 'danger',
      position: 'top-right',
      showIcon: true,
    })
  }

  if (id != undefined && id != null && method == 'EDIT') {

    if (cause.value != null) {
      product.cause = []
      product.cause.push({name: cause.value})
    }

    ProductService.editCodeProduct(product).then(response => {
      createToast({
        title: 'Запись успешно сохранена!'
      }, {
        type: 'success',
        position: 'top-right',
        showIcon: true,
      })

      // router.push({name: 'NationalRegister'})
      setTimeout(() => {
        window.close();
      }, 2000);
    }).catch(error => {
      createToast({
        title: 'Произошла ошибка!',
      }, {
        type: 'danger',
        position: 'top-right',
        showIcon: true
      })
    })
  } else {
    ProductService.createProducts(product).then(response => {
      createToast({
        title: 'Запись успешно сохранена!'
      }, {
        type: 'success',
        position: 'top-right',
        showIcon: true,
      })
      // router.push({name: 'NationalRegister'})
      setTimeout(() => {
        window.close();
      }, 2000);

    }).catch(error => {
      createToast({
        title: 'Произошла ошибка!',
      }, {
        type: 'danger',
        position: 'top-right',
        showIcon: true
      })
    })
  }
}

async function getDictionaries() {

  CodeProductService.getCodeProducts().then(
    (response) => {
      if (response.status == 200) {
        response.data.forEach(item => {
          listCodeProduct.value.push({id: item.id, text: item.name, code: item.code})
        })
      }
    },
    (error) => {
      console.log(error)
    }
  )

  CodeTnVedService.getVedlist().then(
    (response) => {
      if (response.status == 200) {
        response.data.forEach(item => {
          listCodeTnVed.value.push({id: item.id, text: item.name})
        })
      }
    },
    (error) => {
      console.log(error)
    }
  )

  DurationService.getDurationList().then(
    (response) => {
      if (response.status == 200) {
        response.data.forEach(item => {
          listDuration.value.push({id: item.id, text: item.name, code: item.code})
        })
      }
    },
    (error) => {
      console.log(error)
    }
  )

  CountryService.getCountryList().then(
    (response) => {
      if (response.status == 200) {
        response.data.forEach(item => {
          listCountry.value.push({id: item.id, text: item.name})
        })
      }
    },
    (error) => {
      console.log(error)
    }
  )
  TypeFirmService.getTypeFirm().then(
    (response) => {
      if (response.status == 200) {
        response.data.forEach(item => {
          listTypeFirm.value.push({id: item.id, text: item.name})
        })
      } else {
        console.log("error")
      }
    }
  )

  PositionWorkService.getPositionWork().then(
    (response) => {
      if (response.status == 200) {
        response.data.forEach(item => {
          listPositionWork.value.push({id: item.id, text: item.name})
        })
      }
    },
    (error) => {
      console.log(error)
    }
  )

  ConformityService.getConformity().then(
    (response) => {
      if (response.status == 200) {
        response.data.forEach(item => {
          conformityList.value.push({id: item.id, text: item.name, code: item.code})
        })
      }
    },
    (error) => {
      console.log(error)
    }
  )

  VidTovara.getVidTovara().then(
    (response) => {
      if (response.status == 200) {
        response.data.forEach(item => {
          listVidTovara.value.push({id: item.id, text: item.name})
        })
      }
    },
    (error) => {
      console.log(error)
    }
  )

  if (id != undefined && id != null) {
    ProductService.getProductById(id).then(
      (response) => {
        if (response.status == 200) {
          fillObject(response.data)
          couseList.value = response.data.cause
          statusSystem.value = response.data.statusSystem.code
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }

}

const pdfsrc = reactive({
  src: null,
  jspdf: null
})

function findElementById(array, elemId) {
  return array.find(element => element.id === elemId) || null
}

function findElementByCode(array, elemId) {
  return array.find(element => element.code === elemId) || null
}

function onChangeConformityList() {
  let vsootvetsvti = findElementById(conformityList.value, product.vsootvetstviiId)
  let srok_vsootvetestvii = findElementByCode(listDuration.value, vsootvetsvti.code)
  if (srok_vsootvetestvii != null) {
    product.srokDistviaId = srok_vsootvetestvii.id
  }
}

function orderedString(extraField, headName, mainField, drop) {
  let result = drop + drop + headName + ".&" + mainField
  if (extraField.length > 0) {
    let elem = extraField
    for (let i = 0; i < elem.length; i++) {
      result += `&${i + 1}. ${elem[i].name}`
    }
    return result
  }
}

function getApplications() {

  let firstList = []

  firstList.push(orderedString(product.nameDop, "Продукция", product.name, ''))
  firstList.push(orderedString(product.oblastPrimeneniyaDop, "Область применения продукции", product.oblastPrimeneniya, '&'))
  firstList.push(orderedString(product.naimenovanieIAddressIzgotovitelyaDop, "Изготовитель", product.naimenovanieIAddressIzgotovitelya, '&'))
  firstList.push(orderedString(product.naimenovanieIAdressZaiavitelaDop, "Заявитель", product.naimenovanieIAdressZaiavitela, '&'))
  firstList.push(orderedString(product.svidetelstvoVydanoNaOsnovaniiProtokolyIssledovaniyDop, "Свидетельсвто выдано на оснавании", product.svidetelstvoVydanoNaOsnovaniiProtokolyIssledovaniy, '&'))

  let firstString = firstList.join(' ')

  const result = []

  let maxLength = 0
  let iterLength = 0
  if (firstString.length > 4) {
    for (let i = 0; i < firstString.length; i++) {
      if (maxLength == 1250) {
        maxLength = 0
        iterLength++
      }

      if (firstString[i] == '&') {
        result[iterLength] += "\n"
      } else {
        result[iterLength] += firstString[i]
      }
      maxLength++
    }
  }
  return result
}

async function createTalon(data) {
  (function (jsPDFAPI) {
    var callAddFont = function () {
      this.addFileToVFS('ofont.ru_Times New Roman-normal.ttf', font.FONT_TIMES_NEW_ROMAN);
      this.addFont('ofont.ru_Times New Roman-normal.ttf', 'ofont.ru_Times New Roman', 'normal');
    };
    jsPDF.API.events.push(['addFonts', callAddFont])

  })(jsPDF.API);
  const doc = new jsPDF('p', 'mm', 'a4');
  doc.addImage(BackgroundImage, 'png', 0, 0, 210, 297)
  doc.setFont('ofont.ru_Times New Roman', 'normal');

  doc.setFontSize(12)

  const duration = findElementById(listDuration.value, product.srokDistviaId)
  const doljnost = findElementById(listPositionWork.value, product.doljnostId)

  if (statusSystem.value == 'draft') {
    doc.setFontSize(14)
    doc.text('Черновик', 140, 25)
  } else {
    if (product.registrasionyiNomerSgr != null) doc.text(product.registrasionyiNomerSgr + '', 66, 98)
    if (product.dataRegistrasii != null) doc.text(product.dataRegistrasii + '', 141, 98)

    if (duration != null) {
      doc.text(duration.text + '', 55, 232);
    }
    if (doljnost != null) {
      doc.text(doljnost.text + '', 23, 246.5);
    }
    // doc.text(product.nomerBlanka + '', 151, 268);
    doc.text(product.fio + '', 149, 246);
  }

  doc.setFontSize(12)

  const nameText = doc.splitTextToSize(product.name, 150)
  const naimenovanieIAddressIzgotovitelyaText = doc.splitTextToSize(product.naimenovanieIAddressIzgotovitelya, 150)
  const naimenovanieIAdressZaiavitelaText = doc.splitTextToSize(product.naimenovanieIAdressZaiavitela, 150)
  const sootvetstviuetText = doc.splitTextToSize(product.sootvetstviuet, 150)
  const svidetelstvoVydanoNaOsnovaniiProtokolyIssledovaniyText = doc.splitTextToSize(product.svidetelstvoVydanoNaOsnovaniiProtokolyIssledovaniy, 150)

  doc.text(doc.splitTextToSize(user.organization.ozFullName, 130), 39, 55)

  if (nameText != null) {
    doc.text(nameText, 23, 110)
  }
  if (naimenovanieIAddressIzgotovitelyaText != null) {
    doc.text(naimenovanieIAddressIzgotovitelyaText, 23, 144)
  }
  if (naimenovanieIAdressZaiavitelaText != null) {
    doc.text(naimenovanieIAdressZaiavitelaText, 23, 170)
  }
  if (sootvetstviuetText != null) {
    doc.text(sootvetstviuetText, 23, 190)
  }
  if (svidetelstvoVydanoNaOsnovaniiProtokolyIssledovaniyText != null) {
    doc.text(svidetelstvoVydanoNaOsnovaniiProtokolyIssledovaniyText, 23, 210)
  }

  let applications = getApplications()

  for (let i = 0; i < applications.length; i++) {
    doc.setFontSize(12)
    doc.addPage();
    doc.setPage(i + 2);
    doc.addImage(BackgroundImage2, 'png', 0, 0, 210, 297)
    doc.text(doc.splitTextToSize(applications[i].replace(/undefined/g, ""), 150), 27, 112);
    doc.text(i + 1 + '', 60, 269);
    doc.text(applications.length + '', 75, 269);

    if (statusSystem.value == 'draft') {
      doc.setFontSize(14)
      doc.text('Черновик', 140, 25)
    } else {
      doc.text(product.registrasionyiNomerSgr + '', 73, 102)
      doc.text(product.dataRegistrasii + '', 141, 102)

      if (product.fio != null) {
        doc.text(product.fio + '', 149, 246);
      }
      if (doljnost != null) {
        doc.text(doljnost + '', 23, 246.5);
      }

      // doc.text(product.nomerBlanka + '', 151, 268);

    }
  }

  pdfsrc.src = doc.output('bloburi');
  pdfsrc.jspdf = doc

  printTalon()
}

function printTalon() {
  window.open(pdfsrc.src, '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
}

onMounted(async () => {
  await getDictionaries()
})

</script>

<template>
  <div class="flex items-center mt-8">
    <h2 class="intro-y text-lg font-medium mr-auto">
      департамент профилактики здоровья и санитарно-эпидемиологического наздора
    </h2>
  </div>
  <div id="social-media-button" class="p-5 box mt-8">
    <div class="preview">
      <div class="flex flex-wrap">
        <button class="btn btn-facebook mr-2 mb-2 flex" @click="createTalon">
          {{ id != null ? 'Печать' : 'Посмотреть' }}
          <div class="ml-2">
            <svg v-if="id != null" style="width: 15px; margin-left: 5px" version="1.0" id="Layer_1"
                 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" enable-background="new 0 0 64 64"
                 xml:space="preserve" fill="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier"> <g> <path fill="#ffffff"
                                                     d="M60,12h-6V2c0-1.105-0.895-2-2-2H12c-1.105,0-2,0.895-2,2v10H4c-2.211,0-4,1.789-4,4v32 c0,2.211,1.789,4,4,4h6v10c0,1.105,0.895,2,2,2h40c1.105,0,2-0.895,2-2V52h6c2.211,0,4-1.789,4-4V16C64,13.789,62.211,12,60,12z M12,3c0-0.553,0.447-1,1-1h38c0.553,0,1,0.447,1,1v9H12V3z M52,61c0,0.553-0.447,1-1,1H13c-0.553,0-1-0.447-1-1V37 c0-0.553,0.447-1,1-1h38c0.553,0,1,0.447,1,1V61z M62,48c0,1.104-0.896,2-2,2h-6V36c0-1.105-0.895-2-2-2H12c-1.105,0-2,0.895-2,2 v14H4c-1.104,0-2-0.896-2-2V16c0-1.104,0.896-2,2-2h56c1.104,0,2,0.896,2,2V48z"></path>
                <path fill="#ffffff"
                      d="M19,44h12c0.553,0,1-0.447,1-1s-0.447-1-1-1H19c-0.553,0-1,0.447-1,1S18.447,44,19,44z"></path>
                <path fill="#ffffff"
                      d="M45,48H19c-0.553,0-1,0.447-1,1s0.447,1,1,1h26c0.553,0,1-0.447,1-1S45.553,48,45,48z"></path>
                <path fill="#ffffff"
                      d="M38,54H19c-0.553,0-1,0.447-1,1s0.447,1,1,1h19c0.553,0,1-0.447,1-1S38.553,54,38,54z"></path>
                <path fill="#ffffff"
                      d="M55,18c-1.657,0-3,1.343-3,3s1.343,3,3,3s3-1.343,3-3S56.657,18,55,18z M55,22c-0.553,0-1-0.447-1-1 s0.447-1,1-1s1,0.447,1,1S55.553,22,55,22z"></path>
                <path fill="#ffffff"
                      d="M45,18c-1.657,0-3,1.343-3,3s1.343,3,3,3s3-1.343,3-3S46.657,18,45,18z M45,22c-0.553,0-1-0.447-1-1 s0.447-1,1-1s1,0.447,1,1S45.553,22,45,22z"></path> </g> </g>
        </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="15px" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 class="feather feather-eye block mx-auto block mx-auto">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </div>
        </button>
        <div>
          <label class="btn btn-linkedin mr-2 mb-2 flex">
            Загрузить файл
            <svg xmlns="http://www.w3.org/2000/svg" width="15px" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 class="feather feather-download block block mx-auto ml-2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <input type="file" name="file" style="display:none" @change="onChangeFile">
          </label>
        </div>
        <a class="btn btn-linkedin mr-2 mb-2 flex"
           href="javascript:;"
           data-toggle="modal"
           data-target="#button-slide-over-preview"
           @click="showUploadedFiles">
          Загруженные файлы
          <svg xmlns="http://www.w3.org/2000/svg" width="15px" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
               class="feather feather-hard-drive ml-2">
            <line x1="22" y1="12" x2="2" y2="12"></line>
            <path
              d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
            <line x1="6" y1="16" x2="6.01" y2="16"></line>
            <line x1="10" y1="16" x2="10.01" y2="16"></line>
          </svg>
        </a>
        <button class="btn btn-twitter mr-2 mb-2 flex" @click="downloadXML">
          Выгрузить XML
        </button>
      </div>
    </div>
  </div>
  <!-- END: Modal Toggle -->
  <!-- BEGIN: Modal Content -->
  <div id="button-slide-over-preview" class="modal modal-slide-over" data-backdrop="static" tabindex="-1"
       aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <a data-dismiss="modal" href="javascript:;">
          <XIcon class="w-8 h-8 text-gray-500"/>
        </a>
        <div class="modal-header p-5">
          <h2 class="font-medium text-base mr-auto">
            Загруженные файлы
          </h2>
        </div>
        <div class="modal-body">
          <div v-for="item in uploadedFiles" :key="item" class="p-5">
            <div class="flex items-center mt-5">
              <div class="file">
                <a href="" class="w-12 file__icon file__icon--file">
                  <div class="file__icon__file-name text-xs">{{getFileFormat(item.name)}}</div>
                </a>
              </div>
              <div class="ml-4">
                <a class="font-medium">
                  {{ item.name }}
                </a>
                <div class="text-gray-600 text-xs mt-0.5">{{ item.size / 1024 }} КБ</div>
              </div>
              <div class="dropdown ml-auto"><a class="dropdown-toggle w-5 h-5 block" href="javascript:;"
                                               aria-expanded="false">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     class="feather feather-more-horizontal w-5 h-5 text-gray-600 dark:text-gray-300 w-5 h-5 text-gray-600 dark:text-gray-300">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="19" cy="12" r="1"></circle>
                  <circle cx="5" cy="12" r="1"></circle>
                </svg>
              </a>
                <div class="dropdown-menu w-40">
                  <div class="dropdown-menu__content box dark:bg-dark-1 p-2">
                    <button
                      @click="downloadFile(item.id, item.name)"
                      class="flex items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                           class="feather feather-file w-4 h-4 mr-2 w-4 h-4 mr-2">
                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                        <polyline points="13 2 13 9 20 9"></polyline>
                      </svg>
                      Скачать
                    </button>
                    <a class="flex items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"
                       href="javascript:;"
                       @click="showModalDelete(item)"
                       data-toggle="modal"
                       data-target="#delete-confirmation-modal">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                           class="feather feather-trash w-4 h-4 mr-2 w-4 h-4 mr-2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                      Удалить</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- END: Modal Content -->


  <!-- BEGIN: Modal Toggle -->
  <!-- END: Modal Toggle -->
  <!-- BEGIN: Modal Content -->
  <div id="header-footer-modal-preview" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <form class="modal-content">
        <!-- BEGIN: Modal Body -->
        <div class="modal-body grid grid-cols-12 gap-4 gap-y-3">
          <div class="col-span-12">
            <label class="form-label">Причина смены статуса<span style="color: red">*</span></label>
            <textarea
              required
              rows="2"
              maxlength="255"
              type="text"
              class="form-control"
              v-model="cause"
              style="border-top-right-radius: 0px; border-bottom-right-radius: 0px; resize: none; ">
            </textarea>
          </div>
        </div>
        <!-- END: Modal Body -->
        <!-- BEGIN: Modal Footer -->
        <div class="modal-footer text-right">
          <button type="button" data-dismiss="modal" class="btn btn-outline-secondary w-20 mr-1">
            Назад
          </button>
          <button
            @click="createProduct()"
            v-show="!loading"
            type="button"
            class="btn btn-primary w-20">
            Сохранить
          </button>
        </div>
        <!-- END: Modal Footer -->
      </form>
    </div>
  </div>


  <form class="grid grid-cols-12 gap-6 mt-5" @submit.prevent>
    <div class="intro-y col-span-12 lg:col-span-12">
      <div class="post intro-y overflow-hidden box mt-5"
           style="box-shadow: none; border-bottom-left-radius: 0; border-bottom-right-radius: 0">
        <div
          class="post__tabs nav nav-tabs flex-col sm:flex-row bg-gray-300 dark:bg-dark-2 text-gray-600" role="tablist">
          <button
            :class="{ 'bg-[#ffff]' : thisPage == 'MAIN'}"
            class="w-full sm:w-40 py-4 text-center flex justify-center items-center"
            @click="changePage('MAIN')"
            type="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 class="feather feather-file-text w-4 h-4 mr-2 w-4 h-4 mr-2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Главная
          </button>
          <button
            :class="{ 'bg-[#ffff]' : thisPage == 'HISTORY-STATUS'}"
            class="w-full sm:w-48 py-4 text-center flex justify-center items-center"
            @click="changePage('HISTORY-STATUS')"
            type="button">
            <svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 class="feather feather-book block mr-2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            История статусов
          </button>
        </div>
      </div>

      <div class="intro-y box p-8 rounded-3xl" style="border-top-left-radius: 0; border-top-right-radius: 0">

        <div v-show="thisPage == 'MAIN'">
          <div class="grid gap-x-5 grid-cols-4 md:grid-cols-12">

            <div class="col-span-4 mt-5">
              <div class="font-medium text-base">Числовой код продукции<span style="color: red">*</span></div>
              <Select2
                :disabled="route.query.method == 'OPEN'"
                required
                :options="listCodeProduct"
                :settings="select2Settings"
                v-model.trim="v$.codeProductsId.$model"/>
              <template v-if="v$.codeProductsId.$error">
                <p
                  v-for="(error, index) in v$.codeProductsId.$errors"
                  :key="index"
                  class="pt-2 pl-2 text-theme-21"
                >
                  {{ error.$message }}
                </p>
              </template>
            </div>

            <div class="col-span-4 md:col-span-3 mt-5">
              <div class="font-medium text-base">Код ТН ВЭД<span style="color: red">*</span></div>
              <Select2 :disabled="method == 'OPEN'" required :options="listCodeTnVed"
                       :settings="select2Settings"
                       v-model.trim="v$.codeTnVedId.$model"/>
              <template v-if="v$.codeTnVedId.$error">
                <p
                  v-for="(error, index) in v$.codeTnVedId.$errors"
                  :key="index"
                  class="pt-2 pl-2 text-theme-21"
                >
                  {{ error.$message }}
                </p>
              </template>
            </div>

          </div>

          <div class="mt-3">
            <label for="form_10" class="form-label font-medium text-base">
              Продукция
              <span style="color: red">*</span>
            </label>
            <div class="flex">
              <input
                maxlength="255"
                required
                :disabled="method == 'OPEN'"
                v-model.trim="v$.name.$model"
                id="form_10"
                type="text"
                class="form-control"
                placeholder="Наименование продукции">
              <button
                :disabled="method == 'OPEN'"
                @click="addcomments(product.nameDop)"
                type="button"
                class="ml-2">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M7 11H15M11 15V7M11 21C16.5 21 21 16.5 21 11C21 5.5 16.5 1 11 1C5.5 1 1 5.5 1 11C1 16.5 5.5 21 11 21Z"
                    stroke="#13A3E0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            <template v-if="v$.name.$error">
              <p
                v-for="(error, index) in v$.name.$errors"
                :key="index"
                class="pt-2 pl-2 text-theme-21"
              >
                {{ error.$message }}
              </p>
            </template>

            <div v-if="product.nameDop.length != 0" class="grid gap-x-5 grid-cols-12">
              <div v-for="(item, index) in product.nameDop" :key="item" class="col-span-12 mt-1 flex">
                <input
                  maxlength="255"
                  :disabled="method == 'OPEN'"
                  required
                  id="form_10"
                  type="text"
                  class="form-control"
                  v-model="item.name"
                  placeholder="Доп поле продукции">
                <button
                  :disabled="method == 'OPEN'"
                  @click="delcomments(product.nameDop, index)"
                  type="button"
                  class="ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                       class="feather feather-x-circle block mx-auto block mx-auto">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="mt-3">
            <label for="form_11" class="form-label font-medium text-base">
              Область применения продукции
              <span style="color: red">*</span>
            </label>
            <div class="flex">
              <input
                maxlength="255"
                :disabled="method == 'OPEN'"
                required
                id="form_11"
                type="text"
                class="form-control"
                placeholder="Текст продукции"
                v-model.trim="v$.oblastPrimeneniya.$model">
              <button
                :disabled="method == 'OPEN'"
                @click="addcomments(product.oblastPrimeneniyaDop)"
                type="button"
                class="ml-2">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M7 11H15M11 15V7M11 21C16.5 21 21 16.5 21 11C21 5.5 16.5 1 11 1C5.5 1 1 5.5 1 11C1 16.5 5.5 21 11 21Z"
                    stroke="#13A3E0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            <template v-if="v$.oblastPrimeneniya.$error">
              <p
                v-for="(error, index) in v$.oblastPrimeneniya.$errors"
                :key="index"
                class="pt-2 pl-2 text-theme-21"
              >
                {{ error.$message }}
              </p>
            </template>

            <div v-if="product.oblastPrimeneniyaDop.length != 0" class="grid gap-x-5 grid-cols-12">
              <div v-for="(item, index) in product.oblastPrimeneniyaDop" :key="item" class="col-span-12 mt-1 flex">
                <input
                  maxlength="255"
                  required
                  :disabled="method == 'OPEN'"
                  id="form_10"
                  type="text"
                  class="form-control"
                  v-model="item.name"
                  placeholder="Доп поле области применения">
                <button
                  :disabled="method == 'OPEN'"
                  @click="delcomments(product.oblastPrimeneniyaDop, index)"
                  type="button"
                  class="ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                       class="feather feather-x-circle block mx-auto block mx-auto">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="mt-3">
            <label for="form_12" class="form-label font-medium text-base">
              Изготовлено в соответствии с документами
              <span style="color: red">*</span>
            </label>
            <input
              maxlength="255"
              :disabled="method == 'OPEN'"
              required
              id="form_12"
              type="text"
              class="form-control"
              placeholder="ТУ 20.41.32-002-49967274-2023"
              v-model.trim="v$.izgotovlenyDocumenty.$model">
            <template v-if="v$.izgotovlenyDocumenty.$error">
              <p
                v-for="(error, index) in v$.izgotovlenyDocumenty.$errors"
                :key="index"
                class="pt-2 pl-2 text-theme-21"
              >
                {{ error.$message }}
              </p>
            </template>
          </div>
        </div>
        <div v-show="thisPage == 'HISTORY-STATUS'">
          <div id="chats" class="tab-pane active" role="tabpanel" aria-labelledby="chats-tab">
            <div class="chat__chat-list overflow-y-auto scrollbar-hidden pr-1 pt-1 mt-4">
              <div v-for="item in couseList" :key="item"
                   class="intro-x cursor-pointer box relative flex items-center p-5">
                <div class="ml-2 overflow-hidden">
                  <div class="flex items-center flex justify-between">
                    <a href="javascript:;" class="font-medium">{{ item.fio }}</a>
                    <div class="text-xs text-gray-500 ml-4">{{ item.creationDate }}</div>
                  </div>
                  <div class="w-full truncate text-gray-600 mt-0.5">
                    {{ item.name }}
                  </div>
                </div><!----></div>
            </div>
          </div>
        </div>

      </div>

      <div v-show="thisPage == 'MAIN'">
        <div class="intro-y box p-8 rounded-3xl mt-5">
          <div id="input" class="">

            <div class="mt-3">
              <label for="form_20" class="form-label font-medium text-base">
                Наименование и адрес изготовителя
                <span style="color: red">*</span>
              </label>
              <div class="flex">
                <input
                  maxlength="255"
                  :disabled="method == 'OPEN'"
                  required
                  id="form_20"
                  type="text"
                  class="form-control"
                  placeholder="ОсОО “Альфия”, Юридический адрес: г. Бишкек, ул. Манаса 53, кв.12"
                  v-model.trim="v$.naimenovanieIAddressIzgotovitelya.$model">
                <button
                  :disabled="method == 'OPEN'"
                  @click="addcomments(product.naimenovanieIAddressIzgotovitelyaDop)"
                  type="button"
                  class="ml-2">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M7 11H15M11 15V7M11 21C16.5 21 21 16.5 21 11C21 5.5 16.5 1 11 1C5.5 1 1 5.5 1 11C1 16.5 5.5 21 11 21Z"
                      stroke="#13A3E0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
              <template v-if="v$.naimenovanieIAddressIzgotovitelya.$error">
                <p
                  v-for="(error, index) in v$.naimenovanieIAddressIzgotovitelya.$errors"
                  :key="index"
                  class="pt-2 pl-2 text-theme-21"
                >
                  {{ error.$message }}
                </p>
              </template>
              <div v-if="product.naimenovanieIAddressIzgotovitelyaDop.length != 0" class="grid gap-x-5 grid-cols-12">
                <div v-for="(item, index) in product.naimenovanieIAddressIzgotovitelyaDop" :key="item"
                     class="col-span-12 mt-1 flex">
                  <input
                    maxlength="255"
                    :disabled="method == 'OPEN'"
                    required
                    id="form_10"
                    type="text"
                    class="form-control"
                    v-model="item.name"
                    placeholder="Доп поле адреса">
                  <button
                    :disabled="method == 'OPEN'"
                    @click="delcomments(product.naimenovanieIAddressIzgotovitelyaDop, index)"
                    type="button"
                    class="ml-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                         class="feather feather-x-circle block mx-auto block mx-auto">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-4 md:grid-cols-12 mt-3">
              <div class="col-span-4">
                <div class="font-medium text-base">Страна изготовителя товара<span style="color: red">*</span></div>
                <Select2
                  required
                  :options="listCountry"
                  :settings="select2Settings"
                  v-model.trim="v$.stranaIzgotovitelyaTovaraId.$model"
                  :disabled="method == 'OPEN'"/>
                <template v-if="v$.stranaIzgotovitelyaTovaraId.$error">
                  <p
                    v-for="(error, index) in v$.stranaIzgotovitelyaTovaraId.$errors"
                    :key="index"
                    class="pt-2 pl-2 text-theme-21"
                  >
                    {{ error.$message }}
                  </p>
                </template>
              </div>
            </div>

            <div class="mt-3">
              <label for="form_21" class="form-label font-medium text-base">
                Наименование и адрес заявителя
                <span style="color: red">*</span>
              </label>
              <div class="flex">
                <input
                  maxlength="255"
                  :disabled="method == 'OPEN'"
                  required
                  id="form_21"
                  type="text"
                  class="form-control"
                  placeholder="ОсОО “Альфия”, Юридический адрес: г. Бишкек, ул. Манаса 53, кв.12"
                  v-model.trim="v$.naimenovanieIAdressZaiavitela.$model">
                <button
                  :disabled="method == 'OPEN'"
                  @click="addcomments(product.naimenovanieIAdressZaiavitelaDop)"
                  type="button"
                  class="ml-2">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M7 11H15M11 15V7M11 21C16.5 21 21 16.5 21 11C21 5.5 16.5 1 11 1C5.5 1 1 5.5 1 11C1 16.5 5.5 21 11 21Z"
                      stroke="#13A3E0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
              <template v-if="v$.naimenovanieIAdressZaiavitela.$error">
                <p
                  v-for="(error, index) in v$.naimenovanieIAdressZaiavitela.$errors"
                  :key="index"
                  class="pt-2 pl-2 text-theme-21"
                >
                  {{ error.$message }}
                </p>
              </template>
              <div v-if="product.naimenovanieIAdressZaiavitelaDop != 0" class="grid gap-x-5 grid-cols-12">
                <div v-for="(item, index) in product.naimenovanieIAdressZaiavitelaDop" :key="item"
                     class="col-span-12 mt-1 flex">
                  <input
                    maxlength="255"
                    :disabled="method == 'OPEN'"
                    required
                    id="form_10"
                    type="text"
                    class="form-control"
                    v-model="item.name"
                    placeholder="Доп поле адреса">
                  <button :disabled="method == 'OPEN'"
                          @click="delcomments(product.naimenovanieIAdressZaiavitelaDop, index)" type="button"
                          class="ml-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                         class="feather feather-x-circle block mx-auto block mx-auto">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div class="grid gap-x-5 grid-cols-4 md:grid-cols-12">

              <div class="col-span-12 mt-3 lg:col-span-4">
                <div class="font-medium text-base">Страна заявителя товара<span style="color: red">*</span></div>
                <Select2
                  required
                  :options="listCountry"
                  :settings="select2Settings"
                  v-model.trim="v$.stranaZayavitelyaTovaraId.$model"
                  :disabled="method == 'OPEN'"/>
                <template v-if="v$.stranaZayavitelyaTovaraId.$error">
                  <p
                    v-for="(error, index) in v$.stranaZayavitelyaTovaraId.$errors"
                    :key="index"
                    class="pt-2 pl-2 text-theme-21"
                  >
                    {{ error.$message }}
                  </p>
                </template>
              </div>

              <div class="col-span-2"></div>

              <div class="col-span-12 mt-3 lg:col-span-6">
                <label for="form_22" class="form-label font-medium text-base">
                  Регистрационный номер
                  <span style="color: red">*</span>
                </label>
                <div class="grid gap-x-5 grid-cols-3 md:grid-cols-6">
                  <input
                    maxlength="255"
                    :disabled="method == 'OPEN'"
                    required
                    id="form_22"
                    type="text"
                    class="form-control col-span-6 mt-3 lg:col-span-3"
                    placeholder="Огрн"
                    v-model.trim="v$.registerNumberOrgn.$model">
                  <template v-if="v$.registerNumberOrgn.$error">
                    <p
                      v-for="(error, index) in v$.registerNumberOrgn.$errors"
                      :key="index"
                      class="pt-2 pl-2 text-theme-21"
                    >
                      {{ error.$message }}
                    </p>
                  </template>
                  <input
                    maxlength="255"
                    :disabled="method == 'OPEN'"
                    required
                    id="form_22"
                    type="text"
                    class="form-control col-span-6 mt-3 lg:col-span-3"
                    placeholder="ИНН"
                    v-model.trim="v$.registerNumberInn.$model">
                  <template v-if="v$.registerNumberInn.$error">
                    <p
                      v-for="(error, index) in v$.registerNumberInn.$errors"
                      :key="index"
                      class="pt-2 pl-2 text-theme-21"
                    >
                      {{ error.$message }}
                    </p>
                  </template>
                </div>
              </div>

            </div>

            <div class="grid gap-x-5 grid-cols-4 md:grid-cols-12">

              <div class="col-span-12 mt-3 lg:col-span-4">
                <div class="font-medium text-base">Тип фирмы<span style="color: red">*</span></div>
                <Select2
                  required
                  :options="listTypeFirm"
                  :settings="select2Settings"
                  v-model.trim="v$.typeFirmyId.$model"
                  :disabled="method == 'OPEN'"/>
                <template v-if="v$.typeFirmyId.$error">
                  <p
                    v-for="(error, index) in v$.typeFirmyId.$errors"
                    :key="index"
                    class="pt-2 pl-2 text-theme-21"
                  >
                    {{ error.$message }}
                  </p>
                </template>
              </div>

              <div class="col-span-2"></div>

              <div class="col-span-12 mt-3 lg:col-span-6">
                <div class="font-medium text-base">В Соответствии<span style="color: red">*</span></div>
                <div class="flex">
                  <Select2
                    class="w-full"
                    required
                    @select="onChangeConformityList()"
                    :options="conformityList"
                    :settings="select2Settings"
                    v-model.trim="v$.vsootvetstviiId.$model"
                    :disabled="method == 'OPEN'"/>
                </div>
                <template v-if="v$.vsootvetstviiId.$error">
                  <p
                    v-for="(error, index) in v$.vsootvetstviiId.$errors"
                    :key="index"
                    class="pt-2 pl-2 text-theme-21"
                  >
                    {{ error.$message }}
                  </p>
                </template>
              </div>

            </div>
          </div>

        </div>

        <div class="intro-y box p-8 rounded-3xl mt-5">
          <div id="input" class="">

            <div class="mt-3">
              <label for="form_30" class="form-label font-medium text-base">
                Соответствует
                <span style="color: red">*</span>
              </label>
              <input
                maxlength="255"
                :disabled="method == 'OPEN'"
                required
                id="form_30"
                type="text"
                class="form-control"
                placeholder="Сведения о нормативных и тех документах"
                v-model.trim="v$.sootvetstviuet.$model">
              <template v-if="v$.sootvetstviuet.$error">
                <p
                  v-for="(error, index) in v$.sootvetstviuet.$errors"
                  :key="index"
                  class="pt-2 pl-2 text-theme-21"
                >
                  {{ error.$message }}
                </p>
              </template>
            </div>

            <div class="mt-3">
              <label for="form_31" class="form-label font-medium text-base">
                Свидетельсвто выдано на оснавании(Протоколы исследований)/
                <span style="color: red">*</span>
              </label>
              <div class="flex">
                <input
                  maxlength="255"
                  :disabled="method == 'OPEN'"
                  required
                  id="form_31"
                  type="text"
                  class="form-control"
                  placeholder="ручной ввод"
                  v-model.trim="v$.svidetelstvoVydanoNaOsnovaniiProtokolyIssledovaniy.$model">
                <template v-if="v$.svidetelstvoVydanoNaOsnovaniiProtokolyIssledovaniy.$error">
                  <p
                    v-for="(error, index) in v$.svidetelstvoVydanoNaOsnovaniiProtokolyIssledovaniy.$errors"
                    :key="index"
                    class="pt-2 pl-2 text-theme-21"
                  >
                    {{ error.$message }}
                  </p>
                </template>
                <button
                  :disabled="method == 'OPEN'"
                  @click="addcomments(product.svidetelstvoVydanoNaOsnovaniiProtokolyIssledovaniyDop)"
                  type="button"
                  class="ml-2">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M7 11H15M11 15V7M11 21C16.5 21 21 16.5 21 11C21 5.5 16.5 1 11 1C5.5 1 1 5.5 1 11C1 16.5 5.5 21 11 21Z"
                      stroke="#13A3E0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            <div v-if="product.svidetelstvoVydanoNaOsnovaniiProtokolyIssledovaniyDop.length != 0"
                 class="grid gap-x-5 grid-cols-12 mt-3">
              <div v-for="(item, index) in product.svidetelstvoVydanoNaOsnovaniiProtokolyIssledovaniyDop" :key="item"
                   class="col-span-12 mt-1 flex">
                <input
                  maxlength="255"
                  :disabled="method == 'OPEN'"
                  required
                  id="form_10"
                  type="text"
                  class="form-control"
                  v-model="item.name"
                  placeholder="Доп поле сведений">
                <button
                  :disabled="method == 'OPEN'"
                  @click="delcomments(product.svidetelstvoVydanoNaOsnovaniiProtokolyIssledovaniyDop, index)"
                  type="button"
                  class="ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                       class="feather feather-x-circle block mx-auto block mx-auto">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                </button>
              </div>
            </div>

            <div class="flex items-end">
              <div class="intro-y bg-[#ECECEC] rounded-[10px] mt-3 px-2 pb-2 w-full">
                <div class="grid grid-cols-4 lg:grid-cols-12">
                  <div class="col-span-12 mt-3 lg:col-span-8">
                    <label for="form_30" class="form-label font-medium text-base">
                      Показатели безопасности
                      <span style="color: red">*</span>
                    </label>
                    <input
                      maxlength="255"
                      :disabled="method == 'OPEN'"
                      required
                      id="form_30"
                      type="text"
                      class="form-control"
                      placeholder="Сведения о нормативных и тех документах"
                      v-model.trim="v$.pokazateliBezopasnosti.$model">
                    <template v-if="v$.pokazateliBezopasnosti.$error">
                      <p
                        v-for="(error, index) in v$.pokazateliBezopasnosti.$errors"
                        :key="index"
                        class="pt-2 pl-2 text-theme-21"
                      >
                        {{ error.$message }}
                      </p>
                    </template>
                  </div>
                </div>

                <div class="bg-[#D9D9D9] mt-3 rounded-[10px] px-2 pb-2">
                  <table class="table mt-5">
                    <thead>
                    <tr class="grid grid-cols-12">
                      <th class="whitespace-nowrap text-center col-span-4">Гигиенические характеристики</th>
                      <th class="whitespace-nowrap text-center col-span-4">Лабораторные исследования</th>
                      <th class="whitespace-nowrap text-center col-span-4">Гигиенические нормативы</th>
                    </tr>
                    </thead>

                  </table>
                  <div v-for="(item, index) in product.pokazatel" :key="item" class="grid grid-cols-12 mb-2">
                  <textarea
                    rows="2"
                    maxlength="255"
                    :disabled="method == 'OPEN'"
                    type="text"
                    class="form-control col-span-4"
                    v-model="item.gigienicheskayaHararakteristiki"
                    style="border-top-right-radius: 0px; border-bottom-right-radius: 0px; resize: none; ">
                  </textarea>
                    <textarea
                      rows="2"
                      maxlength="255"
                      :disabled="method == 'OPEN'"
                      type="text"
                      class="form-control col-span-4"
                      v-model="item.labaratornieIssledovaniya"
                      style="border-radius: 0px; resize: none;">
                  </textarea>
                    <div class="flex col-span-4">
                    <textarea
                      rows="2"
                      maxlength="255"
                      :disabled="method == 'OPEN'"
                      type="text"
                      class="form-control w-full"
                      v-model="item.gigienicheskyeNormativy"
                      style="border-top-left-radius: 0px; border-bottom-left-radius: 0px; resize: none;">
                    </textarea>
                      <button
                        :disabled="method == 'OPEN'"
                        @click="delcomments(product.pokazatel, index)"
                        type="button"
                        class="ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24"
                             fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                             class="feather feather-x-circle block mx-auto block mx-auto">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="15" y1="9" x2="9" y2="15"></line>
                          <line x1="9" y1="9" x2="15" y2="15"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button
                :disabled="method == 'OPEN'"
                @click="addpokazateliList"
                type="button"
                class="ml-2">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M7 11H15M11 15V7M11 21C16.5 21 21 16.5 21 11C21 5.5 16.5 1 11 1C5.5 1 1 5.5 1 11C1 16.5 5.5 21 11 21Z"
                    stroke="#13A3E0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>

            <div class="mt-3">
              <label for="form_30" class="form-label font-medium text-base">
                Информация наносимая на этикетку
                <span style="color: red">*</span>
              </label>
              <input
                maxlength="255"
                :disabled="method == 'OPEN'"
                required
                id="form_30"
                type="text"
                class="form-control"
                v-model.trim="v$.informatsiyaNanosimayaNaEtiketku.$model">
              <template v-if="v$.informatsiyaNanosimayaNaEtiketku.$error">
                <p
                  v-for="(error, index) in v$.informatsiyaNanosimayaNaEtiketku.$errors"
                  :key="index"
                  class="pt-2 pl-2 text-theme-21"
                >
                  {{ error.$message }}
                </p>
              </template>
            </div>

            <div class="mt-3">
              <div class="font-medium text-base">Вид товара<span style="color: red">*</span></div>
              <Select2
                class="w-full"
                required
                :options="listVidTovara"
                :settings="select2Settings"
                v-model.trim="v$.vidTovaraId.$model"
                :disabled="method == 'OPEN'"/>
              <template v-if="v$.vidTovaraId.$error">
                <p
                  v-for="(error, index) in v$.vidTovaraId.$errors"
                  :key="index"
                  class="pt-2 pl-2 text-theme-21"
                >
                  {{ error.$message }}
                </p>
              </template>
            </div>

          </div>

        </div>

        <div class="intro-y box p-8 rounded-3xl mt-5">

          <div class="grid gap-x-5 grid-cols-3 md:grid-cols-12">
            <div class="col-span-3 mt-3">
              <label for="form_40" class="form-label font-medium text-base">
                Регистрационный номер СГР
              </label>
              <input
                maxlength="255"
                disabled
                id="form_40"
                type="text"
                class="form-control"
                placeholder="Наименование продукции"
                v-model="product.registrasionyiNomerSgr">
            </div>

            <div class="col-span-3 mt-3">
              <label for="form_41" class="form-label font-medium text-base">
                Дата регистрации
              </label>
              <input
                maxlength="255"
                :disabled="method == 'OPEN'"
                id="form_41"
                type="date"
                class="form-control"
                v-model.trim="v$.dataRegistrasii.$model">
            </div>

            <div class="col-span-3 mt-3">
              <label for="form_42" class="form-label font-medium text-base">
                Номер бланка (БСО)
              </label>
              <input
                maxlength="255"
                :disabled="method == 'OPEN'"
                id="form_42"
                type="text"
                class="form-control"
                v-model.trim="v$.nomerBlanka.$model">
            </div>

            <div class="col-span-3 mt-3">
              <div class="font-medium text-base">Срок действия<span style="color: red">*</span></div>
              <Select2
                required
                :options="listDuration"
                :settings="select2Settings"
                v-model.trim="v$.srokDistviaId.$model"
                class="mt-2 sm:mr-2"
                :disabled="method == 'OPEN'"/>
              <template v-if="v$.srokDistviaId.$error">
                <p
                  v-for="(error, index) in v$.srokDistviaId.$errors"
                  :key="index"
                  class="pt-2 pl-2 text-theme-21"
                >
                  {{ error.$message }}
                </p>
              </template>
            </div>
          </div>

          <div class="mt-5">

            <div class="font-medium text-base">Должность руководителя уполномоченного органа государства-члена ЕАЭС<span
              style="color: red">*</span></div>

            <div class="grid gap-x-5 grid-cols-3 md:grid-cols-12">
              <Select2
                :disabled="method == 'OPEN'"
                class="mt-2 sm:mr-2 col-span-4"
                :options="listPositionWork"
                :settings="select2Settings"
                v-model="product.doljnostId"/>

              <div class="mt-2 sm:mr-2 col-span-4">
                <input
                  maxlength="255"
                  :disabled="method == 'OPEN'"
                  id="form_40"
                  type="text"
                  class="form-control"
                  placeholder="ФИО"
                  v-model.trim="v$.fio.$model">
                <template v-if="v$.fio.$error">
                  <p
                    v-for="(error, index) in v$.fio.$errors"
                    :key="index"
                    class="pt-2 pl-2 text-theme-21"
                  >
                    {{ error.$message }}
                  </p>
                </template>
              </div>
            </div>

          </div>

        </div>

        <div class="flex justify-end">
          <button
            v-if="statusSystemFotBtn == 2"
            v-show="!loading"
            type="submit"
            @click="createProduct()"
            class="btn btn-primary w-40 h-10 mt-5 text-base">
            Сохранить
          </button>
          <div v-else-if="statusSystemFotBtn == 1">
            <a href="javascript:;" data-toggle="modal" data-target="#header-footer-modal-preview"
               class="btn btn-primary w-40 h-10 mt-5 text-base"
               v-show="!loading"
            >Сохранить</a>
          </div>
        </div>
      </div>

    </div>
  </form>

  <div
    id="delete-confirmation-modal"
    class="modal"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body p-0">
          <div class="p-5 text-center">
            <XCircleIcon class="w-16 h-16 text-theme-6 mx-auto mt-3"/>
            <div class="text-3xl mt-5">Вы уверены?</div>
            <div class="text-gray-600 mt-2">
              Вы уверены что хотите удалить эту запись? <br/>
            </div>
          </div>
          <div class="px-5 pb-8 text-center">
            <button
              type="button"
              data-dismiss="modal"
              class="btn btn-outline-secondary w-24 mr-1"
            >
              Отмена
            </button>
            <button @click="deleteFile()" data-dismiss="modal" type="button" class="btn btn-danger w-24">Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

