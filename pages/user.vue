<template>
    <div class="">
        <nuxt-child :currentTimeLeft="currentTimeLeft" :teams="teams" class="fixed-center" />
    </div>
</template>
<script>
import TeamLogo from "../components/TeamLogo";
export default {
    data: () => ({
        teams: [
            {
                name: 'Manchester United FC',
                hometown: 'Manchester, England',
                image: 'https://via.placeholder.com/150',
                home: true
            },
            {
                name: 'Liverpool FC',
                hometown: 'Liverpool, England',
                image: 'https://via.placeholder.com/150',
                home: false
            }
        ],
        interval: null,
        currentTimeLeft: 10,
        voiceAccess: null
    }),
    watch: {
        voiceAccess(val) {
            if(val === "not-granted") {
                clearInterval(this.interval);
                this.$router.replace({ name: 'user-no-mic' });
            }
        }
    },
    mounted() {

        if(this.voiceAccess === null ){
            this.voiceAccess = 'prompt';
        }

        navigator.getUserMedia({ audio: true }, (e) => {
            this.voiceAccess = "granted";
        }, (err) => {
            this.voiceAccess = 'not-granted';
        });

        this.interval = setInterval(() => {
            this.currentTimeLeft--;
            if(this.currentTimeLeft === 0) {
                clearInterval(this.interval);
                if(this.voiceAccess !== 'granted') {
                    this.$router.replace({ name: 'user-no-mic' });
                    return;
                }
                if(this.$route.name === 'user') {
                    this.$router.replace({ name: 'user-inactive' });
                    this.$swal.close();
                    return;
                }
            }
        }, 1000);
    },
}
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
    background-image: linear-gradient(to right, config('colors.purple-600'), config('colors.purple-900'));
  }
</style>