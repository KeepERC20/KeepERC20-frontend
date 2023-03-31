<script>
import {
  setCurrentWallet,
  createNewAccount,
  importNewAccount,
  faucet,
  loadAccounts,
  getAddress,
  getETHBalance,
  getBalance,
} from "../assets/js/interface_request.js";
import { ethers } from "ethers";
import PasswordInput from "./PasswordInput.vue";

export default {
  components: {
    PasswordInput,
  },

  data() {
    return {
      connected: false,
      // TODO: btnTooltip: "Connect Wallet",

      erc: ethers.BigNumber.from(0), // balance
      keeperc: ethers.BigNumber.from(0), // balance
      eth: ethers.BigNumber.from(0), // balance

      // TODO: created vs computed
      // can be update
      accounts: [],

      selectedValue: "Connect",

      showPasswordOverlay: false,
      accountsConnected: false,
    };
  },
  // watch: {

  // },
  async created() {
    this.accounts = await loadAccounts();
    console.log(this.accounts);
  },
  computed: {
    formattedETH: {
      get() {
        let res = ethers.utils.formatEther(this.eth);
        return (+res).toFixed(4);
      },
      set(value) {
        this.eth = ethers.utils.parseUnits(value, "ether");
      },
    },
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
    onValidPassword(password) {
      console.log("Valid password entered:", password);
      // Perform any action you need with the valid password
      // For example, you can store it in a data property
      this.enteredPassword = password;

      this.showPasswordOverlay = false;
      this.accountsConnected = true;
    },
    async connectOnClick() {
      this.showPasswordOverlay = true;
    },

    async onAccountSelect(event) {
      const selectedOption = event.target.value;
      if (selectedOption == "CreateAccount") {
        const newAccount = await createNewAccount();
        this.accounts = await loadAccounts();
        this.selectedValue = newAccount.privateKey; // update
        this.startUpdatingBalance();
        this.emitter.emit("account-connect-event", true);
        // this.emitter.emit("account-connect-event", false); // TODO: when fail
      } else if (selectedOption == "ImportAccount") {
        const input = prompt("Enter your private key:");
        if (input) {
          const newAccount = await importNewAccount(input);
          this.accounts = await loadAccounts();
          this.selectedValue = newAccount.privateKey; // update
          this.startUpdatingBalance();
          this.emitter.emit("account-connect-event", true);
        } else {
          console.log("No input provided");
          // this.emitter.emit("account-connect-event", false); // TODO: when fail
        }
      } else {
        console.log("PrivateKey", selectedOption);
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
      this.eth = await getETHBalance();
      this.erc = await getBalance("ERC");
      this.keeperc = await getBalance("KEEPERC");
    },

    changeAtCreateAccount() {
      this.selectedValue = "CreateAccount";
    },
    changeAtImportAccount() {
      this.selectedValue = "ImportAccount";
    },

    // Change
    // async addToken(tokenName) {
    //   // click -> select
    // },

    async faucetOnClick() {
      if (getAddress() === "") return;

      if (confirm("Are you sure you want to perform the faucet action?")) {
        this.emitter.emit("loading-event", true);
        const success = await faucet();
        if (success) {
          this.emitter.emit("loading-event", false);
          this.updateBalance();
        } else {
          console.error("faucet fail!");
        }
      }
    },
  },
};
</script>

<template>
  <div>
    <password-input
      v-if="showPasswordOverlay"
      @valid-password="onValidPassword"
    ></password-input>

    <div class="uk-width-1-1 routerview-card">
      <div class="uk-text-center wrap-top">
        <!-- Connect Button -->
        <button
          v-if="!accountsConnected"
          class="uk-width-1-3 balance-button pixel-title uk-button uk-button-default uk-margin-small-bottom login-button"
          @click="connectOnClick"
        >
          Login
        </button>

        <!-- Accounts Dropdown -->
        <select
          v-if="accountsConnected"
          v-model="selectedValue"
          id="account-select"
          class="uk-width-1-3 balance-button pixel-title uk-button uk-button-default uk-margin-small-bottom"
          v-on:change="onAccountSelect"
        >
          <option :value="'Connect'" hidden style="color: white">
            Connected
          </option>
          <optgroup label="Accounts">
            <option
              v-for="account in accounts"
              :value="account.privateKey"
              :key="account.address"
            >
              {{ account.address }}
            </option>
          </optgroup>
          <optgroup label="Managing">
            <option :value="'CreateAccount'" @click="changeAtCreateAccount">
              Create Account
            </option>
            <option :value="'ImportAccount'" @click="changeAtImportAccount">
              Import Account
            </option>
          </optgroup>
        </select>

        <!-- ERC20 -->
        <button
          class="uk-width-1-3 balance-button pixel-title uk-button uk-button-default uk-margin-small-bottom"
          @click="faucetOnClick()"
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
      <div
        v-if="
          selectedValue !== 'CreateAccount' &&
          selectedValue !== 'ImportAccount' &&
          selectedValue !== 'Connect'
        "
      >
        {{ `Balance: ` + formattedETH }}
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

.login-button {
  border: 2px solid #e5e5e5;
  background-color: rgb(255, 255, 255);
  color: rgb(0, 0, 0);
}
.login-button:hover {
  border: 2px solid #e5e5e5;
  background-color: rgb(255, 255, 255);
  color: rgb(0, 0, 0);
}
</style>
