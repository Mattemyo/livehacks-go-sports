<template>
  <div>
    <div>winner is {{ winner.name }}</div>
    <img :src="winner.image" />
  </div>
</template>
<script>
import { confetti } from "dom-confetti";
import createSocket from "../../common/ws";

export default {
  name: "admin-results",
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
    winner: {}
  }),
  mounted() {
    this.winner = this.teams.find(t => t.id === localStorage.winner);
  }
};
</script>