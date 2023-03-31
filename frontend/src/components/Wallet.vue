<script>
import {
  setCurrentWallet,
  addNewAccount,
  faucet,
  loadAccounts,
  getAddress,
  getBalance,
} from "../assets/js/interface_request.js";
import { ethers } from "ethers";
export default {
  data() {
    return {
      connected: false,
      // TODO: btnTooltip: "Connect Wallet",

      erc: ethers.BigNumber.from(0), // balance
      keeperc: ethers.BigNumber.from(0), // balance

      // TODO: created vs computed
      // can be update
      accounts: [],

      selectedValue: "Connect",
    };
  },
  // watch: {

  // },
  async created() {
    this.accounts = await loadAccounts();
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
    this.emitter.on("account-connect-event", (msg) => {
      this.connected = msg;
    });
  },
  methods: {
    async connectOnClick(event) {
      const selectedOption = event.target.value;
      if (selectedOption == "CreateAccount") {
        const newAccount = await addNewAccount();
        this.accounts = await loadAccounts();
        this.selectedValue = newAccount.privateKey; // update
        this.emitter.emit("account-connect-event", true);
        // this.emitter.emit("account-connect-event", false); // TODO
      } else if (selectedOption == "ImportAccount") {
        console.log("ImportAccount"); // TODO
      } else {
        console.log("PrivateKey", selectedOption); // or Connect
        setCurrentWallet(selectedOption).then((success) => {
          if (success) {
            this.startUpdatingBalance();
            this.emitter.emit("account-connect-event", true);
          } else {
            console.log("connection failed!");
            this.emitter.emit("account-connect-event", false);
          }
        });
      }
    },
    async startUpdatingBalance() {
      while (true) {
        await this.updateBalance();
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    },
    async updateBalance() {
      if (getAddress() === "") return;
      this.erc = await getBalance("ERC");
      this.keeperc = await getBalance("KEEPERC");
    },

    // async addToken(tokenName) {
    //   // click -> select
    // },

    async faucetOnClick() {
      this.emitter.emit("loading-event", true);

      const success = await faucet();
      if (success) {
        this.emitter.emit("loading-event", false);
        this.updateBalance();
      } else console.error("faucet fail!");
    },
  },
};
</script>

<template>
  <div>
    <div class="uk-width-1-1 routerview-card">
      <div class="uk-text-center wrap-top">
        <!-- Accounts -->
        <select
          v-model="selectedValue"
          id="account-select"
          class="uk-width-1-3 balance-button pixel-title uk-button uk-button-default uk-margin-small-bottom"
          v-on:change="connectOnClick"
        >
          <option :value="'Connect'" hidden style="color: white">
            Connect
          </option>
          <optgroup label="Accounts">
            <option
              v-for="account in accounts"
              :value="account.privateKey"
              :key="account.address"
            >
              <!-- TODO: ... / LINK balance -->
              {{ account.address }}
            </option>
          </optgroup>
          <optgroup label="Managing">
            <!-- TODO: add (get private key) -->
            <option :value="'CreateAccount'" @click="changeSelectedOption">
              Create Account
            </option>
            <option :value="'ImportAccount'">Import Account</option>
          </optgroup>
        </select>

        <!-- ERC20 -->
        <!-- @click="addToken('ERC')" -->
        <button
          class="uk-width-1-3 balance-button pixel-title uk-button uk-button-default uk-margin-small-bottom"
        >
          <span
            style="
              display: block;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            "
          >
            {{ `TERC20 / ` + formattedERC }}
          </span>
        </button>

        <!-- KERC20 -->
        <!-- @click="addToken('KEEPERC')" -->
        <button
          class="uk-width-1-3 balance-button pixel-title uk-button uk-button-default uk-margin-small-bottom"
        >
          <span
            style="
              display: block;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            "
          >
            {{ `KTERC20 / ` + formattedKEEPERC }}
          </span>
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

.uk-button-default:hover {
  border: 2px solid #e5e5e5;
  background-color: #e5e5e5;
  color: black;
}
</style>
