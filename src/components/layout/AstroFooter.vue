<template>
    <v-footer dark padless class="white--text text-center primary gradient">
        <v-card
            width="100%"
            flat
            tile
            class="white--text text-center primary gradient"
        >
            <v-card-text>
                <h2>Coletivo Astro</h2>
            </v-card-text>

            <v-card-text class="white--text pt-0">
                Um coletivo de web-apps para seu dia-a-dia. Criado e
                desenvolvido por Daniel Salgado
            </v-card-text>

            <v-divider></v-divider>

            <!-- <v-card-text class="white--text">
                {{ new Date().getFullYear() }} —
                <strong>Powered by Vuetify </strong>
            </v-card-text> -->
        </v-card>
    </v-footer>
</template>

<script>
export default {
    name: "astro-footer",
};
</script>

<style>
</style>