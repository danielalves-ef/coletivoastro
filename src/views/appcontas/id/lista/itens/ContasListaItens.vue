<template>
    <v-row key="lista">
        <v-col cols="12" class="pt-0">
            <astro-seletor-mes></astro-seletor-mes>
            <astro-button-ordenar v-if="lista.itens.length > 0" label>
            </astro-button-ordenar>
            <astro-lista-itens
                :itens="lista.itens"
                :itensLoaded="itensLoaded"
                itemTitulo="conceito"
                ref="lista"
                key="itens"
                :itemSubtitulo="contaSubtitulo"
                link
                @item:tap="abrirItem"
                @item:editar="editarItem"
                @item:deletar="deletarItem"
                @item:check="pagarItem"
                @item:info="abrirItem"
            >
            </astro-lista-itens>
        </v-col>
        <v-col cols="12">
            <v-btn
                color="primary gradient"
                x-large
                :to="{ name: 'contas-add' }"
                block
                dark
            >
                <v-icon left>mdi-plus-circle</v-icon>
                Adicionar
            </v-btn>
        </v-col>

        <contas-lista-itens-pagar
            @item:pagado="resetarLista"
            ref="pagarconta"
            :key="$route.fullPath"
        ></contas-lista-itens-pagar>

        <template v-if="lista.itens.length > 0">
            <!-- TOTAL -->
            <v-col cols="12">
                <astro-divider color="primary">
                    <span> Total </span>
                </astro-divider>
            </v-col>
            <v-col cols="6">
                <v-alert color="primary" text>
                    <div class="d-flex flex-column justify-center align-center">
                        <span class="text-overline">Total</span>
                        <span class="text-h6 font-weight-medium">
                            {{ totalGasto | euros }}
                        </span>
                        <span class="gray-text text-caption">
                            {{ lista.itens.length }} itens
                        </span>
                    </div>
                    <!-- <p class="white--text text-h6 mb-0">
                            {{ totalGasto | euros }}
                        </p> -->
                </v-alert>
            </v-col>
            <v-col cols="6">
                <v-alert color="primary" text>
                    <template v-for="(total, usuario) of totalGastoPorUsuario">
                        <div
                            class="d-flex justify-space-between"
                            :key="usuario"
                        >
                            <p class="mb-0">{{ usuario | capitalize }}:</p>
                            <p class="mb-0 ml-2">
                                {{ total | euros }}
                            </p>
                        </div>
                        <v-divider :key="usuario + 'divider'"></v-divider>
                    </template>
                </v-alert>
            </v-col>
        </template>
    </v-row>
</template>

<script>
import AstroListaItens from "@/components/astrolista/AstroListaItens.vue";
import AstroSeletorMes from "@/components/astrolista/AstroSeletorMes.vue";
import AstroButtonOrdenar from "@/components/astrolista/AstroButtonOrdenar.vue";
import ContasListaItensPagar from "./ContasListaItensPagar.vue";
import AstroDivider from "@/components/layout/AstroDivider.vue";

export default {
    components: {
        AstroDivider,
        AstroListaItens,
        AstroSeletorMes,
        AstroButtonOrdenar,
        ContasListaItensPagar,
    },
    name: "contas-lista-itens",
    // props: {
    //     lista: {
    //         type: Object,
    //         required: true,
    //     },
    // },
    data() {
        return {};
    },
    computed: {
        lista() {
            return this.$store.state.appcontas.lista.lista;
        },
        id() {
            return this.$route.params.id;
        },
        itensLoaded() {
            return this.$store.state.appcontas.lista.loadedItens;
        },
        loaded() {
            return this.$store.state.appcontas.lista.loaded;
        },
        itemId() {
            return this.$route.query.item;
        },
        itemSelecionado() {
            const item = this.lista.itens.find((i) => {
                return i.id === this.itemId;
            });
            return item;
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
            this.lista.usuarios.forEach((usuario) => {
                const gastoPorUsuario = this.lista.itens.reduce(
                    (total, item) => {
                        const pagou = item.pagamento.find(
                            (pag) => pag.slug === usuario.slug
                        );
                        const valor = pagou ? pagou.divisao : 0;
                        return total + valor;
                    },
                    0
                );
                gastos[usuario.slug] = gastoPorUsuario;
            });
            return gastos;
        },
    },

    methods: {
        contaSubtitulo(item) {
            return `<i class="white--text mr-1"> ${this.$helpers.toMoney(
                item.valor
            )}</i> pago por <i class="white--text ">${this.$helpers.capitalize(
                item.quemPagou
            )}</i>`;
        },
        resetarLista() {
            // this.key++;
            // this.$refs.lista.onSwipe({ type: "swiperight" }, index);
            this.$refs.lista.resetarLista();
        },
        pagarItem({ item }) {
            this.$refs.pagarconta.open({ item });
        },
        abrirItem({ item }) {
            console.log("abrirItem", { item });
            const push = {
                name: this.$route.name,
                params: this.$route.params,
                query: { ...this.$route.query, item: item.id },
            };
            console.log({ push });
            this.$router.push(push);
        },
        fecharItem() {
            const push = {
                name: this.$route.name,
                params: this.$route.params,
                query: { ...this.$route.query, item: undefined },
            };
            console.log({ push });
            this.$router.push(push);
        },
        editarItem({ item }) {
            this.$router.push({ query: { item: item.id, edit: true } });
        },
        deletarItem({ item }) {
            console.log("deletar:", { item });
            this.$store
                .dispatch("appcontas/lista/deletarItem", {
                    item,
                })
                .then(() => {})
                .catch((e) => {
                    this.$swal({
                        title: "Algo deu errado",
                        text: e,
                        icon: "error",
                        position: "center",
                    });
                });
        },
        checkItem() {
            this.$swal("checkItem");
        },
    },
};
</script>

<style>
</style>