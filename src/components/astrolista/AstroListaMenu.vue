<template>
    <v-menu
        bottom
        offset-y
        :close-on-click="true"
        :close-on-content-click="false"
        min-width="250"
        :value="menuAberto"
    >
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                icon
                v-bind="attrs"
                v-on="on"
                @click="menuAberto = !menuAberto"
            >
                <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
        </template>
        <v-card>
            <v-slide-x-transition mode="out-in">
                <!-- SUBMENUS -->
                <!-- SUBMENU ORDENAR ITEMS -->
                <div
                    key="submenu"
                    v-if="submenuAberto && submenuNome === 'ordenar'"
                >
                    <v-list>
                        <!-- HEADER SUBMENU ORDENAR -->
                        <v-list-item>
                            <v-list-item-action>
                                <v-btn @click="fecharSubmenu" icon>
                                    <v-icon> mdi-arrow-left </v-icon>
                                </v-btn>
                            </v-list-item-action>
                            <v-list-item-title>Ordenar por:</v-list-item-title>
                        </v-list-item>
                        <!-- ITENS SUBMENU ORDENAR -->
                        <v-list-item link @click="ordenarItens('icone')">
                            <v-list-item-icon>
                                <v-icon>mdi-emoticon-outline</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>Icone</v-list-item-title>
                        </v-list-item>
                        <v-list-item link @click="ordenarItens('conceito')">
                            <v-list-item-icon>
                                <v-icon>mdi-clipboard-list-outline</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>Nome</v-list-item-title>
                        </v-list-item>
                        <v-list-item link @click="ordenarItens('valor')">
                            <v-list-item-icon>
                                <v-icon>mdi-cash</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>Valor</v-list-item-title>
                        </v-list-item>
                        <v-list-item link @click="ordenarItens('data')">
                            <v-list-item-icon>
                                <v-icon>mdi-calendar</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>Data</v-list-item-title>
                        </v-list-item>
                        <v-list-item link @click="ordenarItens('quemPagou')">
                            <v-list-item-icon>
                                <v-icon>mdi-account</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>Quem Pagou</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </div>

                <!-- MENU  -->
                <div key="menu" v-else>
                    <v-list>
                        <v-list-item @click="abrirSubmenu('ordenar')" link>
                            <v-list-item-icon>
                                <v-icon>mdi-sort-variant</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>Ordenar itens</v-list-item-title>
                            <v-list-item-action>
                                <v-icon> mdi-chevron-right </v-icon>
                            </v-list-item-action>
                        </v-list-item>
                        <v-list-item @click="adicionarItens" link>
                            <v-list-item-icon>
                                <v-icon>mdi-plus</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title
                                >Adicionar item</v-list-item-title
                            >
                        </v-list-item>
                        <v-list-item @click="pagarTodosItens" link>
                            <v-list-item-icon v-if="pagandoTodos">
                                <v-progress-circular
                                    indeterminate
                                    color="primary"
                                ></v-progress-circular>
                            </v-list-item-icon>
                            <v-list-item-icon v-else>
                                <v-icon>mdi-check-all</v-icon>
                            </v-list-item-icon>

                            <v-list-item-title
                                >Marcar todos como pago</v-list-item-title
                            >
                        </v-list-item>

                        <v-list-item
                            v-if="!estaFavoritada"
                            @click="favoritarLista"
                            link
                        >
                            <v-list-item-icon>
                                <v-icon>mdi-star-outline</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title
                                >Favoritar lista</v-list-item-title
                            >
                        </v-list-item>
                        <v-list-item @click="desfavoritarLista" v-else link>
                            <v-list-item-icon>
                                <v-icon>mdi-star</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title
                                >Esta nos favoritos</v-list-item-title
                            >
                        </v-list-item>
                    </v-list>
                </div>
            </v-slide-x-transition>
        </v-card>
    </v-menu>
</template>

<script>
export default {
    name: "astro-lista-menu",
    data() {
        return {
            menuAberto: false,
            submenuAberto: false,
            submenuNome: null,
            pagandoTodos: false,
        };
    },
    computed: {
        estaFavoritada() {
            const favoritos = this.$store.state.config.favoritos;
            const lista = this.$store.state.appcontas.lista;
            if (!favoritos || favoritos.length < 1 || !lista || !lista.nome) {
                return false;
            }
            return favoritos.some((favorito) => {
                return favorito.nome === lista.nome;
            });
        },
    },
    methods: {
        abrirSubmenu(nome) {
            this.submenuNome = nome;
            this.submenuAberto = true;
        },
        fecharSubmenu() {
            this.submenuAberto = false;
            this.submenuNome = null;
        },
        fecharMenu() {
            this.menuAberto = false;
        },
        ordenarItens(ordem) {
            this.$store.dispatch("appcontas/setOrdem", ordem).then(() => {
                this.$store.dispatch("appcontas/ordenarItens");
            });
            // this.$emit("lista:ordenar", ordem);
            this.fecharMenu();
        },
        adicionarItens() {
            this.$emit("lista:adicionar");
            this.fecharMenu();
        },
        pagarTodosItens() {
            console.log("pagatodosositens");
            this.pagandoTodos = true;
            this.$emit("lista:pagarTodos");
            this.$store.dispatch("appcontas/pagarTodos").then(() => {
                console.log("pagatodosositens then");
                this.pagandoTodos = false;

                this.fecharMenu();
            });
        },
        favoritarLista() {
            console.log("favoritar");

            const favorito = {
                nome: this.$store.state.appcontas.lista.nome,
                path: this.$route.path,
            };
            this.$store.dispatch("config/addFavoritos", favorito);
            this.$swal({
                title: "Adicionar ao favoritos",
                text: `${favorito.nome} foi adicionado com sucesso aos favoritos `,
                icon: "success",
                showCancelButton: false,
                showConfirmButton: false,
                timer: 2000,
            });

            // this.$emit("lista:favoritar");
            // this.fecharMenu();
        },
        desfavoritarLista() {
            const favorito = {
                nome: this.$store.state.appcontas.lista.nome,
                path: this.$route.path,
            };
            console.log("desfavoritar", favorito);
            this.$store.dispatch("config/removeFavoritos", favorito);

            // this.$emit("lista:desfavoritar");
            // this.fecharMenu();
        },
    },
};
</script>

<style>
</style>