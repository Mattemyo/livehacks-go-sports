<template>
  <div>winner is {{}}</div>
</template>
<script>
import { confetti } from "dom-confetti";
import createSocket from "../../common/ws";

export default {
  name: "shout"
};
</script>