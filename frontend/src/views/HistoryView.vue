<script setup>
import History from "../components/History.vue";
</script>

<template>
  <div>
    <History />
    <div class="pixel-title">
      <span class="pagination-left">&lt;&lt; NEW</span>
      <span class="pagination-right">OLD >></span>
    </div>
  </div>
</template>

<style scoped>
.pagination-left {
  margin-top: 10px;
  position: relative;
  float: left;
}
.pagination-right {
  margin-top: 10px;
  position: relative;
  float: right;
}
</style>
