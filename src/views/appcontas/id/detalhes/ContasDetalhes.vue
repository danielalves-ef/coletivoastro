<template>
    <contas-detalhes-editar
        :listaOriginal="lista"
        v-if="editar"
    ></contas-detalhes-editar>
    <contas-detalhes-show :lista="lista" v-else></contas-detalhes-show>
</template>

<script>
import ContasDetalhesShow from "./show/ContasDetalhesShow.vue";
import ContasDetalhesEditar from "./editar/ContasDetalhesEditar.vue";
export default {
    components: { ContasDetalhesShow, ContasDetalhesEditar },
    props: {
        lista: {
            type: Object,
            required: true,
        },
    },
    computed: {
        editar() {
            return this.$route.query.editar;
        },
    },
    mounted() {
        window.scrollTo(0, 0);
    },
};
</script>

<style>
</style>