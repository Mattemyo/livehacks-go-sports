<template>
  <div>
    <div v-if="currentTimeLeft > 0">
      <p>
        Countdown:
        {{ currentTimeLeft }}
      </p>
    </div>
    <div v-else-if="shoutTimer > 0">
      <p>
        Time left for shouting:
        {{ shoutTimer }}
      </p>
    </div>
    <div ref="logo" v-else>logo here!!!</div>
  </div>
</template>
<script>
import { confetti } from "dom-confetti";
import createSocket from "../../common/ws";

export default {
  name: "shout",
  data: () => ({
    interval: null,
    currentTimeLeft: 10,
    shoutTimer: 30,
    competitionData: {}
  }),
  computed: {},
  mounted() {
    this.socket = createSocket(localStorage.adminsocket);
    setTimeout(() => {
      // listen for msg
      this.socket.setMsgReceiver(msg => {
        if (msg.type === "scream") {
          this.competitionData = msg.teams;
        }
      });

      //start countdown
      this.interval = setInterval(() => {
        this.currentTimeLeft--;
        this.socket.send({
          type: "countdown",
          countdown: this.currentTimeLeft,
          stage: "ready"
        });

        if (this.currentTimeLeft === 0) {
          clearInterval(this.interval);
          this.interval = setInterval(() => {
            this.shoutTimer--;
            this.socket.send({
              type: "countdown",
              countdown: this.shoutTimer,
              stage: "ongoing"
            });

            if (this.shoutTimer === 0) {
              clearInterval(this.interval);

              const { liverpool, manchesteru } = this.competitionData;
              const winner =
                liverpool.score > manchesteru.score
                  ? "liverpool"
                  : "manchesteru";

              this.socket.send({ type: "finish", winner });
              this.socket.disconnect();

              localStorage.winner = winner;
              this.$router.push("/admin/results");
            }
          }, 1000);
        }
      }, 1000);
    }, 2000);
  },
  methods: {},
  watch: {
    shoutTimer(val) {
      if (val === 0) {
        this.$nextTick(() => {
          confetti(this.$refs.logo, {
            angle: "0",
            spread: "360",
            startVelocity: "20",
            elementCount: "150",
            dragFriction: 0.1,
            duration: 3000,
            stagger: 0,
            width: "10px",
            height: "10px",
            colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
          });
        });
      }
    }
  }
};
</script>
<style>
.ease {
  transition: transform 0.1s linear;
}
</style>