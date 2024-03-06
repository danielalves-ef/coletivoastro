<template>
    <v-container>
        <div class="div"></div>
        <v-row>
            <v-col cols="12">
                <astro-item> </astro-item>
                <astro-item> </astro-item>
                <astro-item></astro-item>
                <astro-item></astro-item>
                <astro-item></astro-item>
            </v-col>
        </v-row>
        <div class="div"></div>
    </v-container>
</template>

<script>
import AstroItem from "../components/AstroItem.vue";
export default {
    components: { AstroItem },
};
</script>

<style>
.div {
    height: 600px;
}
</style>