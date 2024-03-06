<template>
    <div>
        <slot v-bind:id="activator">
            <v-btn :color="color" :id="activator">
                {{ tituloBtn }}
            </v-btn>
        </slot>
        <v-bottom-sheet scrollable ref="seletor" :activator="'#' + activator">
            <v-card min-height="200">
                <v-toolbar dark class="primary gradient" flat dense>
                    <v-toolbar-title>Novo usuario</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn @click.stop="close" icon>
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                    <v-container>
                        <v-row class="text-center">
                            <v-col cols="12">
                                <v-subheader class="justify-center"
                                    >Buscar nos contatos</v-subheader
                                >
                                <div key="autocomplete">
                                    <v-autocomplete
                                        v-model="model"
                                        :items="contatos"
                                        @input="handleInputContatos"
                                        hide-details
                                        hide-selected
                                        :search-input.sync="busca"
                                        outlined
                                        eager
                                        append-icon="mdi-account-search"
                                        dense
                                        ref="autocomplete"
                                        item-text="displayName"
                                        item-value="email"
                                        :menu-props="{
                                            offsetY: true,
                                            bottom: true,
                                        }"
                                        label="Buscar contato..."
                                        return-object
                                    >
                                        <template v-slot:item="{ item }">
                                            <v-list-item-avatar
                                                color="indigo"
                                                class="
                                                    text-h5
                                                    font-weight-light
                                                    white--text
                                                "
                                            >
                                                {{ item.displayName.charAt(0) }}
                                            </v-list-item-avatar>
                                            <v-list-item-content>
                                                <v-list-item-title
                                                    v-text="item.displayName"
                                                ></v-list-item-title>
                                                <v-list-item-subtitle
                                                    v-text="item.email"
                                                ></v-list-item-subtitle>
                                            </v-list-item-content>
                                            <v-list-item-action>
                                                <v-icon>mdi-account</v-icon>
                                            </v-list-item-action>
                                        </template>
                                    </v-autocomplete>
                                </div>
                            </v-col>
                            <v-col cols="12">
                                <astro-divider>ou</astro-divider>
                                <v-subheader class="justify-center"
                                    >Adicionar manualmente</v-subheader
                                >
                                <v-text-field
                                    v-model="usuario.slug"
                                    class="mt-2"
                                    outlined
                                    dense
                                    ref="slug"
                                    @input="handleInputSlug"
                                    label="Username"
                                    hide-details="auto"
                                    append-icon="mdi-account-circle"
                                    placeholder="Escolha o apelido do usuario (sem espaços)"
                                ></v-text-field>
                                <v-text-field
                                    v-model="usuario.nome"
                                    class="mt-2"
                                    outlined
                                    dense
                                    label="Nome"
                                    hide-details="auto"
                                    append-icon="mdi-card-account-details-outline"
                                ></v-text-field>
                                <v-text-field
                                    v-model="usuario.email"
                                    class="mt-2"
                                    type="email"
                                    outlined
                                    dense
                                    hide-details="auto"
                                    append-icon="mdi-at"
                                    label="Email"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-btn
                                    :disabled="!usuarioValido"
                                    large
                                    color="primary"
                                    @click="adicionarUsuario"
                                    >Adicionar usuario</v-btn
                                >
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-bottom-sheet>
    </div>
</template>

<script>
import AstroDivider from "../../components/layout/AstroDivider.vue";
export default {
    components: { AstroDivider },
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
        activator: {
            type: String,
            default: "seletor-icone",
        },
        tituloBtn: {
            type: String,
            default: "Adicionar usuario",
        },
    },
    data() {
        return {
            iconPopup: false,
            contatos: [],
            busca: "",
            usuario: {
                nome: "",
                slug: "",
                email: "",
            },
            model: null,
        };
    },
    computed: {
        usuarioValido() {
            return (
                this.usuario.slug !== "" &&
                this.usuario.email !== "" &&
                this.usuario.nome !== ""
            );
        },
    },
    methods: {
        close() {
            this.usuario = {
                nome: "",
                slug: "",
                email: "",
            };
            this.busca = "";
            this.model = null;
            this.$refs.seletor.save();
        },
        handleInputContatos(event) {
            if (event) {
                this.usuario.nome = event.displayName;
                this.usuario.email = event.email;
                this.$refs.slug.focus();
            }
        },
        getContatoFromFirebase() {
            const contatos = [];
            this.$firestore
                .collection("usuarios")
                .get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        contatos.push(doc.data());
                    });
                    this.contatos = contatos;
                });
        },
        handleInputSlug(value) {
            this.usuario.slug = value
                .replace(/[^0-9a-zA-Z]+/g, "")
                .toLowerCase();
        },
        adicionarUsuario() {
            this.$emit("adicionar", this.usuario);
            this.busca = "";
            this.close();
        },
    },
    mounted() {
        this.getContatoFromFirebase();
        console.log(this);
    },
};
</script>

<style>
</style>