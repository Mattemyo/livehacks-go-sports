<template>
  <div class="w-full">
    <transition name="bounce">
      <div v-if="currentTimeLeft > 0" key="1" class="fixed-center">
        <h1 class="text-white text-3xl font-bold">{{ currentTimeLeft }} seconds left</h1>
        <p class="text-white opacity-75">Get ready to shout for your team!</p>
      </div>
      <div v-else-if="shoutTimer > 0" key="2" class="fixed-center">
        <div class="w-32 max-w-full mx-auto">
          <team-logo :image="teams[0].image" :style="size" class="ease"></team-logo>
        </div>
        <h1 class="text-white text-3xl font-bold">SHOUT!!!</h1>
        <p class="text-white opacity-75 mb-8">{{ shoutTimer }} seconds left to shout</p>
        <div class="relative">
          <div class="relative">
            <div class="w-64 h-6 rounded-lg shadow-lg bg-white overflow-hidden relative">
              <div :style="{ width: homeTeamPercentage + '%' }" class="left-team">
                <div class="bg-fireopal h-full rounded-l-lg w-full"></div>
              </div>
              <div :style="{ width: 100 - homeTeamPercentage + '%' }" class="right-team">
                <div class="bg-emerald h-full rounded-r-lg ml-auto mr-0 w-full"></div>
              </div>
            </div>
            <!-- <div class="bg-white shadow-lg w-8 h-8 border border-purple-400 rounded-full text-xs font-bold text-center flex items-center justify-center absolute" style="left: 50%; top: 50%; transform: translate(-50%, -50%);"><span>VS</span></div> -->
          </div>
          <div class="w-full flex mt-4">
            <div class="w-1/2 text-left">
              <div class="pr-2">
                <h3 class="text-white text-sm">{{ teams[0].name }}</h3>
              </div>
            </div>
            <div class="w-1/2 text-right">
              <div class="pl-2">
                <h3 class="text-white text-sm">{{ teams[1].name }}</h3>
              </div>
            </div>
          </div>
          <div class="w-full flex">
            <div class="w-1/2 text-left">
              <div class="pr-2">
                <p class="text-xs text-white opacity-75">300 shouters</p>
              </div>
            </div>
            <div class="w-1/2 text-right">
              <div class="pl-2">
                <p class="text-xs text-white opacity-75">300 shouters</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else key="3" class="fixed-center" ref="logo">
        <div class="w-64 max-w-full mx-auto">
          <team-logo :image="teams[0].image"></team-logo>
        </div>
        <h1 class="text-white text-3xl font-bold -mt-6">Winner!</h1>
        <p class="text-white opacity-75 mb-6">Good job!</p>
        <a
          href="stagecast://app.com/"
          class="bg-white shadow-lg rounded-lg px-6 py-3 text-purple-500 font-bold text-lg inline-block"
        >Back to Stagecast</a>
      </div>
    </transition>
  </div>
</template>
<script>
import { confetti } from "dom-confetti";
import TeamLogo from "../../components/TeamLogo";
import createSocket from "../../common/ws";

export default {
  name: "shout",
  props: ["teams"],
  components: {
    "team-logo": TeamLogo
  },
  data: () => ({
    interval: null,
    currentTimeLeft: 10,
    shoutTimer: 30,
    socket: null,
    currentVolume: 0,
    audioContext: null,
    isWinner: false,
    homeTeamPercentage: 50
  }),
  computed: {
    size() {
      return this.shoutTimer > 0
        ? "transform: scale(" +
            Number(1 + (this.currentVolume / 100) * 1.5) +
            ")"
        : "";
    }
  },
  mounted() {
    this.socket = createSocket(
      `${localStorage.websocketUrl}?userId=${localStorage.userId}`
    );
    setTimeout(
      () =>
        this.socket.setMsgReceiver(msg => {
          if (msg.type === "countdown") {
            if (msg.stage === "ready") {
              this.currentTimeLeft = msg.countdown;
              if (this.currentTimeLeft === 0) this.startRecord();
            } else {
              this.shoutTimer = msg.countdown;
            }
          }

          if (msg.type === "scream") {
            const { manchesteru, liverpool } = msg.teams;
            const diff = manchesteru.score - liverpool.score;
            this.homeTeamPercentage =
              diff === 0 ? 0 : (100 * manchesteru.score) / diff; //TODO: ADD MULTIPLIER
            console.log(`percentage=${this.homeTeamPercentage}%`);
          }

          if (msg.type === "finish") {
            console.error("yes");
            this.socket.disconnect();
          }
        }),
      2000
    );
  },
  methods: {
    recordStuff(stream) {
      this.audioContext = new AudioContext();
      let analyser = this.audioContext.createAnalyser();
      let microphone = this.audioContext.createMediaStreamSource(stream);
      let javascriptNode = this.audioContext.createScriptProcessor(2048, 1, 1);

      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 1024;

      microphone.connect(analyser);

      analyser.connect(javascriptNode);
      javascriptNode.connect(this.audioContext.destination);
      javascriptNode.onaudioprocess = () => {
        var array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        var values = 0;

        var length = array.length;
        for (var i = 0; i < length; i++) {
          values += array[i];
        }

        var average = values / length;

        this.currentVolume = average;

        if(this.shoutTimer > 0) {
          this.socket.send({ type: "scream", volume: Math.round(average) });
        }
      };
    },
    startRecord() {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(this.recordStuff)
        .catch(console.error);
    },
    endRecord() {
      if (this.audioContext) {
        this.audioContext.close();
      }
    }
  },
  watch: {
    shoutTimer(val) {
      if (val === 0) {
        this.endRecord();
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
    },
    isWinner(bool) {
      if (bool) {
        this.$nextTick(() => {
          confetti(this.$refs.logo, {
            angle: "90",
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
.left-team {
  position: absolute;
  left: 2px;
  right: 50%;
  top: 2px;
  bottom: 2px;
}
.right-team {
  position: absolute;
  right: 2px;
  left: 50%;
  top: 2px;
  bottom: 2px;
}
</style>