<script>
import {
  getAccount,
  getWalletAddress,
  getAllowance,
  approveMax,
  createWallet,
  submit,
} from "../assets/js/interface_request.js";
import { isTargetPhising } from "../assets/js/fds.js";
import { TOKEN_CONTRACT_ADDR } from "../assets/js/contract.js";
import { ethers } from "ethers";
export default {
  data() {
    return {
      connected: false,
      approval_erc20: false,
      myAccount: "",
      myWallet: "",

      erc20: "",
      from: "",
      to: "",
      value: ethers.BigNumber.from("0"),
      extra: ethers.utils.formatBytes32String(""),
      blocks: ethers.BigNumber.from("0"),
      functions: "",

      value_format: "",
      extra_format: "",
      blocks_format: "",
    };
  },
  computed: {
    formattedValue: {
      get() {
        return this.value_format;
      },
      set(value) {
        let sValue = value.toString();
        this.value_format = sValue;
        if (sValue === "") sValue = "0";
        this.value = ethers.utils.parseUnits(sValue, "ether");
      },
    },
    formattedExtra: {
      get() {
        return this.extra_format;
      },
      set(value) {
        this.extra_format = value;
        if (value === "") this.extra = ethers.utils.formatBytes32String(value);
        else this.extra = value;
      },
    },
    formattedBlocks: {
      get() {
        return this.blocks_format;
      },
      set(value) {
        let sValue = value.toString();
        this.blocks_format = sValue;
        if (sValue === "") sValue = "0";
        this.blocks = ethers.BigNumber.from(sValue);
      },
    },
  },
  mounted() {
    this.emitter.on("metamask-connect-event", (msg) => {
      this.connected = msg;
      if (this.connected) {
        this.updateValues();
        this.checkAllowance();
      }
    });

    if (getAccount() !== "") {
      this.connected = true;
    }

    this.updateValues();
    this.checkAllowance();
  },
  methods: {
    checkAllowance: function () {
      console.log("Check Allowance");
      getAllowance("ERC").then((allowance) => {
        console.log("allowance", allowance);
        if (allowance && !allowance.isZero()) {
          console.log("allowance : ", allowance);
          this.approval_erc20 = true;
        }
      });
    },
    updateValues: function () {
      console.log("Update Value");
      if (this.connected) {
        this.erc20 = TOKEN_CONTRACT_ADDR;
        this.from = getAccount();
        this.myAccount = getAccount();
        getWalletAddress().then((result) => {
          this.myWallet = result;
          if (result === "0x0000000000000000000000000000000000000000")
            this.myWallet = "Create Wallet";
        });
      }
      /*
      getTrustLevel().then((result) => {
        this.trustLevel = +(result / 100).toFixed(2);
      });
      getMaxLTV().then((result) => {
        this.maxLTV = +(result / 100).toFixed(2);
      });
      */
    },
    approveOnClick: function () {
      console.log("approveOnClick (approval_erc20) : ", this.approval_erc20);
      if (!this.approval_erc20) {
        this.emitter.emit("loading-event", true);
        try {
          approveMax("ERC").then((success) => {
            if (success) this.approval_erc20 = true;
            else this.approval_erc20 = false;
          });
        } catch {
        } finally {
          this.emitter.emit("loading-event", false);
        }
      }
    },
    submitOnClick: async function () {
      console.log("click submitOnClick");
      this.emitter.emit("loading-event", true);
      if (await isTargetPhising(this.to)) {
        const confirmPopup = window.confirm(
          "The destination address is identified as a phishing address. Do you want to proceed?"
        );
        if (confirmPopup) {
          try {
            const success = await submit(
              this.erc20,
              this.from,
              this.to,
              this.value,
              this.extra,
              this.blocks,
              this.functions
            );
            if (success) {
              this.updateValues();
            } else {
              console.log("submit fail!");
              alert("Incorrect Inputs");
            }
          } catch {
            alert("Incorrect Inputs");
          } finally {
            this.emitter.emit("loading-event", false);
          }
        } else {
          this.emitter.emit("loading-event", false);
          console.log("submit cancle!");
        }
      } else {
        try {
          const success = await submit(
            this.erc20,
            this.from,
            this.to,
            this.value,
            this.extra,
            this.blocks,
            this.functions
          );
          if (success) {
            this.updateValues();
          } else {
            console.log("submit fail!");
            alert("Incorrect Inputs");
          }
        } catch {
          alert("Incorrect Inputs");
        } finally {
          this.emitter.emit("loading-event", false);
        }
      }
    },
    CreateWalletOnClick: function () {
      console.log("click CreateWalletOnClick");
      this.emitter.emit("loading-event", true);
      try {
        createWallet().then((result) => {
          if (result) this.updateValues();
          else console.log("create wallet fail!");
        });
      } catch {
      } finally {
        this.emitter.emit("loading-event", false);
      }
    },
  },
};
</script>

<template>
  <div class="pixel-text contents">
    <form class="uk-form-stacked">
      <div class="uk-margin">
        <label class="pixel-title" for="form-stacked-select"
          ><span style="color: red; font-size: 0.9rem">*</span>Erc20</label
        >
        <div class="uk-form-controls">
          <select class="uk-select" :disabled="!connected">
            <option>{{ erc20 }}</option>
          </select>
        </div>
      </div>

      <div class="uk-margin">
        <label class="pixel-title" for="form-stacked-select"
          ><span style="color: red; font-size: 0.9rem">*</span>From</label
        >
        <div class="uk-form-controls">
          <select class="uk-select" v-model="from" :disabled="!connected">
            <option :value="myAccount">{{ myAccount }}</option>
            <option :value="myWallet" v-if="connected">{{ myWallet }}</option>
          </select>
        </div>
      </div>

      <div class="uk-margin">
        <label class="pixel-title" for="form-stacked-text"
          ><span style="color: red; font-size: 0.9rem">*</span>To</label
        >
        <div class="uk-form-controls">
          <input
            class="uk-input"
            type="text"
            v-model="to"
            placeholder="ex) 0x01a8d7f.."
            :disabled="!connected"
          />
        </div>
      </div>

      <div class="uk-margin">
        <label class="pixel-title" for="form-stacked-text"
          ><span style="color: red; font-size: 0.9rem">*</span>Value</label
        >
        <div class="uk-form-controls">
          <input
            class="uk-input"
            type="number"
            v-model="formattedValue"
            placeholder="ex) 100.0"
            :disabled="!connected"
          />
        </div>
      </div>

      <div class="uk-margin">
        <label class="pixel-title" for="form-stacked-text">Extra</label>
        <div class="uk-form-controls">
          <input
            class="uk-input"
            type="text"
            v-model="formattedExtra"
            placeholder="extra data (0x...)"
            :disabled="!connected"
          />
        </div>
      </div>

      <div class="uk-margin">
        <label class="pixel-title" for="form-stacked-text"
          ><span style="color: red; font-size: 0.9rem">*</span>Blocks</label
        >
        <div class="uk-form-controls">
          <input
            class="uk-input"
            type="number"
            v-model="formattedBlocks"
            placeholder="execute after N block (ex. 300)"
            :disabled="!connected"
          />
        </div>
      </div>

      <div class="uk-margin">
        <div class="pixel-title">Function</div>
        <div class="uk-form-controls">
          <label
            ><input
              class="uk-radio"
              type="radio"
              v-model="functions"
              name="functions"
              v-bind:value="'S'"
              :disabled="from !== myAccount || !connected"
            /><span class="radio-text"> Scheduled Transfer</span></label
          ><br />
          <label
            ><input
              class="uk-radio"
              type="radio"
              v-model="functions"
              name="functions"
              v-bind:value="'R'"
              :disabled="from !== myAccount || !connected"
            /><span class="radio-text"> Recoverable Transfer</span></label
          ><br />
          <label
            ><input
              class="uk-radio"
              type="radio"
              v-model="functions"
              name="functions"
              v-bind:value="'E'"
              :disabled="from === myAccount || !connected"
            /><span class="radio-text"> Expirable Approve</span></label
          >
        </div>
      </div>
    </form>
    <!--hr />
    <p>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
      Ipsum has been the industry's standard dummy text ever since the 1500s, when an
      unknown printer took a galley of type and scrambled it to make a type specimen book.
      It has survived not only five centuries, but also the leap into electronic
      typesetting, remaining essentially unchanged.
    </p-->
    <div>
      <button
        v-if="from === 'Create Wallet'"
        class="pixel-title uk-button uk-button-default uk-width-1-1 uk-margin-small-bottom"
        @click="CreateWalletOnClick"
      >
        Create Wallet
      </button>
      <button
        v-else-if="approval_erc20 || functions === 'E'"
        class="pixel-title uk-button uk-button-default uk-width-1-1 uk-margin-small-bottom"
        @click="submitOnClick"
      >
        Submit
      </button>
      <button
        v-else-if="connected"
        class="pixel-title uk-button uk-button-default uk-width-1-1 uk-margin-small-bottom"
        @click="approveOnClick"
      >
        Approve
      </button>
      <button
        v-else
        class="pixel-title uk-button uk-button-default uk-width-1-1 uk-margin-small-bottom"
        :disabled="!connected"
      >
        Please connect wallet
      </button>
    </div>
  </div>
</template>

<style scoped>
.uk-button-default {
  border: 1px solid #e5e5e5;
  font-size: 1.2rem;
  color: #e5e5e5;
}

.uk-button-default:hover {
  border: 1px solid #e5e5e5;
  background-color: #e5e5e5;
  color: black;
}

.radio-text {
  font-size: 1.4rem;
}
</style>
