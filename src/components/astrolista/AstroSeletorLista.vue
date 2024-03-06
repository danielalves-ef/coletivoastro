<template>
    <div>
        <slot v-bind:id="activator">
            <v-chip link label :color="color" small :id="activator">
                {{ item }}
            </v-chip>
        </slot>
        <v-bottom-sheet scrollable ref="seletor" :activator="'#' + activator">
            <v-card>
                <v-toolbar dark class="primary gradient" flat dense>
                    <v-toolbar-title>{{ title }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn @click.stop="close" icon>
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                    <v-container>
                        <v-list-item
                            link
                            @click="selecionarItem(item)"
                            v-for="item in itens"
                            :key="item"
                        >
                            <v-list-item-title>
                                {{ item }}
                            </v-list-item-title>
                        </v-list-item>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-bottom-sheet>
    </div>
</template>

<script>
export default {
    name: "astro-seletor-lista",
    props: {
        itens: {
            type: Array,
            required: true,
        },
        item: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            default: "primary",
        },
        activator: {
            type: String,
            default: "seletor-lista",
        },
        title: {
            type: String,
            default: "Seletor Lista",
        },
        small: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {};
    },
    methods: {
        close() {
            this.$refs.seletor.save();
        },
        selecionarItem(item) {
            this.$emit("selecionar", item);
            this.close();
        },
    },
    created() {
        console.log(this);
    },
};
</script>

<style>
</style>