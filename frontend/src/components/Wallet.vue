<script>
import {
  connectMetamask,
  addTokenToMetamask,
  faucet,
  getAccount,
  getBalance,
} from "../assets/js/interface_request.js";
import { ethers } from "ethers";
export default {
  data() {
    return {
      connected: false,
      btnText: "Connect Wallet",
      btnTooltip: "Connect Wallet",

      erc: ethers.BigNumber.from(0),
      keeperc: ethers.BigNumber.from(0),

      intervalid: "",
    };
  },
  computed: {
    formattedERC: {
      get() {
        let res = ethers.utils.formatEther(this.erc);
        return (+res).toFixed(4);
      },
      set(value) {
        this.erc = ethers.utils.parseUnits(value, "ether");
      },
    },
    formattedKEEPERC: {
      get() {
        let res = ethers.utils.formatEther(this.keeperc);
        return (+res).toFixed(4);
      },
      set(value) {
        this.keeperc = ethers.utils.parseUnits(value, "ether");
      },
    },
  },
  mounted() {
    this.emitter.on("metamask-connect-event", (msg) => {
      this.connected = msg;
      if (this.connected) {
        let account = getAccount();
        this.btnText = account;
        this.btnTooltip = account;
      }
      this.updateBalance();
    });
  },
  methods: {
    connectOnClick: function () {
      if (getAccount() !== "") return;
      connectMetamask().then((success) => {
        if (success) {
          console.log("metamask successfully connected!");
          this.emitter.emit("metamask-connect-event", true);

          // update balance
          this.intervalid = setInterval(
            function () {
              this.updateBalance();
            }.bind(this),
            3000
          );
        } else {
          console.log("metamask connection failed!");
          this.btnTest = "metamask required!";
          this.btnTooltip = "metamask required!";
          this.emitter.emit("metamask-connect-event", false);
        }
      });
    },
    faucetOnClick: function () {
      console.log("click faucetOnClick");
      this.emitter.emit("loading-event", true);
      faucet().then((success) => {
        this.emitter.emit("loading-event", false);
        if (success) this.updateBalance();
        else console.log("fauacet fail!");
      });
    },
    updateBalance: function () {
      if (getAccount() === "" || !this.connected) return;
      getBalance("ERC").then((result) => {
        this.erc = result;
      });
      getBalance("KEEPERC").then((result) => {
        this.keeperc = result;
      });
      console.log("UpdateBalance!");
    },
    addToken: function (tokenName) {
      addTokenToMetamask(tokenName);
    },
  },
};
</script>

<template>
  <div>
    <div class="uk-width-1-1 routerview-card">
      <div class="uk-text-center wrap-top">
        <button
          id="google-auth-btn"
          v-if="!connected"
          class="uk-width-1-3 balance-button pixel-title uk-button uk-button-default uk-margin-small-bottom"
          @click="connectOnClick"
        >
          <span
            style="
              display: block;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            "
          >
            {{ btnText }}</span
          >
        </button>
        <button
          v-if="connected"
          class="uk-width-1-3 balance-button pixel-title uk-button uk-button-default uk-margin-small-bottom"
          @click="faucetOnClick"
        >
          <span
            style="
              display: block;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            "
          >
            {{ `FAUCET / ` + btnText }}</span
          >
        </button>
        <button
          class="uk-width-1-3 balance-button pixel-title uk-button uk-button-default uk-margin-small-bottom"
          @click="addToken('ERC')"
        >
          <span
            style="
              display: block;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            "
          >
            {{ `TERC20 / ` + formattedERC }}</span
          >
        </button>
        <button
          class="uk-width-1-3 balance-button pixel-title uk-button uk-button-default uk-margin-small-bottom"
          @click="addToken('KEEPERC')"
        >
          <span
            style="
              display: block;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            "
          >
            {{ `KTERC20 / ` + formattedKEEPERC }}</span
          >
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.uk-button-default {
  outline: 2px solid #e5e5e5;
  color: white;
  max-height: 40px;
  font-size: 0.8rem;
}

/*
.uk-button-default:hover {
  border: 2px solid #e5e5e5;
  color: white;
  font-size: 0.9rem;
}
*/

.uk-button-default:hover {
  border: 2px solid #e5e5e5;
  background-color: #e5e5e5;
  color: black;
}
</style>
