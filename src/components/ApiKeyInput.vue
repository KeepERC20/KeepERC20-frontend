<template>
  <div class="api-input">
    <h2 class="uk-card-title pixel-title">{{ title }}</h2>
    <div>
      <input
        id="api-input"
        type="text"
        v-model.trim="apiKey"
        @keyup.enter="setApiKeyHandler"
        class="uk-input uk-form-width-medium"
      />
    </div>
  </div>
</template>
    
<script>
export default {
  props: {
    modalClose: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      apiKey: "",
      title: "Set API Key",
    };
  },
  mounted() {
    // this.checkApiKey();
  },
  methods: {
    async setApiKeyHandler() {
      if (this.apiKey) {
        this.$emit("api-key-entered", this.apiKey);
      }
      this.$emit("close-modal");
    },
  },
};
</script>
    
  <style scoped>
.api-overlay {
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

.api-input {
  text-align: center;
}
</style>
