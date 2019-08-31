<template>
<div>
    <h1 class="text-white text-3xl font-bold capitalize">Waiting for the next round</h1>
    <p class="text-white opacity-75 mb-6">Stay tuned</p>
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