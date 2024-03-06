<template>
    <div>
        <slot v-bind:id="activator">
            <v-avatar
                class="rounded elevation-4"
                tile
                dark
                :size="size"
                :color="color"
                :id="activator"
            >
                <div
                    v-if="!fotoBtn"
                    class="d-flex align-center flex-column white--text"
                >
                    <v-icon dark> {{ icone }}</v-icon>
                    <small>Foto</small>
                </div>
                <v-img v-else :src="fotoURL"></v-img>
            </v-avatar>
        </slot>
        <v-bottom-sheet ref="seletor" :activator="'#' + activator">
            <v-card min-height="200">
                <v-toolbar dark class="primary gradient" flat dense>
                    <v-toolbar-title>{{ title }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn @click.stop="close" icon>
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                    <v-container>
                        <v-row v-if="foto">
                            <v-col cols="12">
                                <v-img
                                    max-height="300"
                                    contain
                                    :src="fotoURL"
                                ></v-img>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <v-file-input
                                    show-size
                                    small-chips
                                    truncate-length="25"
                                    v-model="foto"
                                    accept="image/*"
                                    outlined
                                    dense
                                    label="Foto recibo"
                                    prepend-inner-icon="mdi-camera"
                                    hide-details="auto"
                                >
                                    <!-- <template v-if="foto" v-slot:append-outer>
                                    <v-btn color="success gradient">
                                        Enviar
                                    </v-btn>
                                </template> -->
                                </v-file-input>
                            </v-col>
                            <v-col v-if="foto" cols="12">
                                <v-btn
                                    @click="selecionarFoto"
                                    block
                                    large
                                    color="primary"
                                >
                                    Salvar foto
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-bottom-sheet>
    </div>
</template>

<script>
export default {
    name: "astro-seletor-foto",
    props: {
        icone: {
            type: String,
            default: "mdi-camera",
        },
        color: {
            type: String,
            default: "primary",
        },
        size: {
            type: String,
            default: "60",
        },
        title: {
            type: String,
            default: "Selecionar Foto",
        },
        activator: {
            type: String,
            default: "seletor-foto",
        },
    },
    data() {
        return {
            foto: null,
            fotoBtn: false,
        };
    },
    computed: {
        fotoURL() {
            if (this.foto) {
                const objectURL = URL.createObjectURL(this.foto);
                return objectURL;
            }
            return null;
        },
    },
    methods: {
        close() {
            this.$refs.seletor.save();
        },
        selecionarFoto() {
            this.$emit("selecionar", this.foto);
            this.fotoBtn = true;
            this.close();
        },
    },
    created() {
        console.log({ vueFoto: this });
    },
    watch: {
        foto(newValue) {
            if (newValue === null) {
                this.fotoBtn = false;
                this.$emit("selecionar", null);
            }
        },
    },
};
</script>

<style>
</style>