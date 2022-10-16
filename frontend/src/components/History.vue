<template>
  <div class="uk-width-1-1 routerview-card">
    <div class="uk-width-1-1 routerview-title">
      <div class="title-text"><span>Transactions</span></div>
      <div class="title-text-right"><span>- X</span></div>
    </div>
    <div class="uk-width-1-1 routerview-contents">
      <span class="pixel-title">&nbsp;&nbsp;&nbsp;To: 0x1234</span>
      <br />
      <span class="pixel-title">+ Value: 1.0000 ETH</span>
      <hr />
      <span class="pixel-title">= Balance: 2.0000 ETH</span>
    </div>
  </div>
</template>

<style scoped>
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
</style>
