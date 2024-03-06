<template>
    <v-container>
        <v-row key="item" v-if="item">
            <v-col cols="12" class="px-0">
                <v-fade-transition mode="out-in">
                    <contas-show-item
                        :lista="lista"
                        v-if="!edit"
                        :item="item"
                    ></contas-show-item>
                    <contas-item-edit
                        v-else
                        :lista="lista"
                        :item="item"
                    ></contas-item-edit>
                </v-fade-transition>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import ContasItemEdit from "@/views/appcontas/id/lista/item/editar/ContasListaItemEditar.vue";
import ContasShowItem from "@/views/appcontas/id/lista/item/show/ContasListaItemShow.vue";
export default {
    components: { ContasShowItem, ContasItemEdit },
    props: {
        lista: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            item: null,
        };
    },
    computed: {
        edit() {
            return this.$route.query.edit !== undefined;
        },
        itemId() {
            return this.$route.params.item;
        },
        listaId() {
            return this.$route.params.id;
        },
    },
    methods: {
        getItem() {
            return new Promise((resolve, reject) => {
                this.$firestore
                    .collection("appcontas")
                    .doc(this.listaId)
                    .collection("itens")
                    .doc(this.itemId)
                    .get()
                    .then((snap) => {
                        if (!snap.exists) {
                            reject("documento não existe");
                            return;
                        }
                        const doc = snap.data();
                        this.item = doc;
                        resolve();
                    })
                    .catch((e) => {
                        reject(e);
                        this.$swal({
                            title: "Algo deu errado",
                            text: e,
                            icon: "error",
                        });
                    });
            });
        },
    },
    mounted() {
        this.getItem()
            .then()
            .catch((e) => {
                this.$swal({
                    title: "Algo deu errado",
                    text: e,
                    icon: "error",
                });
            });
    },
};
</script>

<style>
</style>