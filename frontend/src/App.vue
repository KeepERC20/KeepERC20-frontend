<script setup>
import { RouterLink, RouterView } from "vue-router";
import Menu from "./components/Menu.vue";
import SendView from "./views/SendView.vue";
import HistoryView from "./views/HistoryView.vue";
</script>

<template>
  <div class="uk-width-1-1">
    <div uk-sticky>
      <div class="uk-width-1-1 box navbar">
        <Menu />
      </div>
    </div>
    <div class="uk-width-1-1 box no-padding-top">
      <div uk-grid>
        <div class="uk-width-3-4@m routerview-card">
          <div class="uk-width-1-1 routerview-title">
            <div class="title-text"><span>SEND</span></div>
            <div class="title-text-right"><span>- X</span></div>
          </div>
          <div class="uk-width-1-1 routerview-contents">
            <SendView />
          </div>
        </div>
        <div class="uk-width-1-4@m">
          <HistoryView />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.box {
  padding: 30px;
}

.navbar {
  background-color: black;
}

.no-padding-top {
  padding-top: 0px;
}

.routerview-title {
  outline: solid 2px rgba(255, 255, 255, 1);
  height: 30px;
  background-color: white;
}

.title-text {
  position: relative;
  float: left;
  top: 4px;
  left: 20px;
  font-family: "Silkscreen", cursive;
  font-weight: 400;
  color: black;
}

.title-text-right {
  position: relative;
  float: right;
  top: 4px;
  right: 20px;
  font-family: "Silkscreen", cursive;
  font-weight: 400;
  color: black;
}

.routerview-contents {
  padding: 30px;
  outline: solid 2px rgba(255, 255, 255, 1);
}
</style>
