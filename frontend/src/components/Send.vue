<script>
import { getAccount } from "../assets/js/interface_request.js";
import { TOKEN_CONTRACT_ADDR } from "../assets/js/contract.js";
import { ethers } from "ethers";
export default {
  data() {
    return {
      connected: false,

      erc20: "-",
      from: "-",
      to: "",
      value: ethers.BigNumber.from("0"),
      extra: "",
      blocks: ethers.BigNumber.from("0"),

      value_format: "",
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
    formattedBlocks: {
      get() {
        return this.blocks_format;
      },
      set(value) {
        let sValue = value.toString();
        this.value_format = sValue;
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
      /*
      getAllowance("WETH").then((allowance_weth) => {
        console.log("allowance_weth", allowance_weth);
        if (allowance_weth && !allowance_weth.isZero()) {
          this.approval_weth = true;
          getAllowance("FOXS").then((allowance_foxs) => {
            if (allowance_foxs && !allowance_foxs.isZero()) {
              this.approval_foxs = true;
            }
          });
        }
      });
      */
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
  },
};
</script>

<template>
  <div class="pixel-text contents">
    <form class="uk-form-stacked">
      <div class="uk-margin">
        <label class="pixel-title" for="form-stacked-select">Erc20</label>
        <div class="uk-form-controls">
          <select class="uk-select" id="form-stacked-select">
            <option>{{ erc20 }}</option>
          </select>
        </div>
      </div>

      <div class="uk-margin">
        <label class="pixel-title" for="form-stacked-select">From</label>
        <div class="uk-form-controls">
          <select class="uk-select" id="form-stacked-select">
            <option>{{ from }}</option>
            <option v-if="connected">Create Wallet</option>
          </select>
        </div>
      </div>

      <div class="uk-margin">
        <label class="pixel-title" for="form-stacked-text">To</label>
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
        <label class="pixel-title" for="form-stacked-text">Value</label>
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
            v-model="extra"
            placeholder="extra data (0x...)"
          />
        </div>
      </div>

      <div class="uk-margin">
        <label class="pixel-title" for="form-stacked-text">Blocks</label>
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
          <label><input class="uk-radio" type="radio" name="radio1" /><span class="radio-text"> Scheduled Transfer</span></label
          ><br />
          <label><input class="uk-radio" type="radio" name="radio1" /><span class="radio-text"> Recoverable Transfer</span></label><br />
          <label><input class="uk-radio" type="radio" name="radio1" /><span class="radio-text"> Expirable Approve</span></label>
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
        class="pixel-title uk-button uk-button-default uk-width-1-1 uk-margin-small-bottom"
      >
        Submit
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
