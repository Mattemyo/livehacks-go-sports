<template>
<div class="w-full">
    <div class="w-full">
    <h1 class="text-white font-bold text-3xl flex-1 mb-2 capitalize">Select your team</h1>
    <div class="w-full flex align-center mb-8 max-w-2xl mx-auto">
        <div v-for="(team, index) in teams" :key="index" class="flex-initial w-1/2 animate" @click="() => showAlert(index)">
            <team-logo :name="team.name" :image="team.image" :home="team.home" />
        </div>
    </div>
    <p class="text-white font-bold">{{ this.position }}</p>
    <p class="text-white text-sm opacity-75">31st of August 2019</p>
    </div>
</div>
</template>
<script>
import TeamLogo from "../../components/TeamLogo";
import createSocket from '../../common/ws';

export default {
    name: 'select-team',
    props: ['teams', 'position'],
    components: {
        'team-logo': TeamLogo
    },
    mounted() {
      const { href } = window.location
      localStorage.usersocket = `${href.substr(0, href.lastIndexOf('/')).replace('http', 'ws')}/0/ws`
      this.socket = createSocket(localStorage.usersocket);
    },
    methods: {
        showAlert(index) {
            this.$swal({
                title: 'Glorious Victory For ' + this.teams[index].name + '!',
                text: this.position + ' / ' + (this.teams[index].home ? 'Home team' : 'Away team'),
                imageUrl: this.teams[index].image,
                imageWidth: 160,
                imageHeight: 160,
                showCancelButton: true,
                confirmButtonText: 'YAAAASSSSSS!!!',
                cancelButtonText: 'Nooooo',
                confirmButtonColor: '#5E49FD',
                customClass: {
                    image: 'rounded-full shadow-lg img-cover'
                },
            }).then((result) => {
                if(result.dismiss === 'cancel') return;
                const userId = (1e16 * Math.random()).toString(32);
                const { id: teamId } = this.teams[index];
                localStorage.userId = userId;
                localStorage.teamId = teamId;
                this.socket.send({ type: 'team_select', userId, teamId });
                if(result.value) {
                    this.$router.push('/user/shout');
                }
            });
        }
    }
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