<template>
    <div>
        <v-chip-group :show-arrows="false">
            <v-chip
                @click="clickTag(tag)"
                v-for="tag in filteredTags"
                :key="tag.nome"
                color="primary"
            >
                {{ tag }}</v-chip
            >
        </v-chip-group>
    </div>
</template>

<script>
export default {};
</script>

<style>
</style>