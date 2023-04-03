<template>
  <div v-if="!passwordEntered">
    <div class="password-input">
      <h2 class="uk-card-title pixel-title">{{ title }}</h2>
      <input
        v-if="!hasPassword"
        type="password"
        v-model.trim="password"
        @keyup.enter="setPasswordHandler"
        class="uk-input uk-form-width-medium"
      />
      <input
        v-else
        type="password"
        v-model.trim="password"
        @keyup.enter="checkPasswordHandler"
        class="uk-input uk-form-width-medium"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showOverlay: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      passwordEntered: false,
      password: "",
      hasPassword: false,
      title: "Set Password",
    };
  },
  mounted() {
    this.checkPassword();
  },
  methods: {
    async checkPassword() {
      // Check if the password exists in the extension's local storage
      const password = (await chrome.storage.local.get(["password"])).password;
      console.log(password, this.password, password == true);
      if (password) {
        this.hasPassword = true;
        this.title = "Type Password";
      }
    },
    async setPasswordHandler() {
      if (this.password) {
        await chrome.storage.local.set({ password: this.password }, () => {
          this.passwordEntered = true;
          this.$emit("valid-password", this.password);
        });
      }
    },
    async checkPasswordHandler() {
      const password = (await chrome.storage.local.get(["password"])).password;
      if (this.password === password) {
        this.passwordEntered = true;
        this.$emit("valid-password", this.password);
      } else {
        alert("Incorrect password. Please try again.");
        this.password = "";
      }
    },
  },
  watch: {
    showOverlay(newVal) {
      if (!newVal) {
        this.passwordEntered = false;
        this.password = "";
      }
    },
  },
};
</script>

<style scoped>
.password-overlay {
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.password-input {
  text-align: center;
}
</style>
  