<script>
import {
  getAccount,
  getAllowance,
  approveMax,
  submit,
} from "../assets/js/interface_request.js";
import { TOKEN_CONTRACT_ADDR } from "../assets/js/contract.js";
import { ethers } from "ethers";
export default {
  data() {
    return {
      connected: false,
      approval_erc20: false,

      erc20: "-",
      from: "-",
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
        approveMax("ERC").then((success) => {
          this.emitter.emit("loading-event", false);
          if (success) this.approval_erc20 = true;
          else this.approval_erc20 = false;
        });
      }
    },
    submitOnClick: function () {
      console.log("click submitOnClick");
      this.emitter.emit("loading-event", true);
      submit(
        this.erc20,
        this.from,
        this.to,
        this.value,
        this.extra,
        this.blocks,
        this.functions
      ).then((success) => {
        this.emitter.emit("loading-event", false);
        if (success) this.updateValues();
        else console.log("submit fail!");
      });
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
          <select class="uk-select" id="form-stacked-select">
            <option>{{ erc20 }}</option>
          </select>
        </div>
      </div>

      <div class="uk-margin">
        <label class="pixel-title" for="form-stacked-select"
          ><span style="color: red; font-size: 0.9rem">*</span>From</label
        >
        <div class="uk-form-controls">
          <select class="uk-select" id="form-stacked-select">
            <option>{{ from }}</option>
            <option v-if="connected">Create Wallet</option>
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
            /><span class="radio-text"> Scheduled Transfer</span></label
          ><br />
          <label
            ><input
              class="uk-radio"
              type="radio"
              v-model="functions"
              name="functions"
              v-bind:value="'R'"
            /><span class="radio-text"> Recoverable Transfer</span></label
          ><br />
          <label
            ><input
              class="uk-radio"
              type="radio"
              v-model="functions"
              name="functions"
              v-bind:value="'E'"
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
        v-if="approval_erc20"
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
      >
        Please connect to wallet
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
