<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h1>Compras</h1>
                <v-list>
                    <v-subheader>
                        <v-icon>mdi-account</v-icon> Listas:
                    </v-subheader>
                    <v-list-item
                        dark
                        class="primary gradient ma-2 rounded-lg"
                        v-for="lista in listagem"
                        :key="lista.id"
                        @click="abrirLista(lista.id)"
                    >
                        <v-list-item-avatar>
                            <v-avatar color="primary">
                                <v-icon> mdi-store </v-icon>
                            </v-avatar>
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-title>
                                {{ lista.nome }}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    computed: {
        listagem() {
            return this.$store.state.appcompras.listagem;
        },
    },
    methods: {
        getListagem() {
            this.$store.dispatch("appcompras/getListagem");
        },
        abrirLista(id) {
            this.$router.push({ name: "compras-id", params: { id } });
        },
    },
    mounted() {
        this.getListagem();
    },
};
</script>

<style>
</style>