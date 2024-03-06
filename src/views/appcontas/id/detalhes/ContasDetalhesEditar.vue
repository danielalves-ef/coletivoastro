<template>
    <v-container>
        <v-row>
            <v-col cols="12" class="px-0 pt-0">
                <v-card color="transparent" flat>
                    <v-card-text>
                        <!-- DETALHES -->
                        <v-row>
                            <v-col cols="4">
                                <astro-seletor-foto
                                    size="92"
                                    color="grey"
                                    @selecionar="selecionarFoto"
                                ></astro-seletor-foto>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field
                                    class="mb-3"
                                    outlined
                                    dense
                                    label="Nome da lista"
                                    hide-details="auto"
                                    v-model="listaEditada.nome"
                                    placeholder="ex: contas de casa"
                                >
                                </v-text-field>
                                <v-select
                                    outlined
                                    dense
                                    :items="tipos"
                                    label="Categoria"
                                    hide-details="auto"
                                    v-model="listaEditada.tipo"
                                    :menu-props="{
                                        offsetY: true,
                                    }"
                                >
                                    <template v-slot:append-outer>
                                        <v-btn icon x-small>
                                            <v-icon
                                                >mdi-help-circle-outline</v-icon
                                            >
                                        </v-btn>
                                    </template>
                                </v-select>
                            </v-col>
                            <v-col cols="12">
                                <v-textarea
                                    outlined
                                    dense
                                    rows="2"
                                    label="Descrição (opcional)"
                                    hide-details="auto"
                                    v-model="listaEditada.descricao"
                                ></v-textarea>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12">
                                <v-expansion-panels
                                    accordion
                                    flat
                                    v-model="panels"
                                    multiple
                                >
                                    <v-expansion-panel class="transparent">
                                        <v-expansion-panel-header
                                            class="px-0"
                                            hide-actions
                                        >
                                            <astro-divider class="text-center">
                                                <v-icon
                                                    >mdi-account-group</v-icon
                                                >
                                                Usuarios
                                            </astro-divider>
                                        </v-expansion-panel-header>
                                        <v-expansion-panel-content>
                                            <v-row>
                                                <template
                                                    v-if="
                                                        listaEditada.usuarios
                                                            .length > 0
                                                    "
                                                >
                                                    <v-col cols="12">
                                                        <v-list-item
                                                            v-for="(
                                                                usuario, index
                                                            ) in listaEditada.usuarios"
                                                            :key="usuario.email"
                                                        >
                                                            <v-list-item-content>
                                                                <v-list-item-title>
                                                                    {{
                                                                        usuario.nome
                                                                    }}
                                                                    -
                                                                    <small
                                                                        >({{
                                                                            usuario.slug
                                                                        }})
                                                                    </small>
                                                                </v-list-item-title>
                                                                <v-list-item-subtitle>
                                                                    {{
                                                                        usuario.email
                                                                    }}
                                                                </v-list-item-subtitle>
                                                            </v-list-item-content>
                                                            <v-list-item-action>
                                                                <v-btn
                                                                    x-small
                                                                    color="danger darken-2 elevation-0"
                                                                    fab
                                                                    dark
                                                                    tile
                                                                    class="
                                                                        rounded
                                                                    "
                                                                    @click="
                                                                        deletarUsuario(
                                                                            index
                                                                        )
                                                                    "
                                                                    ><v-icon
                                                                        >mdi-delete</v-icon
                                                                    ></v-btn
                                                                >
                                                            </v-list-item-action>
                                                        </v-list-item>
                                                    </v-col>
                                                </template>
                                                <v-col
                                                    cols="12"
                                                    class="text-center"
                                                >
                                                    <p
                                                        v-if="
                                                            listaEditada
                                                                .usuarios
                                                                .length === 0
                                                        "
                                                    >
                                                        Não há usuarios
                                                    </p>
                                                    <contas-criar-usuario
                                                        @adicionar="addUsuario"
                                                    ></contas-criar-usuario>
                                                </v-col>
                                            </v-row>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                    <v-expansion-panel class="transparent">
                                        <v-expansion-panel-header
                                            hide-actions
                                            class="px-0"
                                        >
                                            <astro-divider class="text-center">
                                                <v-icon
                                                    >mdi-account-group</v-icon
                                                >
                                                Categorias
                                            </astro-divider>
                                        </v-expansion-panel-header>
                                        <v-expansion-panel-content>
                                            <v-row>
                                                <v-col cols="12">
                                                    <v-text-field
                                                        outlined
                                                        append-outer-icon="mdi-minus-circle"
                                                        :prepend-icon="`mdi-numeric-${
                                                            index + 1
                                                        }-circle`"
                                                        @click:append-outer="
                                                            deletarCategoria(
                                                                index
                                                            )
                                                        "
                                                        dense
                                                        hide-details="auto"
                                                        class="mb-2"
                                                        v-model="
                                                            listaEditada
                                                                .categorias[
                                                                index
                                                            ]
                                                        "
                                                        v-for="(
                                                            categoria, index
                                                        ) in listaEditada.categorias"
                                                        :key="index"
                                                    >
                                                    </v-text-field>
                                                    <v-btn
                                                        block
                                                        plain
                                                        @click="addCategoria"
                                                        ><v-icon
                                                            >mdi-plus-circle</v-icon
                                                        ></v-btn
                                                    >
                                                </v-col>
                                            </v-row>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-app-bar
            height="90"
            app
            fixed
            bottom
            :style="{ top: 'inherit' }"
            class="pb-4"
        >
            <v-container>
                <v-row class="mb-4">
                    <v-col cols="6">
                        <v-btn
                            :to="{ name: 'contas-detalhes' }"
                            dark
                            color="danger darken-2"
                            large
                            block
                            >Cancelar
                            <v-icon right>mdi-close</v-icon>
                        </v-btn>
                    </v-col>
                    <v-col cols="6">
                        <v-btn
                            @click="salvarLista"
                            color="success darken-2"
                            large
                            :loading="loading"
                            block
                            :disabled="!foiAlterado"
                            >Salvar
                            <v-icon right>mdi-check</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-app-bar>
    </v-container>
</template>

<script>
import AstroDivider from "@/components/layout/AstroDivider.vue";
import ContasCriarUsuario from "@/components/astrolista/ContasCriarUsuario.vue";
import AstroSeletorFoto from "@/components/astrolista/AstroSeletorFoto.vue";
export default {
    components: {
        ContasCriarUsuario,
        AstroDivider,
        AstroSeletorFoto,
    },
    props: {
        lista: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            listaEditada: {
                nome: "",
                descricao: "",
                usuarios: [],
                tipo: "contas",
                categorias: ["Moradia", "Alimentação", "Lazer", "Outros"],
            },
            foto: null,
            tipos: ["contas", "mercado"],
            loading: false,
            panels: [0, 1, 2],
            categorias: ["Moradia", "Alimentação", "Lazer", "Outros"],
            mercados: ["Mercadona", "Caprabo", "Carrefour", "Outro"],
        };
    },
    computed: {
        foiAlterado() {
            const novalista = JSON.parse(JSON.stringify(this.lista));
            delete novalista.itens;
            return (
                JSON.stringify(this.listaEditada) !==
                    JSON.stringify(novalista) || this.foto
            );
        },
        titulares() {
            return this.listaEditada.usuarios.map((usuario) => usuario.email);
        },
        novalista() {
            return { ...this.listaEditada, titulares: this.titulares };
        },
    },
    methods: {
        addUsuario(usuario) {
            this.listaEditada.usuarios.push(usuario);
            this.listaEditada.usuarios.sort((a, b) => {
                return a.slug.localeCompare(b.slug);
            });
        },
        deletarUsuario(index) {
            this.listaEditada.usuarios.splice(index, 1);
        },
        selecionarFoto(foto) {
            this.foto = foto;
        },
        salvarLista() {
            this.loading = true;
            const lista = this.novalista;
            delete lista.contasProgramadas;
            this.$store
                .dispatch("appcontas/lista/salvarListaEditada", {
                    lista,
                    foto: this.foto,
                })
                .then(({ msg, result }) => {
                    if (result) {
                        console.log(msg);
                        this.$router.replace({
                            name: "contas-detalhes",
                        });
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        deletarCategoria(index) {
            this.listaEditada.categorias.splice(index, 1);
        },
        addCategoria() {
            this.listaEditada.categorias.push("");
        },
    },
    watch: {
        "listaEditada.tipo"(newValue) {
            switch (newValue) {
                case "mercado":
                    this.listaEditada.categorias = this.mercados;
                    break;

                default:
                    this.listaEditada.categorias = this.categorias;
                    break;
            }
        },
    },
    mounted() {
        const novalista = JSON.parse(JSON.stringify(this.lista));
        delete novalista.itens;
        this.listaEditada = JSON.parse(JSON.stringify(novalista));

        switch (this.listaEditada.tipo) {
            case "mercado":
                this.mercados = this.listaEditada.categorias;
                break;

            default:
                this.categorias = this.listaEditada.categorias;
                break;
        }
    },
};
</script>

<style>
.borderBottom {
    border-bottom: 1px solid rgba(222, 222, 222, 0.25);
}
</style>