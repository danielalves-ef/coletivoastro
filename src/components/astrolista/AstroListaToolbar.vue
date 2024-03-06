<template>
    <v-toolbar dark color="green gradient">
        <v-container>
            <v-row align="center">
                <v-col cols="12" class="d-flex align-center">
                    <v-btn exact :to="{ name: 'contas' }" icon>
                        <v-icon>mdi-arrow-left</v-icon>
                    </v-btn>

                    <v-toolbar-title class="pl-2">
                        <slot>
                            <!-- <v-progress-circular
                    v-if="titulo === null"
                    indeterminate
                    color="white"
                ></v-progress-circular>
                <template v-else>
                    {{ titulo }}
                </template> -->
                        </slot>
                    </v-toolbar-title>

                    <v-spacer></v-spacer>

                    <template v-if="!$isMobile">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                    @click="adicionarItens"
                                    icon
                                    v-bind="attrs"
                                    v-on="on"
                                >
                                    <v-icon>mdi-playlist-plus</v-icon>
                                </v-btn>
                            </template>
                            <span>Adicionar item</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <div v-bind="attrs" v-on="on">
                                    <astro-lista-menu
                                        @lista:adicionar="adicionarItens"
                                        @lista:pagarTodos="pagarTodosItens"
                                        @lista:favoritar="favoritarLista"
                                    ></astro-lista-menu>
                                </div>
                            </template>
                            <span>Mais opções</span>
                        </v-tooltip>
                    </template>
                    <template v-else>
                        <v-btn icon @click="adicionarItens">
                            <v-icon>mdi-playlist-plus</v-icon>
                        </v-btn>

                        <astro-lista-menu
                            @lista:adicionar="adicionarItens"
                            @lista:pagarTodos="pagarTodosItens"
                            @lista:favoritar="favoritarLista"
                        ></astro-lista-menu>
                    </template>
                </v-col>
            </v-row>
        </v-container>
    </v-toolbar>
</template>

<script>
import AstroListaMenu from "@/components/astrolista/AstroListaMenu.vue";
export default {
    name: "astro-lista-toolbar",
    components: { AstroListaMenu },
    props: {
        titulo: {
            type: String,
            default: null,
        },
    },
    methods: {
        adicionarItens() {
            this.$emit("lista:adicionar");
        },
        pagarTodosItens() {
            // dispatch evento para pagar todos os itens STORE

            this.$emit("lista:pagarTodos");
        },
        favoritarLista() {
            // dispatch evento para salvar lista nos favoritos STORE
            this.$emit("lista:favoritar");
        },
    },
};
</script>

<style>
</style>