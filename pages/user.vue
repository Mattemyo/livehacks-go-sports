<template>
  <div class>
    <nuxt-child
      :currentTimeLeft="currentTimeLeft"
      :teams="teams"
      :position="position"
      class="fixed-center"
      @selected="select"
      :selected="selectedTeam"
    />
  </div>
</template>
<script>
import TeamLogo from "../components/TeamLogo";
export default {
  data: () => ({
    teams: [
      {
        name: "Vincent",
        hometown: "Gothenburg",
        image: "https://media3.giphy.com/media/ji5kAayhJvL8s/source.gif",
        home: true,
        id: "manchesteru"
      },
      {
        name: "Chris",
        hometown: "Seoul",
        image: "https://media2.giphy.com/media/IECSvThmhZN4s/giphy.gif",
        home: false,
        id: "liverpool"
      }
    ],
    position: "Stagecast Stadium Stockholm",
    interval: null,
    currentTimeLeft: 10,
    voiceAccess: null,
    selectedTeam: null
  }),
  watch: {
    voiceAccess(val) {
      if (val === "not-granted") {
        clearInterval(this.interval);
        this.$router.replace({ name: "user-no-mic" });
      }
    }
  },
  methods: {
    select(index) {
      this.selectedTeam = index;
    }
  },
  mounted() {
    const constraints = { audio: true };

    try {
      navigator.getUserMedia(
        constraints,
        e => {
          this.voiceAccess = "granted";
        },
        err => {
          this.voiceAccess = "not-granted";
        }
      );
    } catch (err) {
      navigator.mediaDevices.getUserMedia(
        constraints,
        e => {
          this.voiceAccess = "granted";
        },
        err => {
          this.voiceAccess = "not-granted";
        }
      );
    }

    if (this.voiceAccess === null) {
      this.voiceAccess = "prompt";
    }

    // FIXME: LATER
    // if(this.voiceAccess !== 'granted') {
    //       this.$router.replace({ name: 'user-no-mic' });
    //       return;
    //   }

    // if(this.$route.name === 'user') {
    //     this.$router.replace({ name: 'user-inactive' });
    //     this.$swal.close();
    //     return;
    // }
  }
};
</script>
<style>
.square {
  width: 100%;
  padding-top: 100%; /* 1:1 Aspect Ratio */
  position: relative; /* If you want text inside of it */
}
.animate {
  transition: all 0.3s ease;
}
.animate:hover {
  transform: scale(1.1) translateY(-2px);
}
.bg-gradient {
  background-image: linear-gradient(
    to right,
    config("colors.purple-600"),
    config("colors.purple-900")
  );
}
</style>