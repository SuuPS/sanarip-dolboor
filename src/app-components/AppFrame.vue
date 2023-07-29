<script setup></script>

<template>
  <div class="intro-y box mt-5">
    <div class="flex flex-col sm:flex-row items-center p-5 border-b border-gray-200 dark:border-dark-5">
      <header>
        <slot name="header"></slot>
      </header>
    </div>
    <div class="preview p-5">
      <main>
        <slot></slot>
      </main>
    </div>
  </div>
</template>
