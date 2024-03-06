<template>
    <div>
        <astro-lista-toolbar
            @lista:adicionar="abrirAddConta"
            @lista:favoritar="favoritarLista"
        >
            <template>
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
                    {{ lista.nome || "lista sem nome" }}
                </template>
            </template>
        </astro-lista-toolbar>

        <v-container>
            <v-row>
                <v-col cols="12"> </v-col>
            </v-row>
        </v-container>

        <div v-if="lista">
            <v-container>
                <!-- TOOLBAR MESES -->
                <v-toolbar color="transparent" dense flat>
                    <v-btn @click="mesAnterior" icon>
                        <v-icon>mdi-chevron-left</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>

                    <v-toolbar-title
                        ><b>
                            {{ meses[mes].nome }} - {{ ano }}</b
                        ></v-toolbar-title
                    >

                    <v-spacer></v-spacer>
                    <v-btn @click="mesSeguinte" icon>
                        <v-icon>mdi-chevron-right</v-icon>
                    </v-btn>
                </v-toolbar>

                <!-- ASTRO LISTA ITENS -->
                <v-row>
                    <v-col cols="12">
                        <astro-lista-itens
                            @item:check="pagarItem"
                            @item:info="showItem"
                            @item:editar="editarItem"
                            @item:deletar="deletarItem"
                            @item:action="showItem"
                            @item:press="showItem"
                            @update="updateLista"
                            :itens="lista.itens"
                            :itensLoaded="itensLoaded"
                            itemTitulo="conceito"
                            ref="lista"
                            :key="key"
                            :itemSubtitulo="contaSubtitulo"
                        >
                        </astro-lista-itens>
                    </v-col>
                </v-row>
            </v-container>

            <!-- ADICIONAR NOVA CONTA -->
            <div class="text-center mt-3">
                <astro-add-conta
                    ref="addConta"
                    v-if="lista.usuarios"
                    :usuarios="lista.usuarios"
                >
                    <template v-slot:default="slotProps">
                        <v-btn
                            v-on="slotProps.evento"
                            v-bind="slotProps.atritutos"
                            x-large
                            color="primary"
                            class="gradient"
                        >
                            <v-icon class="mr-2"> mdi-plus </v-icon>
                            Adicionar item
                        </v-btn>
                    </template>
                </astro-add-conta>
            </div>

            <v-container v-if="lista.itens.length > 0">
                <!-- DIVIDAS -->
                <v-row v-if="lista.titulares.length > 1">
                    <v-col cols="12">
                        <astro-divider
                            class="primary--text"
                            :class="
                                $vuetify.theme.isDark
                                    ? 'text--lighten-2'
                                    : 'text--darken-2'
                            "
                        >
                            Divídas
                        </astro-divider>
                    </v-col>

                    <v-col cols="12">
                        <div class="d-flex flex-wrap justify-center">
                            <div
                                class="ma-1"
                                v-for="(divida, key) of dividas"
                                :key="key"
                            >
                                <v-card dark color="primary" class="gradient">
                                    <h4 class="pa-2 elevation-6 text-center">
                                        {{ key | capitalize }}
                                    </h4>
                                    <v-card-text class="pa-2">
                                        <div
                                            class="d-flex justify-space-between"
                                            v-for="(deve, key2) of divida.deve"
                                            :key="key2"
                                        >
                                            <p class="mb-0">
                                                <strong
                                                    >{{
                                                        key2 | capitalize
                                                    }}:</strong
                                                >
                                            </p>
                                            <p class="ml-2 mb-0">
                                                {{ deve | euros }}
                                            </p>
                                        </div>
                                    </v-card-text>
                                </v-card>
                            </div>
                        </div>
                    </v-col>
                </v-row>
                <!-- TOTAL -->
                <v-row>
                    <v-col cols="12">
                        <astro-divider
                            class="primary--text"
                            :class="
                                $vuetify.theme.isDark
                                    ? 'text--lighten-2'
                                    : 'text--darken-2'
                            "
                        >
                            Total
                        </astro-divider>
                    </v-col>
                    <v-col>
                        <div class="d-flex justify-center">
                            <v-card dark color="primary" class="gradient">
                                <h4 class="pa-2 elevation-6 text-center">
                                    Total gasto (<small>
                                        {{ meses[mes].nome }}
                                    </small>
                                    )
                                </h4>
                                <v-card-text class="pa-2">
                                    <v-container>
                                        <v-row>
                                            <v-col>
                                                <div
                                                    class="
                                                        d-flex
                                                        justify-space-between
                                                    "
                                                >
                                                    <p class="mb-0">Total:</p>
                                                    <p class="mb-0 ml-2">
                                                        {{ totalGasto | euros }}
                                                    </p>
                                                </div>
                                                <div
                                                    class="
                                                        d-flex
                                                        justify-space-between
                                                    "
                                                >
                                                    <p class="mb-0">Itens:</p>
                                                    <p class="mb-0 ml-2">
                                                        {{ lista.itens.length }}
                                                    </p>
                                                </div>
                                            </v-col>
                                            <template
                                                v-if="
                                                    lista.titulares.length > 1
                                                "
                                            >
                                                <v-col class="text-center">
                                                    <v-divider
                                                        vertical
                                                    ></v-divider>
                                                </v-col>
                                                <v-col>
                                                    <div
                                                        class="
                                                            d-flex
                                                            justify-space-between
                                                        "
                                                        v-for="(
                                                            total, usuario
                                                        ) of totalGastoPorUsuario"
                                                        :key="usuario"
                                                    >
                                                        <p class="mb-0">
                                                            {{
                                                                usuario
                                                                    | capitalize
                                                            }}:
                                                        </p>
                                                        <p class="mb-0 ml-2">
                                                            {{ total | euros }}
                                                        </p>
                                                    </div>
                                                </v-col>
                                            </template>
                                        </v-row>
                                    </v-container>
                                </v-card-text>
                            </v-card>
                        </div>
                    </v-col>
                </v-row>
            </v-container>

            <!--  PAGAR CONTA -->
            <astro-pagar-conta
                @item:pagado="resetarLista"
                ref="pagarconta"
                :key="$route.fullPath"
            ></astro-pagar-conta>

            <!-- SHOW CONTA -->
            <astro-show-conta @item:editar="editarItem" ref="showitem">
            </astro-show-conta>

            <!-- EDITAR CONTA -->
            <astro-editar-conta
                v-if="lista.usuarios"
                :usuarios="lista.usuarios"
                ref="editaritem"
            >
            </astro-editar-conta>
        </div>

        <v-container v-else-if="!lista && loaded">
            <v-row>
                <v-col>
                    <v-alert
                        class="text-center mt-5"
                        text
                        prominent
                        color="primary"
                        border="top"
                        key="alert-no-itens"
                    >
                        <h2
                            class="mb-4"
                            :class="[
                                $vuetify.theme.isDark
                                    ? 'grey--text text--lighten-2'
                                    : 'black--text',
                            ]"
                        >
                            {{
                                error.default === "no user"
                                    ? "Não há usuario logado"
                                    : error.default === "no list"
                                    ? "Essa lista não existe"
                                    : error.default === "no auth"
                                    ? "Voce não tem autorização para ver essa lista"
                                    : error.default
                            }}
                        </h2>

                        <div class="flex justify-center mt-4">
                            <v-btn
                                :to="{ name: 'contas' }"
                                class="gradient"
                                color="primary"
                            >
                                <v-icon class="mr-2" small>
                                    mdi-arrow-left
                                </v-icon>
                                Pagina da app</v-btn
                            >
                        </div>
                        <div class="flex justify-center mt-4">
                            <v-btn
                                color="warning"
                                class="gradient"
                                :to="{ name: 'home' }"
                            >
                                <v-icon class="mr-2" small> mdi-home </v-icon>
                                Pagina inicial</v-btn
                            >
                        </div>
                    </v-alert>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import AstroListaItens from "@/components/astrolista/AstroListaItens.vue";
import AstroAddConta from "@/components/astrolista/AstroAddConta.vue";
import AstroListaToolbar from "@/components/astrolista/AstroListaToolbar.vue";
import { meses } from "@/assets/variables/variables.js";
import AstroPagarConta from "@/components/astrolista/AstroPagarConta.vue";
import AstroShowConta from "@/components/astrolista/AstroShowConta.vue";
import AstroEditarConta from "@/components/astrolista/AstroEditarConta.vue";
import AstroDivider from "../../components/layout/AstroDivider.vue";

export default {
    name: "contas",
    components: {
        AstroListaItens,
        AstroAddConta,
        AstroListaToolbar,
        AstroPagarConta,
        AstroShowConta,
        AstroEditarConta,
        AstroDivider,
    },
    data() {
        return {
            key: 1,
            dividas: {},
            meses: meses,
            error: {
                default: "Buscando lista",
            },
        };
    },
    watch: {
        mes() {
            this.$store.dispatch("appcontas/getItens", {
                mes: this.mes,
                ano: this.ano,
            });
        },
    },
    computed: {
        itensLoaded() {
            return this.$store.state.appcontas.loadedItens;
        },
        loaded() {
            return this.$store.state.appcontas.loaded;
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
        lista() {
            return this.$store.state.appcontas.lista;
        },
        totalGasto() {
            if (!this.lista || !this.lista.itens) {
                return 0;
            }

            return this.lista.itens.reduce((total, item) => {
                return total + item.valor;
            }, 0);
        },
        totalGastoPorUsuario() {
            if (!this.lista || !this.lista.itens || !this.lista.usuarios) {
                return null;
            }
            const gastos = {};
            const usuarios = Object.keys(this.lista.usuarios);
            usuarios.forEach((usuario) => {
                const gastoPorUsuario = this.lista.itens.reduce(
                    (total, item) => {
                        return total + item.divisao[usuario];
                    },
                    0
                );
                gastos[usuario] = gastoPorUsuario;
            });
            return gastos;
        },
    },
    methods: {
        print(t) {
            console.log(t);
        },
        contaSubtitulo(item) {
            return `<i class="white--text"> ${this.$helpers.toMoney(
                item.valor
            )}</i> pago por <i class="white--text">${this.$helpers.capitalize(
                item.quemPagou
            )}</i>`;
        },
        init() {
            console.log("init", this.mes);
            this.$store
                .dispatch("appcontas/getLista", {
                    id: this.id,
                    mes: this.mes,
                    ano: this.ano,
                })
                .then((e) => {
                    if (e.result) {
                        this.calcularDividas();
                    } else {
                        console.log("handle error", e);
                        this.error.default = e.msg;
                        console.log(this.error);
                    }
                });
        },
        addItem(item) {
            this.$store.dispatch("appcontas/addItem", { item, id: this.id });
        },
        abrirAddConta() {
            this.$refs.addConta.open();
        },
        deletarItem({ item, index }) {
            console.log("deletar:", { item, index });
            this.$store.dispatch("appcontas/deletarItem", { item, index });
        },
        editarItem({ item }) {
            // console.log({ item, index });
            this.$refs.editaritem.open({ item });
        },
        pagarItem({ item, index }) {
            this.$refs.pagarconta.open({ item, index });
        },
        resetarLista(index) {
            // this.key++;
            this.$refs.lista.onSwipe({ type: "swiperight" }, index);
            // this.$refs.lista.onTap();
        },
        showItem({ item, index }) {
            console.log({ item, index });
            this.$refs.showitem.open({ item, index });
        },
        updateLista() {
            this.calcularDividas();
        },
        mesSeguinte() {
            let mesSeguinte = this.mes + 1;
            let ano = this.ano;
            if (mesSeguinte > 11) {
                mesSeguinte = 0;
                ano++;
            }
            this.$router.push({
                name: "contas-id",
                params: { id: this.id },
                query: { mes: mesSeguinte, ano: ano },
            });
        },
        mesAnterior() {
            let mesAnterior = this.mes - 1;
            let ano = this.ano;
            if (mesAnterior < 0) {
                mesAnterior = 11;
                ano--;
            }
            this.$router.push({
                name: "contas-id",
                params: { id: this.id },
                query: { mes: mesAnterior, ano: ano },
            });
        },
        calcularDividas() {
            if (!this.lista || !this.lista.itens) {
                return {};
            }
            const dividas = {};
            // CRIA ARRAY COM SLUGS DOS USUARIOS
            const usuarios = Object.keys(this.lista.usuarios);
            usuarios.forEach((usuarioA) => {
                dividas[usuarioA] = { deve: {} };
                usuarios.forEach((usuarioB) => {
                    if (usuarioA === usuarioB) {
                        return;
                    }
                    dividas[usuarioA].deve[usuarioB] = 0;
                });
            });
            // FOREACH POR CADA ITEM DA LISTA
            this.lista.itens.forEach((item) => {
                // FOREACH PARA CADA USUARIO NA ARRAY
                usuarios.forEach((usuario) => {
                    if (item.quemPagou === usuario) {
                        return;
                    }
                    if (item.pagamento[usuario]) {
                        return;
                    }

                    dividas[usuario].deve[item.quemPagou] +=
                        item.divisao[usuario];
                });
            });

            usuarios.forEach((usuarioA) => {
                usuarios.forEach((usuarioB) => {
                    if (usuarioA === usuarioB) {
                        return;
                    }

                    const diff =
                        dividas[usuarioA].deve[usuarioB] >=
                        dividas[usuarioB].deve[usuarioA]
                            ? dividas[usuarioB].deve[usuarioA]
                            : dividas[usuarioA].deve[usuarioB];
                    dividas[usuarioA].deve[usuarioB] -= diff;
                    dividas[usuarioB].deve[usuarioA] -= diff;
                });
            });
            this.dividas = dividas;
            return dividas;
        },
        ordenar(filtro) {
            this.$store.dispatch("appcontas/setOrdem", filtro).then(() => {
                this.$store.dispatch("appcontas/ordenarItens");
            });
        },
        favoritarLista() {
            const favorito = {
                nome: this.lista.nome,
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
        },
        verificarUsuario() {},
    },
    mounted() {
        this.init();
        console.log(this);
    },
    destroyed() {
        console.log("destruir");
        this.$store.dispatch("appcontas/destruirLista");
    },
};
</script>

<style>
</style>