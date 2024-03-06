<template>
    <div>
        <div :style="{ height: '400px' }"></div>
        <slide></slide>
        <div :style="{ height: '400px' }"></div>

        <v-list v-if="categorias">
            <v-list-item
                :to="{
                    name: 'mercadona-categoria',
                    params: { categoria: categoria.id },
                }"
                v-for="categoria in categorias"
                :key="categoria.id"
            >
                <v-list-item-title>{{ categoria.name }} </v-list-item-title>
            </v-list-item>
        </v-list>
    </div>
</template>

<script>
import Slide from "../../components/Slide.vue";
export default {
    components: { Slide },
    data() {
        return {
            categorias: null,
        };
    },
    methods: {
        getCategorias() {
            fetch("https://tienda.mercadona.es/api/v1_1/categories/")
                .then((body) => {
                    return body.json();
                })
                .then((data) => {
                    console.log(data);
                    this.categorias = data.results;
                });
        },
    },
    mounted() {
        this.getCategorias();
    },
};
</script>

<style>
</style>