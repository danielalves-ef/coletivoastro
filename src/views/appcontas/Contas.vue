<template>
    <div>
        <v-toolbar dense dark class="primary gradient">
            <v-btn class="ml-0" icon :to="{ name: 'home' }" exact>
                <v-icon>mdi-arrow-up</v-icon>
            </v-btn>
            <v-spacer></v-spacer>

            <v-toolbar-title class="pl-0"> App Contas </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn :to="{ name: 'contas-criar' }" class="mr-0" icon>
                <v-icon>mdi-plus-box-outline</v-icon>
            </v-btn>
        </v-toolbar>
        <v-container>
            <v-toolbar color="transparent" flat dense>
                <v-toolbar-title class="mx-auto">
                    Minhas listas
                </v-toolbar-title>
            </v-toolbar>
            <astro-divider
                class="mb-3"
                icon="mdi-filter-variant"
            ></astro-divider>

            <template v-if="loaded">
                <v-row v-if="listagem && listagem.length > 0">
                    <v-col cols="12" v-for="lista in listagem" :key="lista.id">
                        <v-card class="mx-auto" outlined max-width="400">
                            <v-list-item
                                three-line
                                link
                                :to="{
                                    name: 'contas-id',
                                    params: { id: lista.id },
                                }"
                            >
                                <v-list-item-content>
                                    <v-list-item-title class="text-h6 mb-0">
                                        {{ lista.nome }}
                                    </v-list-item-title>
                                    <v-list-item-subtitle>{{
                                        lista.descricao
                                    }}</v-list-item-subtitle>
                                    <v-list-item-subtitle>
                                        <v-chip
                                            v-for="usuario in lista.usuarios"
                                            :key="usuario.slug"
                                            color="primary"
                                            label
                                            x-small
                                            class="mr-1"
                                            >{{ usuario.slug }}</v-chip
                                        >
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-avatar
                                    tile
                                    size="80"
                                    color="primary"
                                >
                                    <v-img
                                        v-if="lista.fotoURL"
                                        :src="lista.fotoURL"
                                    ></v-img>
                                    <v-icon v-else color="white" size="50"
                                        >$appcontas</v-icon
                                    >
                                </v-list-item-avatar>
                            </v-list-item>
                        </v-card>
                    </v-col>
                    <v-col cols="12" v-if="false">
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
            </template>

            <template v-else>
                <v-row>
                    <v-col cols="12" class="text-center">
                        <v-progress-circular
                            size="50"
                            color="primary"
                            indeterminate
                        ></v-progress-circular>
                    </v-col>
                </v-row>
            </template>

            <v-row>
                <v-col class="text-center">
                    <v-btn
                        :to="{ name: 'contas-criar' }"
                        x-large
                        color="primary"
                    >
                        Criar nova lista
                    </v-btn>
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
        loaded() {
            return this.$store.state.appcontas.listas.loaded;
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
            // if (this.$route.query.auto_open) {
            //     if (this.listagem.length === 1) {
            //         const item = this.listagem[0];
            //         this.$router.push({
            //             name: "contas-id",
            //             params: { id: item.id },
            //         });
            //     }
            // }
        });
    },
};
</script>

<style>
</style>