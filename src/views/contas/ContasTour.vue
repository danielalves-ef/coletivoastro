<template>
    <div>
        <astro-lista-itens :itens="itens" />
    </div>
</template>

<script>
import AstroListaItens from "../../components/astrolista/AstroListaItens.vue";
export default {
    name: "contas-tour",
    components: { AstroListaItens },
    data() {
        return {
            itens: [
                {
                    titulo: "item 1",
                    subtitulo: "item 1 subs",
                    icone: "mdi-home",
                },
            ],
        };
    },
};
</script>

<style>
</style>