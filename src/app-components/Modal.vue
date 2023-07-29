<script setup>
const props = defineProps({ showModal: Boolean })
</script>

<template>
  <div
    v-if="showModal"
    id="modal"
    class="modal overflow-y-auto modal-overlap show"
    aria-hidden="true"
    data-backdrop="static"
  >
    <div id="popup-dialog" class="modal-dialog">
      <div id="popup-content" class="modal-content">
        <div class="modal-body p-5 text-center">
          <slot name="header"></slot>
        </div>
        <div class="p-5 text-center">
          <main><slot></slot></main>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#modal {
  margin-top: 0px;
  margin-left: 0px;
  padding-left: 15px;
  z-index: 51;
}
</style>
