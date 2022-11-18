<template>
  <div class="pixel-text contents">
    <form class="uk-form-stacked">
      <div class="uk-margin">
        <label class="pixel-title" for="form-stacked-text">To</label>
        <div class="uk-form-controls">
          <input
            class="uk-input"
            id="form-stacked-text"
            type="text"
            placeholder="ex) 0x0123abcd.."
          />
        </div>
      </div>

      <div class="uk-margin">
        <label class="pixel-title" for="form-stacked-text">Balance</label>
        <div class="uk-form-controls">
          <input
            class="uk-input"
            id="form-stacked-text"
            type="number"
            placeholder="ex) 100.0"
          />
        </div>
      </div>

      <div class="uk-margin">
        <label class="pixel-title" for="form-stacked-select">Options</label>
        <div class="uk-form-controls">
          <select class="uk-select" id="form-stacked-select">
            <option>Option 01</option>
            <option>Option 02</option>
          </select>
        </div>
      </div>

      <div class="uk-margin">
        <div class="pixel-title">Options2</div>
        <div class="uk-form-controls">
          <label><input class="uk-radio" type="radio" name="radio1" /> Option 01</label
          ><br />
          <label><input class="uk-radio" type="radio" name="radio1" /> Option 02</label>
        </div>
      </div>
    </form>
    <hr />
    <p>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
      Ipsum has been the industry's standard dummy text ever since the 1500s, when an
      unknown printer took a galley of type and scrambled it to make a type specimen book.
      It has survived not only five centuries, but also the leap into electronic
      typesetting, remaining essentially unchanged.
    </p>
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
  font-size: 1.2rem;
  color: white;
}
</style>
