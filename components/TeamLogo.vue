<template>
    <div class="p-6">
        <div class="w-64 mx-auto square mb-4">
            <div class="absolute inset-0">
                <img :src="image" class="w-full h-full border-4 border-purple-200 rounded-full shadow-xl bg-purple-400">
            </div>
        </div>
        <h2 v-if="name" v-text="name" class="text-white text-lg font-bold" />
        <p v-if="home !== undefined" v-text="home ? 'Home' : 'Away'" class="text-white opacity-75" />
    </div>
</template>
<script>
export default {
    props: [
        'image', 'name', 'home'
    ]
}
</script>