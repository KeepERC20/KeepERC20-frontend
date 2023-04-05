<template>
  <div>
    <div id="modal-key" class="uk-flex-top" uk-modal>
      <div class="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
        <button class="uk-modal-close-default" type="button" uk-close></button>
        <api-key-input
          @api-key-entered="onApiKey"
          @close-modal="closeModal"
        ></api-key-input>
      </div>
    </div>

    <div class="uk-width-1-1 routerview-card">
      <div class="uk-text-center wrap-top">
        <form
          class="uk-width-1-1 uk-search uk-search-default uk-margin-small-bottom"
          @submit.prevent="performSearch"
        >
          <a
            class="uk-search-icon-flip"
            uk-search-icon
            @click="performSearch"
          ></a>
          <input
            class="uk-search-input"
            type="search"
            placeholder="Search"
            aria-label="Search"
            v-model="searchText"
          />
        </form>

        <button
          class="uk-width-1-1 balance-button pixel-title uk-button uk-button-default uk-margin-small-bottom set-button"
          href="#modal-key"
          uk-toggle
        >
          Set API KEY
        </button>

        <div
          v-if="response"
          class="uk-width-1-1 uk-margin-small-bottom routerview-card"
        >
          <div class="uk-width-1-1 routerview-title">
            <div class="title-text"><span>ADVICE</span></div>
            <div class="title-text-right"><span>- X</span></div>
          </div>
          <div class="uk-width-1-1 routerview-contents">
            <span class="advice-contents">{{ response }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ApiKeyInput from "./ApiKeyInput.vue";
import { GPT35Turbo } from "../assets/js/chat.js";

export default {
  components: {
    ApiKeyInput,
  },
  data() {
    return {
      //   isOrganization: false,
      searchText: "",
      response: "",

      //   organization: "",
      apiKey: "",
    };
  },
  methods: {
    // onOrganization({ organization }) {
    //   this.isOrganization = true;
    //   this.organization = organization;
    //   console.log("Organization:", this.organization);
    //   if (this.isOrganization && this.isApiKey) {
    //     // this.modalClose = true;
    //   }
    // },
    onApiKey(apiKey) {
      this.apiKey = apiKey;
      console.log("API KEY:", this.apiKey);
    },

    async performSearch() {
      if (!this.searchText) {
        return;
      }

      const response = await GPT35Turbo(
        // this.organization,
        this.apiKey,
        this.searchText
      );
      this.response = response;

      console.log("response:", this.response);
    },

    // TODO: temp. implementation
    closeModal() {
      const modal = document.getElementById("modal-key");
      modal.style.display = "none";
    },
  },
};
</script>

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

.uk-search {
  outline: 2px solid #e5e5e5;

  /* 1 */
  display: inline-block;
  /* 2 */
  position: relative;
  /* 3 */
  max-width: 100%;
  /* 4 */
  margin: 0;
}
.uk-search-input {
  color: white;
}

.set-button {
  border: 2px solid #ffffff;
  background-color: rgb(255, 255, 255);
  color: rgb(0, 0, 0);
}
.set-button:hover {
  border: 2px solid #ffffff;
  background-color: rgb(255, 255, 255);
  color: rgb(0, 0, 0);
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

.advice-contents {
  font-family: "Silkscreen", cursive;
  font-weight: 400;
}
</style>
