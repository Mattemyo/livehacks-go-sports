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
        <h1 class="text-white text-3xl font-bold">Good job!</h1>
        <p class="text-white opacity-75 mb-6">Did your team win?</p>
        <a href="#" class="bg-white shadow-lg rounded-lg px-6 py-3 text-purple-500 font-bold text-lg inline-block">Back to Stagecast for results</a>
        </div>
    </transition>
</div>
</template>
<script>
import TeamLogo from "../../components/TeamLogo";
import createSocket from '../../common/ws';

export default {
    name: 'shout',
    props: ['currentTimeLeft', 'teams'],
    components: {
        'team-logo': TeamLogo
    },
    data: () => ({
        interval: null,
        shoutTimer: 10,
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
    },
    methods: {
        setTimer() {
            this.shoutTimer = 10;
            this.startRecord();
            this.interval = setInterval(() => {
                this.shoutTimer--;
                if(this.shoutTimer === 0) {
                    clearInterval(this.interval);
                    this.endRecord();
                }
            }, 1000);
        },
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
        currentTimeLeft(val) {
            if(val === 0) {
                this.setTimer();
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