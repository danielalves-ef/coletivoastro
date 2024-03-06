<template>
    <div>
        <v-container>
            <v-toolbar color="transparent" flat dense>
                <v-toolbar-title class="mx-auto">
                    Minhas listas
                </v-toolbar-title>
            </v-toolbar>
            <astro-divider icon="mdi-filter-variant"></astro-divider>
            <v-row v-if="listagem && listagem.length > 0">
                <v-col cols="12">
                    <astro-lista-itens
                        :itens="listagem"
                        :itemSubtitulo="subtitulo"
                        itemTitulo="nome"
                        icon="list"
                        :btnCheck="false"
                        :btnInfo="false"
                        @item:action="abrirLista"
                        @item:deletar="deletarLista"
                        @item:tap="abrirLista"
                    >
                        <template v-slot:itemTitulo="{ item }">
                            {{ item.nome }}
                            <v-icon
                                v-if="isFavorita(item)"
                                color="yellow"
                                class="pb-2"
                                small
                            >
                                mdi-star
                            </v-icon>
                        </template>
                    </astro-lista-itens>
                </v-col>
            </v-row>
            <v-row v-else class="mt-5">
                <v-col>
                    <h3 class="text-center">
                        Ainda não há listas, crie sua primeira lista
                    </h3>
                </v-col>
            </v-row>
        </v-container>
        <v-container>
            <v-row>
                <v-col class="text-center">
                    <v-btn
                        :to="{ name: 'contas-criar' }"
                        x-large
                        color="primary"
                        class="gradient"
                    >
                        Criar nova lista
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
        <v-container>
            <v-row>
                <v-col
                    v-for="(lista, index) in listagem"
                    :key="index"
                    cols="12"
                    lg="3"
                >
                    <v-card
                        max-width="300"
                        class="mx-auto"
                        color="primary gradient"
                        :style="{ cursor: 'pointer' }"
                        @click.self="abrirLista({ item: lista })"
                    >
                        <v-card-title>
                            <v-icon class="mr-2">list</v-icon>
                            {{ lista.nome }}
                        </v-card-title>
                        <v-card-text>
                            {{ subtitulo(lista) }}
                            {{ lista.descricao }}
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn> editar </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import AstroListaItens from "@/components/astrolista/AstroListaItens.vue";
import AstroDivider from "@/components/layout/AstroDivider.vue";
export default {
    name: "contas",
    components: {
        AstroListaItens,
        AstroDivider,
    },
    computed: {
        listagem() {
            return this.$store.state.appcontas.listas.listagem;
        },
        isFavorita() {
            return (item) => {
                const favoritos = this.$store.state.config.favoritos;
                return favoritos.some((favorito) => {
                    return favorito.nome === item.nome;
                });
            };
        },
    },
    methods: {
        getListas() {
            return this.$store.dispatch("appcontas/listas/getListagem");
        },
        deletarLista({ item, index }) {
            console.log("deletar");
            this.$store.dispatch("appcontas/listas/deletarLista", {
                item,
                index,
            });
        },
        subtitulo(item) {
            return Object.keys(item.usuarios)
                .map((i) => {
                    return this.$helpers.capitalize(i);
                })
                .join(" - ");
        },
        abrirLista({ item }) {
            this.$router.push({ name: "contas-id", params: { id: item.id } });
        },
    },
    mounted() {
        this.getListas().then(() => {
            if (this.$route.query.auto_open) {
                if (this.listagem.length === 1) {
                    const item = this.listagem[0];
                    this.$router.push({
                        name: "contas-id",
                        params: { id: item.id },
                    });
                }
            }
        });
        console.log(this);
    },
};
</script>

<style>
</style>