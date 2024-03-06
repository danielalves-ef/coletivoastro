<template>
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
</template>

<script>
import ContasItemEdit from "@/views/appcontas/id/lista/item/editar/ContasListaItemEditar.vue";
import ContasShowItem from "@/views/appcontas/id/lista/item/show/ContasListaItemShow.vue";
export default {
    components: { ContasShowItem, ContasItemEdit },
    props: {
        item: {
            type: Object,
            required: true,
        },
        lista: {
            type: Object,
            required: true,
        },
    },
    computed: {
        edit() {
            return this.$route.query.edit !== undefined;
        },
    },
    methods: {},
};
</script>

<style>
</style>