<template>
    <div class="p-6">
        <p v-if="home !== undefined" v-text="home ? 'Home team' : 'Away team'" class="text-white opacity-75 mb-4 text-sm" />
        <div class="w-64 mx-auto square mb-4">
            <div class="absolute inset-0 text-center">
                <img :src="image" class="h-full w-full border-4 border-purple-200 rounded-full shadow-xl bg-purple-400 img-cover">
            </div>
        </div>
        <h2 v-if="name" v-text="name" class="text-white text-lg font-bold" />
    </div>
</template>
<script>
export default {
    props: [
        'image', 'name', 'home'
    ]
}
</script>