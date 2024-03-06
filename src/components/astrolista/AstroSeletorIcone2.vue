<template>
    <v-dialog max-width="350" v-model="iconPopup">
        <v-card>
            <v-toolbar flat dense>
                <v-toolbar-title>Icones</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn @click.stop="iconPopup = false" icon>
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text>
                <v-container>
                    <div class="d-flex justify-center flex-wrap">
                        <v-btn
                            class="ma-1 gradient"
                            v-for="icone in icones"
                            :key="icone"
                            @click="selecionarIcone(icone)"
                            color="primary"
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
    </v-dialog>
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
    },
    data() {
        return {
            iconPopup: false,
        };
    },
    methods: {
        open() {
            this.iconPopup = true;
        },
        close() {
            this.iconPopup = false;
        },
        selecionarIcone(icone) {
            this.$emit("selecionar", icone);
            this.close();
        },
    },
};
</script>

<style>
</style>