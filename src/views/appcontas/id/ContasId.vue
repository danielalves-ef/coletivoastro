<template>
    <div>
        <v-toolbar dark class="primary gradient" dense>
            <v-btn class="ml-0" icon :to="{ name: 'contas' }" exact>
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-spacer></v-spacer>

            <v-toolbar-title class="pl-0">
                {{ lista ? lista.nome : "contas" }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn
                v-if="listaFavoritada"
                @click="favoritarLista"
                class="mr-0"
                icon
            >
                <v-icon color="warning">mdi-star</v-icon>
            </v-btn>
            <v-btn v-else @click="favoritarLista" class="mr-0" icon>
                <v-icon>mdi-star-outline</v-icon>
            </v-btn>
        </v-toolbar>

        <template v-if="lista">
            <v-container>
                <v-row>
                    <v-col cols="12">
                        <v-scroll-x-transition mode="out-in">
                            <router-view
                                :key="$route.fullPath"
                                :lista="lista"
                            ></router-view>
                        </v-scroll-x-transition>
                    </v-col>
                </v-row>
            </v-container>
        </template>
        <!-- <template v-else>
            <template v-if="!loaded && !lista">
                <v-progress-circular
                    indeterminate
                    color="white"
                    class="mr-2"
                ></v-progress-circular>
                {{ error.default }}
            </template>
            <template v-else-if="loaded && !lista">
                {{ error.default }}
            </template>
            <template v-else>
                {{ lista ? lista.nome : "contas" }}
            </template>
        </template> -->
        <!-- <router-view></router-view> -->
        <v-bottom-navigation
            height="75"
            app
            dark
            grow
            background-color="primary gradient"
            active-class="primary--text text--lighten-2"
            class="pb-4"
        >
            <v-btn
                exact
                :to="{
                    name: 'contas-lista',
                    query: $route.query,
                    params: $route.params,
                }"
                value="contas-lista"
                height="100%"
                class="rounded-lg"
            >
                <span>Itens</span>
                <v-icon>mdi-format-list-text</v-icon>
            </v-btn>

            <v-btn
                exact
                :to="{
                    name: 'contas-detalhes',
                    query: $route.query,
                    params: $route.params,
                }"
                value="contas-detalhes"
                height="100%"
                class="rounded-lg"
            >
                <span>Detalhes</span>
                <v-icon>mdi-application-cog-outline</v-icon>
            </v-btn>
            <v-btn
                exact
                :to="{
                    name: 'contas-add',
                    query: $route.query,
                    params: $route.params,
                }"
                value="contas-add"
                class="pb-1 center-btn primary darken-1 elevation-10"
            >
                <span>Add</span>
                <v-icon>mdi-plus</v-icon>
            </v-btn>

            <v-btn
                exact
                :to="{
                    name: 'contas-balanco',
                    query: $route.query,
                    params: $route.params,
                }"
                value="contas-balanco"
                height="100%"
                class="rounded-lg"
            >
                <span>Balanço</span>
                <v-icon>mdi-account-cash</v-icon>
            </v-btn>
            <v-btn
                exact
                :to="{
                    name: 'contas-pagar',
                    query: $route.query,
                    params: $route.params,
                }"
                value="contas-pagar"
                height="100%"
                class="rounded-lg"
            >
                <span>Pagar</span>
                <v-icon>mdi-credit-card-check-outline</v-icon>
            </v-btn>
        </v-bottom-navigation>
    </div>
</template>

<script>
// import AstroAddConta from "@/components/astrolista/AstroAddConta.vue";
// import ContasAdd from "./ContasAdd2.vue";
// import ContasBalanco from "./ContasBalanco2.vue";
// import ContasDetalhes from "./ContasDetalhes.vue";
// import ContasLista from "./ContasLista.vue";
// import ContasPagar from "./ContasPagar.vue";
export default {
    components: {
        // ContasDetalhes,
        // ContasPagar,
        // ContasLista,
        // ContasBalanco,
        // ContasAdd,
        // AstroAddConta,
    },
    data() {
        return {
            tab: "itens",
            bottomNav: 1,
            error: {
                default: "Buscando...",
            },
        };
    },
    computed: {
        itensLoaded() {
            return this.$store.state.appcontas.lista.loadedItens;
        },
        loaded() {
            return this.$store.state.appcontas.lista.loaded;
        },
        lista() {
            return this.$store.state.appcontas.lista.lista;
        },
        listaFavoritada() {
            if (!this.lista) {
                return false;
            }
            const favorito = this.$store.state.usuario.favoritos.favoritos.find(
                (fav) => {
                    return fav.itemId === this.lista.id;
                }
            );
            return favorito ? true : false;
        },
        id() {
            return this.$route.params.id;
        },
        mes() {
            return this.$route.query.mes !== undefined &&
                this.$route.query.mes !== null &&
                this.$route.query.mes !== ""
                ? +this.$route.query.mes
                : new Date().getMonth();
        },
        ano() {
            return this.$route.query.ano !== undefined &&
                this.$route.query.ano !== null &&
                this.$route.query.ano !== ""
                ? +this.$route.query.ano
                : new Date().getFullYear();
        },
    },
    watch: {
        mes() {
            this.$store.dispatch("appcontas/lista/getItens", {
                mes: this.mes,
                ano: this.ano,
            });
        },
    },
    methods: {
        init() {
            console.log("init", this.mes);
            this.$store
                .dispatch("appcontas/lista/getLista", {
                    id: this.id,
                    mes: this.mes,
                    ano: this.ano,
                })
                .then((e) => {
                    if (e.result) {
                        console.log({ e });
                    } else {
                        console.log("handle error", e);
                        this.error.default = e.msg;
                        console.log(this.error);
                    }
                })
                .catch((e) => {
                    const text =
                        e.error === "auth"
                            ? "Você não tem autorização para acessar essa pagina"
                            : e.error === "user"
                            ? "Você precisar estar logado"
                            : e.error === "doc"
                            ? "Esse documento não existe"
                            : e.msg;

                    this.$swal({
                        title: e.msg,
                        text: text,
                        icon: "error",
                        showConfirmButton: true,
                        confirmButtonText: "Pagina Inicial",
                    }).then(() => {
                        this.$router.push({ name: "home" });
                    });
                });
        },
        favoritarLista() {
            if (this.listaFavoritada) {
                this.removeListaFavoritos();
            } else {
                this.addListaFavoritos();
            }
        },
        removeListaFavoritos() {
            const favorito = this.$store.state.usuario.favoritos.favoritos.find(
                (fav) => {
                    return fav.itemId === this.lista.id;
                }
            );
            if (favorito) {
                this.$store
                    .dispatch("usuario/deleteFavorito", favorito.id)
                    .then(() => {
                        this.$swal({
                            title: "Removido",
                            text: `${favorito.titulo} foi removido dos favoritos `,
                            icon: "success",
                            showCancelButton: false,
                            showConfirmButton: false,
                            timer: 2000,
                        });
                    })
                    .catch((e) => {
                        this.$swal({
                            title: "Algo deu errado",
                            text: e,
                            icon: "error",
                            showCancelButton: false,
                            showConfirmButton: false,
                            timer: 2000,
                        });
                    });
            }
        },
        addListaFavoritos() {
            const favorito = {
                route: {
                    name: "contas-id",
                    params: { id: this.lista.id },
                },
                itemId: this.lista.id,
                titulo: this.lista.nome,
                app: "contas",
            };
            this.$store
                .dispatch("usuario/addFavorito", favorito)
                .then(() => {
                    this.$swal({
                        title: "Adicionado",
                        text: `${favorito.titulo} foi adicionado com sucesso aos favoritos `,
                        icon: "success",
                        showCancelButton: false,
                        showConfirmButton: false,
                        timer: 2000,
                    });
                })
                .catch((e) => {
                    this.$swal({
                        title: "Algo deu errado",
                        text: e,
                        icon: "error",
                        showCancelButton: false,
                        showConfirmButton: false,
                        timer: 2000,
                    });
                });
        },
    },
    created() {
        console.log("Contas 2 created get Lista e itens");
        this.init();
    },
    destroyed() {
        console.log("destruir");
        this.$store.dispatch("appcontas/lista/destruirLista");
    },
};
</script>

<style>
.center-btn {
    height: 70px !important;
    width: 70px !important;
    margin-top: -10px;
    border-radius: 20px !important;
}

.center-btn2 {
    height: 60px !important;
    width: 60px !important;
    margin-top: -10px;

    border-radius: 20px !important;
}
</style>