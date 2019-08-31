<template>
<div>
    <div v-if="currentTimeLeft > 0">
    <h1 class="text-white text-3xl font-bold">{{ currentTimeLeft }} seconds left</h1>
    <p class="text-white opacity-75">Get ready to shout for your team!</p>
    </div>
    <div v-else-if="shoutTimer > 0">
    <h1 class="text-white text-3xl font-bold">SHOUT!!!</h1>
    <p class="text-white opacity-75">{{ shoutTimer }} seconds left to shout</p>
    </div>
    <div v-else>
    <h1 class="text-white text-3xl font-bold">Shouting is done</h1>
    <a href="#" class="">Back to Screencast for results</a>
    </div>
</div>
</template>
<script>
import createSocket from '../../common/ws';

export default {
    name: 'shout',
    props: ['currentTimeLeft'],
    data: () => ({
        interval: null,
        shoutTimer: 10,
        streamer: null
    }),
    mounted() {
        const socket = createSocket(`ws://localhost:3000/0/ws?userId=${localStorage.userId}`);

        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(function(stream) {
        let audioContext = new AudioContext();
        let analyser = audioContext.createAnalyser();
        let microphone = audioContext.createMediaStreamSource(stream);
        let javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;

        microphone.connect(analyser);
        analyser.connect(javascriptNode);
        javascriptNode.connect(audioContext.destination);
        javascriptNode.onaudioprocess = function() {
            var array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            var values = 0;

            var length = array.length;
            for (var i = 0; i < length; i++) {
                values += (array[i]);
            }

            var average = values / length;

            socket.send({ type: 'scream', volume: Math.round(average) });
        }
        })
        .catch(function(err) {
            console.log(err);
        });
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
            // this.streamer.start();
        },
        endRecord() {
            // this.streamer.stop();
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