<script>
import {
  getAccount,
  getStringFromTypes,
  getStringFromStatus,
  getActiveTasks,
  getTask,
} from "../assets/js/interface_request.js";
import { ethers } from "ethers";
export default {
  data() {
    return {
      connected: false,

      taskIDs: [],
      currentTaskIndex: -1,
      currentTaskID: -1,

      type: "",
      sender: "",
      receiver: "",
      amount: "",
      extra: "",
      status: "",

      intervalid: "",
    };
  },
  mounted() {
    this.emitter.on("metamask-connect-event", (msg) => {
      this.connected = msg;
      if (this.connected) {
        this.updateValues();

        // update history
        this.intervalid = setInterval(
          function () {
            this.updateValues();
          }.bind(this),
          3000
        );
      }
    });

    if (getAccount() !== "") {
      this.connected = true;
    }

    this.updateValues();
  },
  methods: {
    updateValues: function () {
      console.log("Update History!");
      if (this.connected) {
        getActiveTasks().then((result) => {
          this.taskIDs = result;
          if (result.length > 0) {
            if (this.currentTaskIndex >= 0) {
              this.currentTaskIndex = -1;
              for (let i = result.length - 1; i >= 0; i--) {
                if (this.currentTaskID == result[i]) {
                  this.currentTaskIndex = i;
                  break;
                }
              }
            }
            if (this.currentTaskIndex < 0) {
              this.currentTaskIndex = this.taskIDs.length - 1;
              this.currentTaskID = this.taskIDs[this.currentTaskIndex];
            }
            getTask(this.currentTaskID).then((task) => {
              this.type = getStringFromTypes(task.taskType);
              this.sender = task.sender;
              this.receiver = task.receiver;
              this.amount = task.amount;
              this.extra = task.extraField;
              this.status = getStringFromStatus(task.active);
            });
          } else {
            this.currentTaskIndex = -1;
            this.currentTaskID = -1;
          }
        });
      }
    },
    getNewerTask: function () {
      console.log("Get Newer Task!");
      if (
        !this.connected ||
        this.currentTaskIndex < 0 ||
        this.currentTaskIndex >= this.taskIDs.length - 1
      )
        return;
      this.emitter.emit("loading-event", true);
      getTask(this.taskIDs[this.currentTaskIndex + 1]).then((task) => {
        this.emitter.emit("loading-event", false);
        this.type = getStringFromTypes(task.taskType);
        this.sender = task.sender;
        this.receiver = task.receiver;
        this.amount = task.amount;
        this.extra = task.extraField;
        this.currentTaskIndex += 1;
        this.currentTaskID = this.taskIDs[this.currentTaskIndex];
      });
    },
    getOlderTask: function () {
      console.log("Get Older Task!");
      if (
        !this.connected ||
        this.currentTaskIndex < 1 ||
        this.currentTaskIndex - 1 >= this.taskIDs.length
      )
        return;
      this.emitter.emit("loading-event", true);
      getTask(this.taskIDs[this.currentTaskIndex - 1]).then((task) => {
        this.emitter.emit("loading-event", false);
        this.type = getStringFromTypes(task.taskType);
        this.sender = task.sender;
        this.receiver = task.receiver;
        this.amount = task.amount;
        this.extra = task.extraField;
        this.currentTaskIndex -= 1;
        this.currentTaskID = this.taskIDs[this.currentTaskIndex];
      });
    },
  },
};
</script>

<template>
  <div class="uk-width-1-1 routerview-card">
    <div class="uk-width-1-1 routerview-title">
      <div class="title-text"><span>Tasks</span></div>

      <div class="title-text-right"><span>- X</span></div>
    </div>
    <div class="uk-width-1-1 routerview-contents">
      <div v-if="taskIDs.length > 0">
        <span class="pixel-title block-text">[Task #{{ currentTaskID }}]</span>
        <span class="pixel-title block-text">· Type: {{ type }}</span>
        <span class="pixel-title block-text">· Sender: {{ sender }}</span>
        <span class="pixel-title block-text">· Receiver: {{ receiver }}</span>
        <span class="pixel-title block-text">· Amount: {{ amount }}</span>
        <span class="pixel-title block-text">· Extra: {{ extra }}</span>
        <!--span class="pixel-title" style="display: block">· Status: {{ status }}</span-->
        <hr />
        <div class="pixel-title" style="padding-bottom: 20px">
          <span v-if="currentTaskIndex < taskIDs.length - 1" class="pagination-left"
            ><a class="underline-links" @click="getNewerTask">&lt;&lt; NEWER</a></span
          >
          <span v-if="currentTaskIndex > 0" class="pagination-right"
            ><a class="underline-links" @click="getOlderTask">OLDER >></a></span
          >
        </div>
      </div>
      <div v-else-if="connected">
        <span class="pixel-title" style="display: block">· No Active Tasks !</span>
      </div>
      <div v-else>
        <span class="pixel-title" style="display: block">Please connect wallet !</span>
      </div>
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

.pagination-left {
  position: relative;
  float: left;
}
.pagination-right {
  position: relative;
  float: right;
}
</style>
