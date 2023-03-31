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
      modalClose: false,
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
      this.modalClose = true;
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
        setCurrentWallet(this.selectedValue).then((success) => {
          if (success) {
            this.startUpdatingBalance();
            this.emitter.emit("account-connect-event", true);
          } else {
            console.log("connection failed!");
            this.emitter.emit("account-connect-event", false);
          }
        });
      } else if (selectedOption == "ImportAccount") {
        const input = prompt("Enter your private key:");
        if (input) {
          const newAccount = await importNewAccount(input);
          this.accounts = await loadAccounts();
          this.selectedValue = newAccount.privateKey; // update
          setCurrentWallet(this.selectedValue).then((success) => {
            if (success) {
              this.startUpdatingBalance();
              this.emitter.emit("account-connect-event", true);
            } else {
              console.log("connection failed!");
              this.emitter.emit("account-connect-event", false);
            }
          });
        } else {
          console.log("No input provided");
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
      console.log("updateBalance:", getAddress());
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

    async ERCfaucetOnClick() {
      if (getAddress() === "") return;

      if (confirm("Are you sure you want to perform the faucet action?")) {
        this.emitter.emit("loading-event", true);
        try {
          const success = await faucet();
          if (success) {
            this.updateBalance();
          } else {
            console.error("faucet fail!");
            alert("Fail to perform faucet action");
          }
        } catch {
          alert("Fail to perform faucet action");
        } finally {
          this.emitter.emit("loading-event", false);
        }
      }
    },
    async faucetOnClick() {
      window.open("https://faucet.polygon.technology/");
    },
  },
};
</script>

<template>
  <div>
    <!-- This is the modal with the default close button -->
    <div v-if="!modalClose" id="modal-center" class="uk-flex-top" uk-modal>
      <div class="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
        <button class="uk-modal-close-default" type="button" uk-close></button>
        <password-input @valid-password="onValidPassword"></password-input>
      </div>
    </div>

    <div class="uk-width-1-1 routerview-card">
      <div class="uk-text-center wrap-top">
        <!-- Connect Button -->
        <button
          v-if="!accountsConnected"
          class="uk-width-1-1 balance-button pixel-title uk-button uk-button-default uk-margin-small-bottom login-button"
          href="#modal-center"
          uk-toggle
          @click="connectOnClick"
        >
          Login
        </button>

        <!-- Accounts Dropdown -->
        <select
          v-if="accountsConnected"
          v-model="selectedValue"
          id="account-select"
          :class="
            selectedValue === 'Connect'
              ? 'uk-width-1-1 balance-button pixel-title uk-button uk-button-default uk-margin-small-bottom login-button'
              : 'uk-width-1-1 balance-button pixel-title uk-button uk-button-default uk-margin-small-bottom'
          "
          v-on:change="onAccountSelect"
        >
          <option :value="'Connect'" hidden style="color: white">
            Choose Account
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

        <!-- ETH BALANCE -->
        <button
          uk-tooltip="Visit MATIC Faucet"
          class="uk-width-1-1 balance-button pixel-title uk-button uk-button-default uk-margin-small-bottom"
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
            {{ `MATIC / ` + formattedETH }}
          </span>
        </button>

        <!-- ERC20 -->
        <button
          uk-tooltip="Click to Get TERC20"
          class="uk-width-1-1 balance-button pixel-title uk-button uk-button-default uk-margin-small-bottom"
          @click="ERCfaucetOnClick()"
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
          class="uk-width-1-1 balance-button pixel-title uk-button uk-button-default uk-margin-small-bottom"
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
      ></div>
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
  border: 2px solid #ffffff;
  background-color: rgb(255, 255, 255);
  color: rgb(0, 0, 0);
}
.login-button:hover {
  border: 2px solid #ffffff;
  background-color: rgb(255, 255, 255);
  color: rgb(0, 0, 0);
}
</style>
