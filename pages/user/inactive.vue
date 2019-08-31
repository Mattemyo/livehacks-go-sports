<template>
<div>
    <h1 class="text-white text-3xl font-bold">You missed it</h1>
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