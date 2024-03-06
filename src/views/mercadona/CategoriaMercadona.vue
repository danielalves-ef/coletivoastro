<template>
    <div>
        <v-container v-if="categoria">
            <v-row>
                <v-col cols="12">
                    {{ categoria.name }}
                </v-col>
            </v-row>
            <v-row>
                <v-col
                    cols="12"
                    v-for="cat in categoria.categories"
                    :key="cat.id"
                >
                    <v-subheader>
                        {{ cat.name }}
                    </v-subheader>
                    <v-list subheader>
                        <v-list-item
                            v-for="(produto, index) in cat.products"
                            :key="index"
                        >
                            <v-list-item-title
                                >{{ produto.display_name }}
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
export default {
    data() {
        return {
            categoria: null,
        };
    },
    computed: {
        id() {
            return this.$route.params.categoria;
        },
    },
    methods: {
        getCategorias() {
            if (this.id) {
                fetch(
                    "https://tienda.mercadona.es/api/v1_1/categories/" + this.id
                )
                    .then((body) => {
                        return body.json();
                    })
                    .then((data) => {
                        console.log(data);
                        this.categoria = data;
                    });
            }
        },
    },
    mounted() {
        this.getCategorias();
    },
};
</script>

<style>
</style>