<template>
    <div>
        <v-list :key="$vuetify.theme.themes.dark.primary">
            <v-list-item>
                <v-list-item-icon class="mr-2">
                    <v-icon>mdi-theme-light-dark</v-icon>
                </v-list-item-icon>
                <v-list-item-title> Modo escuro </v-list-item-title>
                <v-list-item-action>
                    <v-switch
                        class="pr-5"
                        color="primary"
                        v-model="$vuetify.theme.isDark"
                    ></v-switch>
                </v-list-item-action>
            </v-list-item>
            <v-list-item class="py-0">
                <v-list-item-icon class="mr-2">
                    <v-icon>mdi-palette</v-icon>
                </v-list-item-icon>
                <v-list-item-title> Cor primária </v-list-item-title>
            </v-list-item>

            <v-list-item class="py-0">
                <v-list-item-title>
                    <div class="d-flex flex-wrap justify-center py-2">
                        <v-btn
                            v-for="cor in cores"
                            :key="cor"
                            :color="colors[cor].base"
                            @click="changeColor(cor)"
                            height="40"
                            width="40"
                            max-width="40"
                            class="mr-1 mb-1"
                            elevation="1"
                            fab
                            :style="{
                                boxShadow:
                                    $vuetify.theme.themes.dark.primary ===
                                    colors[cor].base
                                        ? `0px 0px 0px 3px ${
                                              $vuetify.theme.isDark
                                                  ? '#fff'
                                                  : '#000'
                                          } !important`
                                        : '',
                            }"
                        >
                        </v-btn>
                    </div>
                    <v-divider></v-divider>
                    <div class="d-flex flex-wrap justify-center py-2">
                        <v-btn
                            v-for="cor in custom"
                            :key="cor"
                            :color="cor"
                            @click="salvarCor(cor)"
                            height="40"
                            width="40"
                            max-width="40"
                            class="mr-1 mb-1"
                            elevation="1"
                            fab
                        >
                        </v-btn>
                    </div>
                </v-list-item-title>
            </v-list-item>
        </v-list>
    </div>
</template>

<script>
import colors from "vuetify/lib/util/colors";

export default {
    name: "ajustes-personalizar",
    data() {
        return {
            cores: [
                "red",
                "pink",
                "purple",
                "deepPurple",
                "indigo",
                "blue",
                "teal",
                "green",
                "amber",
                "orange",
                "deepOrange",
                "brown",
                "blueGrey",
                "grey",
            ],
            custom: ["#716da6", "#73a6e0", "#6a819b"],
            colors: colors,
            color: "",
            tema: {
                dark: false,
            },
        };
    },
    watch: {
        "$vuetify.theme.isDark"(newValue) {
            this.salvarTema(newValue);
        },
    },
    methods: {
        salvarTema(dark) {
            this.$store.dispatch("usuario/salvarTemaDark", dark);
        },
        salvarCor(cor) {
            this.$store.dispatch("usuario/salvarTemaCor", cor);
        },
        inputColorPicker(color) {
            console.log(color);
        },
        changeColor(color) {
            const srt = color;
            const exp = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
            const isHash = exp.test(srt);
            let cor;
            if (isHash) {
                cor = color;
            } else {
                if (colors[color]) {
                    cor = colors[color].base;
                }
            }
            this.salvarCor(cor);
            // this.$vuetify.theme.themes.dark.primary = cor;
            // this.$vuetify.theme.themes.light.primary = cor;
        },
    },
    mounted() {
        console.log(Object.keys(this.colors));
    },
};
</script>

<style >
</style>