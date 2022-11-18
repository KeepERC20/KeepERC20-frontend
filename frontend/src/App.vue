<script>
import { connectContract } from "./assets/js/interface_request.js";
import { RouterLink, RouterView } from "vue-router";
import Menu from "./components/Menu.vue";
import Wallet from "./components/Wallet.vue";
import SendView from "./views/SendView.vue";
import HistoryView from "./views/HistoryView.vue";

export default {
  data() {
    return {
      connected: false,
      loading: false,
    };
  },
  components: {
    Menu,
    Wallet,
    SendView,
    HistoryView,
  },
  mounted() {
    this.emitter.on("metamask-connect-event", (msg) => {
      this.connected = msg;
    });

    this.emitter.on("loading-event", (msg) => {
      this.loading = msg;
    });

    connectContract();
  },
};
</script>

<template>
  <div class="uk-width-1-1">
    <div v-if="loading" class="spinner-outer">
      <div class="spinner-inner">
        <div uk-spinner="ratio: 3"></div>
      </div>
    </div>
    <div>
      <div class="uk-width-1-1 box navbar">
        <Menu />
      </div>
    </div>
    <div class="uk-width-1-1 box no-padding-top">
      <div uk-grid>
        <div class="uk-width-3-4@m routerview-card">
          <div style="padding-bottom: 20px;">
            <div class="uk-width-1-1">
              <Wallet />
            </div>
          </div>
          <div>
            <div class="uk-width-1-1 routerview-title">
              <div class="title-text"><span>📩 SEND</span></div>
              <div class="title-text-right"><span>- X</span></div>
            </div>
            <div class="uk-width-1-1 routerview-contents">
              <SendView />
            </div>
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

.spinner-outer {
  z-index: 2;
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
}

.spinner-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -50px 0 0 -50px;
}
</style>
