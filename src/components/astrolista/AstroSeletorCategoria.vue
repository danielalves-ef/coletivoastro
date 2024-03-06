<template>
    <div>
        <slot v-bind:id="activator">
            <v-btn :color="color" class="rounded" fab small :id="activator">
                <v-icon color="white">{{ icone }}</v-icon>
            </v-btn>
        </slot>
        <v-bottom-sheet scrollable ref="seletor" :activator="'#' + activator">
            <v-card tile>
                <v-toolbar dark class="primary gradient" flat dense>
                    <v-toolbar-title>Icones</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn @click.stop="close" icon>
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <div
                                    v-for="{ categoria, icones } in categorias"
                                    :key="categoria"
                                >
                                    <v-subheader class="justify-center">
                                        {{ categoria }}
                                    </v-subheader>
                                    <div
                                        class="d-flex justify-center flex-wrap"
                                    >
                                        <v-btn
                                            v-for="icone in icones"
                                            :key="icone"
                                            fab
                                            class="rounded mr-2 mb-2"
                                            color="primary"
                                            @click="selecionarIcone(icone)"
                                        >
                                            <v-icon large>{{ icone }}</v-icon>
                                        </v-btn>
                                    </div>
                                </div>
                            </v-col>
                        </v-row>
                    </v-container>
                    <v-container v-if="false">
                        <v-row>
                            <v-col cols="12">
                                <v-expansion-panels
                                    multiple
                                    v-model="painel"
                                    accordion
                                    flat
                                >
                                    <v-expansion-panel
                                        :value="categoria"
                                        v-for="{
                                            categoria,
                                            icones,
                                        } in categorias"
                                        :key="categoria"
                                    >
                                        <v-expansion-panel-header
                                            class="pa-0"
                                            hide-actions
                                            >{{
                                                categoria
                                            }}</v-expansion-panel-header
                                        >
                                        <v-expansion-panel-content class="pa-0">
                                            <div class="d-flex">
                                                <v-avatar
                                                    v-for="icone in icones"
                                                    :key="icone"
                                                    size="50"
                                                    class="rounded-lg mx-2"
                                                    color="primary"
                                                >
                                                    <v-icon>{{ icone }}</v-icon>
                                                </v-avatar>
                                            </div>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </v-col>
                        </v-row>
                    </v-container>
                    <v-container v-if="false">
                        <v-row
                            v-for="{ categoria, icones } in categorias"
                            :key="categoria"
                        >
                            <v-col cols="12" class="py-0">
                                <p
                                    class="text-body-2 pl-4 mb-1"
                                    :style="{
                                        borderBottom: '1px solid lightgrey',
                                    }"
                                >
                                    {{ categoria }}
                                </p>
                            </v-col>
                            <v-col
                                v-for="{ nome, icone } in icones"
                                :key="icone"
                                class="pa-0"
                                cols="12"
                            >
                                <v-list-item
                                    link
                                    dense
                                    class="py-0"
                                    :style="{ height: '50px' }"
                                >
                                    <v-list-item-avatar
                                        color="primary"
                                        class="rounded-lg"
                                        size="40"
                                    >
                                        <v-icon dark>
                                            {{ icone }}
                                        </v-icon>
                                    </v-list-item-avatar>
                                    <v-list-item-title>
                                        {{ nome }}
                                    </v-list-item-title>
                                </v-list-item>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-bottom-sheet>
    </div>
</template>

<script>
import { icones } from "@/assets/variables/variables.js";
import { categorias } from "@/assets/variables/variables.js";

export default {
    name: "astro-seletor-icone",
    props: {
        icones: {
            type: Array,
            default: () => {
                return icones;
            },
        },
        categorias: {
            type: Array,
            default: () => {
                return categorias;
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
        return {
            painel: [],
        };
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
        this.painel = this.categorias.map((c, i) => i);
    },
};
</script>

<style>
</style>