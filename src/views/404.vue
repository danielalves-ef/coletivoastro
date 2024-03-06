<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" lg="8">
                <v-fade-transition mode="out-in">
                    <v-alert
                        class="text-center mt-5"
                        text
                        prominent
                        color="primary"
                        border="top"
                        key="alert-login"
                    >
                        <h2 class="mb-4">Não encontrado</h2>
                        <p class="body-1 mb-2">
                            Essa pagina não foi encontrada
                        </p>

                        <div class="flex justify-center mt-4">
                            <v-btn
                                color="primary"
                                class="gradient"
                                :to="{ name: 'home' }"
                            >
                                <v-icon class="mr-2" small> mdi-home </v-icon>
                                Pagina inicial</v-btn
                            >
                        </div>
                    </v-alert>
                </v-fade-transition>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: "404",
    data() {
        return {};
    },
    computed: {},
    methods: {},
};
</script>

<style>
</style>