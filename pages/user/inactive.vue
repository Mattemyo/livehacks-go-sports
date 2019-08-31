<template>
<div>
    <h1 class="text-white text-3xl font-bold">You missed it</h1>
    <p class="text-white opacity-75 mb-6">Better luck next time</p>
</div>
</template>
<script>
export default {
    name: 'inactive',
    props: ['currentTimeLeft'],
    mounted() {
        if(this.currentTimeLeft > 0) {
            this.$router.replace({ name: 'user' })
        }
    }
}
</script>