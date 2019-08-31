<template>
<div>
    <h1 class="text-white font-bold text-3xl flex-1 mb-2">Select your team</h1>
    <h2 class="text-white font-bold mb-8 text-lg">{{ currentTimeLeft }} seconds left</h2>
    <div class="w-full flex align-center mb-8 max-w-2xl mx-auto">
        <div v-for="(team, index) in teams" :key="index" class="flex-initial w-1/2 animate" @click="showAlert">
            <team-logo :name="team.name" :image="team.image" :home="team.home" />
        </div>
    </div>
    <p class="text-white text-lg">Old Trafford Stadium, Manchester</p>
    <p class="text-white text-sm opacity-75">31st of August 2019</p>
</div>
</template>
<script>
import TeamLogo from "../../components/TeamLogo";
export default {
    name: 'select-team',
    props: ['currentTimeLeft', 'teams'],
    components: {
        'team-logo': TeamLogo
    },
    methods: {
        showAlert() {
            this.$swal({
                type: 'question',
                text: 'Are you sure this is your team?',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                confirmButtonColor: '#5E49FD'
            }).then((result) => {
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