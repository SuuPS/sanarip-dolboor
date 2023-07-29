import $api from '@/http'

async function getProductList({page, size, filter}) {
  return await $api.get('/products/getAll', {
    params: {
      filterByNomerBlanka: filter.filterByNomerBlanka,
      filterByStatusSystem: filter.filterByStatusSystem,
      filterByStatusDoc: filter.filterByStatusDoc,
      filterByDeleted: true,
      page: page,
      size: size,
      sortBy: 'id',
      sortOrder: 'asc',
    }
  })
}

async function getProductById(id) {
  return await $api.get(`/products/${id}`)
}

async function createProducts(product){
  return await $api.post('/products/create', {
    codeProductsId: product.codeProductsId,
    codeTnVedId: product.codeTnVedId,
    stranaIzgotovitelyaTovaraId: product.stranaIzgotovitelyaTovaraId,
    stranaZayavitelyaTovaraId: product.stranaZayavitelyaTovaraId,
    typeFirmyId: product.typeFirmyId,
    srokDistviaId: product.srokDistviaId,
    doljnostId: product.doljnostId,
    name: product.name,
    oblastPrimeneniya: product.oblastPrimeneniya,
    izgotovlenyDocumenty: product.izgotovlenyDocumenty,
    naimenovanieIAddressIzgotovitelya: product.naimenovanieIAddressIzgotovitelya,
    naimenovanieIAdressZaiavitela: product.naimenovanieIAdressZaiavitela,
    registerNumberOrgn: product.registerNumberOrgn,
    registerNumberInn: product.registerNumberInn,
    sootvetstviuet: product.sootvetstviuet,
    svidetelstvoVydanoNaOsnovaniiProtokolyIssledovaniy: product.svidetelstvoVydanoNaOsnovaniiProtokolyIssledovaniy,
    pokazateliBezopasnosti: product.pokazateliBezopasnosti,
    informatsiyaNanosimayaNaEtiketku: product.informatsiyaNanosimayaNaEtiketku,
    vidTovaraId: product.vidTovaraId,
    registrasionyiNomerSgr: product.registrasionyiNomerSgr,
    dataRegistrasii: product.dataRegistrasii,
    nomerBlanka: product.nomerBlanka,
    vsootvetstviiId: product.vsootvetstviiId,
    fio: product.fio,
    nameDop: product.nameDop,
    oblastPrimeneniyaDop: product.oblastPrimeneniyaDop,
    naimenovanieIAddressIzgotovitelyaDop: product.naimenovanieIAddressIzgotovitelyaDop,
    naimenovanieIAdressZaiavitelaDop: product.naimenovanieIAdressZaiavitelaDop,
    svidetelstvoVydanoNaOsnovaniiProtokolyIssledovaniyDop: product.svidetelstvoVydanoNaOsnovaniiProtokolyIssledovaniyDop,
    pokazatel: product.pokazatel
  })
}

async function editCodeProduct(product) {
  return await $api.put(`/products/update`,{
    count: product.count,
    id: product.id,
    codeProductsId: product.codeProductsId,
    codeTnVedId: product.codeTnVedId,
    stranaIzgotovitelyaTovaraId: product.stranaIzgotovitelyaTovaraId,
    stranaZayavitelyaTovaraId: product.stranaZayavitelyaTovaraId,
    typeFirmyId: product.typeFirmyId,
    srokDistviaId: product.srokDistviaId,
    doljnostId: product.doljnostId,
    name: product.name,
    oblastPrimeneniya: product.oblastPrimeneniya,
    izgotovlenyDocumenty: product.izgotovlenyDocumenty,
    naimenovanieIAddressIzgotovitelya: product.naimenovanieIAddressIzgotovitelya,
    naimenovanieIAdressZaiavitela: product.naimenovanieIAdressZaiavitela,
    registerNumberOrgn: product.registerNumberOrgn,
    registerNumberInn: product.registerNumberInn,
    sootvetstviuet: product.sootvetstviuet,
    svidetelstvoVydanoNaOsnovaniiProtokolyIssledovaniy: product.svidetelstvoVydanoNaOsnovaniiProtokolyIssledovaniy,
    pokazateliBezopasnosti: product.pokazateliBezopasnosti,
    informatsiyaNanosimayaNaEtiketku: product.informatsiyaNanosimayaNaEtiketku,
    vidTovaraId: product.vidTovaraId,
    registrasionyiNomerSgr: product.registrasionyiNomerSgr,
    dataRegistrasii: product.dataRegistrasii,
    nomerBlanka: product.nomerBlanka,
    vsootvetstviiId: product.vsootvetstviiId,
    fio: product.fio,
    nameDop: product.nameDop,
    oblastPrimeneniyaDop: product.oblastPrimeneniyaDop,
    naimenovanieIAddressIzgotovitelyaDop: product.naimenovanieIAddressIzgotovitelyaDop,
    naimenovanieIAdressZaiavitelaDop: product.naimenovanieIAdressZaiavitelaDop,
    svidetelstvoVydanoNaOsnovaniiProtokolyIssledovaniyDop: product.svidetelstvoVydanoNaOsnovaniiProtokolyIssledovaniyDop,
    pokazatel: product.pokazatel,
    cause: product.cause,
  })
}

async function suspendProduct(id, name) {
  return await $api.put(`/products/suspend/${id}?cause=${name}`, {
    // params: {
    //   cause: name,
    // }
  })
}

async function restoreProduct(id, name) {
  return await $api.put(`/products/restore/${id}?cause=${name}`, {
  })
}

async function getPdfProductById(id) {
  return await $api.get(`/documents/getModelsByProductId`, {
    params: {
      id
    }
  })
}

async function getPdfById(id) {
  return await $api.get(`/documents/getFileById/${id}`, { responseType: 'blob' });
}

async function delPdfById(id) {
  return await $api.get(`/documents/deleteFileById/${id}`)
}

async function uploadPdf(id, file) {
  const formData = new FormData();
  formData.append('productId', id);
  formData.append('uploadfiles', file);

  return await $api.post('/documents/multipleupload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

async function getXMLById(id) {
  return await $api.get(`/products/XML/${id}`, {
    responseType: 'blob',
  });
}

export default {
  createProducts,
  getProductList,
  getProductById,
  editCodeProduct,
  suspendProduct,
  restoreProduct,
  uploadPdf,
  getPdfProductById,
  getPdfById,
  delPdfById,
  getXMLById
}
