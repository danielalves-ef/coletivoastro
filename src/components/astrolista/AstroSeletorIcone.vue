<template>
    <div>
        <slot v-bind:id="activator">
            <v-btn :color="color" fab small :id="activator">
                <v-icon color="white">{{ icone }}</v-icon>
            </v-btn>
        </slot>
        <v-bottom-sheet scrollable ref="seletor" :activator="'#' + activator">
            <v-card>
                <v-toolbar dark class="primary gradient" flat dense>
                    <v-toolbar-title>Icones</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn @click.stop="close" icon>
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                    <v-container>
                        <div class="d-flex justify-center flex-wrap">
                            <v-btn
                                class="ma-1"
                                v-for="icone in icones"
                                :key="icone"
                                @click="selecionarIcone(icone)"
                                :color="color"
                                fab
                            >
                                <v-icon>
                                    {{ icone }}
                                </v-icon>
                            </v-btn>
                        </div>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-bottom-sheet>
    </div>
</template>

<script>
import { icones } from "@/assets/variables/variables.js";

export default {
    name: "astro-seletor-icone",
    props: {
        icones: {
            type: Array,
            default: () => {
                return icones;
            },
        },
        icone: {
            type: String,
            default: "mdi-store",
        },
        color: {
            type: String,
            default: "primary",
        },
        activator: {
            type: String,
            default: "seletor-icone",
        },
    },
    data() {
        return {};
    },
    methods: {
        close() {
            this.$refs.seletor.save();
        },
        selecionarIcone(icone) {
            this.$emit("selecionar", icone);
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