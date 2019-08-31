<template>
<div>
    <h1 class="text-white text-3xl font-bold">No microphone access</h1>
    <p class="text-white opacity-75 mb-6">Please give access and try again</p>
</div>
</template>
<script>
export default {
    name: 'inactive',
    props: ['currentTimeLeft'],
    mounted() {
    }
}
</script>