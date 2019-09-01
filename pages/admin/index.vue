<template>
  <div>
    <div @click="startGame()">hello, start game</div>
  </div>
</template>
<script>
import createSocket from "../../common/ws";

export default {
  name: "start-game",
  // props: ['teams'],
  // components: {
  //     'team-logo': TeamLogo
  // },
  mounted() {
    const { href } = window.location
    localStorage.websocketUrl = `${href.substr(0, href.lastIndexOf('/')).replace('http', 'ws')}/0/ws?isAdmin=true`
    this.socket = createSocket(localStorage.websocketUrl);
  },
  methods: {
    startGame() {
      this.socket.send({ type: "start" });
      this.$router.push("/admin/shout");
    }
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