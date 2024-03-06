<template>
    <v-container>
        <v-fade-transition mode="out-in">
            <contas-lista-item
                v-if="itemSelecionado"
                :item="itemSelecionado"
                :lista="lista"
                :key="itemId"
            ></contas-lista-item>
            <contas-lista-itens v-else :lista="lista"></contas-lista-itens>
        </v-fade-transition>
    </v-container>
</template>

<script>
import ContasListaItem from "@/views/appcontas/id/lista/item/ContasListaItem.vue";
import ContasListaItens from "@/views/appcontas/id/lista/itens/ContasListaItens.vue";

export default {
    components: {
        ContasListaItem,
        ContasListaItens,
    },
    name: "contas-lista",
    props: {
        lista: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {};
    },
    computed: {
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
            return item || false;
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
    },
    mounted() {
        window.scrollTo(0, 0);
    },
};
</script>

<style>
</style>