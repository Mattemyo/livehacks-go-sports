<template>
<div class="w-full">
    <transition name="bounce">
        <div v-if="currentTimeLeft > 0" key=1 class="fixed-center">
        <h1 class="text-white text-3xl font-bold">{{ currentTimeLeft }} seconds left</h1>
        <p class="text-white opacity-75">Get ready to shout for your team!</p>
        </div>
        <div v-else-if="shoutTimer > 0" key=2 class="fixed-center">
            <div class="w-32 max-w-full mx-auto">
                <team-logo :image="teams[0].image" :style="size" class="ease"></team-logo>
            </div>
            <h1 class="text-white text-3xl font-bold">SHOUT!!!</h1>
            <p class="text-white opacity-75">{{ shoutTimer }} seconds left to shout</p>
        </div>
        <div v-else key=3 class="fixed-center">
            <div class="w-32 max-w-full mx-auto">
                <team-logo ref="logo" :image="teams[0].image" :style="size" class="ease"></team-logo>
            </div>
        <h1 class="text-white text-3xl font-bold">Winner!</h1>
        <p class="text-white opacity-75 mb-6">Good job!</p>
        <a href="#" class="bg-white shadow-lg rounded-lg px-6 py-3 text-purple-500 font-bold text-lg inline-block">Back to Stagecast for results</a>
        </div>
    </transition>
</div>
</template>
<script>
import { confetti } from 'dom-confetti';
import TeamLogo from "../../components/TeamLogo";
import createSocket from '../../common/ws';

export default {
    name: 'shout',
    props: ['teams'],
    components: {
        'team-logo': TeamLogo
    },
    data: () => ({
        interval: null,
        currentTimeLeft: null,
        shoutTimer: null,
        streamer: null,
        currentVolume: 0,
        audioContext: null
    }),
    computed: {
        size() {
            return 'transform: scale(' + Number(1 + ((this.currentVolume / 100) * 1.5)) + ')';
        }
    },
    mounted() {
       this.socket = createSocket(`ws://localhost:3000/0/ws?userId=${localStorage.userId}`);
       setTimeout(() => this.socket.setMsgReceiver((msg) => { 
         if (msg.stage === 'ready') {
           this.currentTimeLeft = msg.countdown
         } else {
           this.shoutTimer = msg.countdown 
         }
      }), 2000);
    },
    methods: {
        startRecord() {
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then((stream) => {
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
                    values += (array[i]);
                }

                var average = values / length;

                this.currentVolume = average;

                this.socket.send({ type: 'scream', volume: Math.round(average) });
            }
        })
        .catch((err) => {
            console.log(err);
        });
        },
        endRecord() {
            if(this.audioContext) {
                this.audioContext.close();
            }
        }
    },
    watch: {
        shoutTimer(val) {
            if(val === 0) {
                this.endRecord();
                this.$nextTick(() => {
                  confetti(this.$refs.logo.$el, {
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
}
</script>
<style>
.ease {
    transition: transform 0.1s linear;
}
</style>