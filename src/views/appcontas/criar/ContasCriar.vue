<template>
    <div>
        <v-toolbar dark color="primary gradient" dense>
            <v-btn icon class="ml-0" :to="{ name: 'contas' }" exact>
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-toolbar-title> Criar Lista </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon class="mr-0">
                <v-icon>mdi-help-circle-outline</v-icon>
            </v-btn>
        </v-toolbar>
        <v-container>
            <v-row>
                <v-col cols="12">
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
                                        v-model="lista.nome"
                                        placeholder="ex: contas de casa"
                                    >
                                    </v-text-field>
                                    <v-select
                                        outlined
                                        dense
                                        :items="tipos"
                                        label="Categoria"
                                        hide-details="auto"
                                        v-model="lista.tipo"
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
                                        v-model="lista.descricao"
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
                                                <astro-divider
                                                    class="text-center"
                                                >
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
                                                            lista.usuarios
                                                                .length > 0
                                                        "
                                                    >
                                                        <v-col cols="12">
                                                            <v-list-item
                                                                v-for="(
                                                                    usuario,
                                                                    index
                                                                ) in lista.usuarios"
                                                                :key="
                                                                    usuario.email
                                                                "
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
                                                                lista.usuarios
                                                                    .length ===
                                                                0
                                                            "
                                                        >
                                                            Não há usuarios
                                                        </p>
                                                        <contas-criar-usuario
                                                            @adicionar="
                                                                addUsuario
                                                            "
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
                                                <astro-divider
                                                    class="text-center"
                                                >
                                                    <span
                                                        v-if="
                                                            lista.tipo ===
                                                            'mercado'
                                                        "
                                                    >
                                                        <v-icon
                                                            >mdi-store</v-icon
                                                        >
                                                        Mercados
                                                    </span>
                                                    <span v-else>
                                                        <v-icon
                                                            >mdi-shape</v-icon
                                                        >
                                                        Categorias
                                                    </span>
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
                                                                lista
                                                                    .categorias[
                                                                    index
                                                                ]
                                                            "
                                                            v-for="(
                                                                categoria, index
                                                            ) in lista.categorias"
                                                            :key="index"
                                                        >
                                                        </v-text-field>
                                                        <v-btn
                                                            block
                                                            plain
                                                            @click="
                                                                addCategoria
                                                            "
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
        </v-container>
        <!-- <v-bottom-navigation app height="70">
            <v-btn
                :disabled="!estaValida"
                color="success darken-2"
                block
                large
                :loading="loading"
            >
                <span>
                    Criar Lista
                    <v-icon right>mdi-check</v-icon>
                </span>
            </v-btn>
        </v-bottom-navigation> -->
        <v-app-bar height="70" app fixed bottom :style="{ top: 'inherit' }">
            <v-spacer></v-spacer>
            <v-btn
                @click="criarLista"
                :disabled="!estaValida"
                color="success darken-2"
                block
                large
                class="mb-4"
                :loading="loading"
            >
                Criar Lista
                <v-icon right>mdi-check</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
        </v-app-bar>
    </div>
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
    data() {
        return {
            lista: {
                nome: "",
                descricao: "",
                usuarios: [],
                tipo: "contas",
                categorias: ["Moradia", "Alimentação", "Lazer", "Outros"],
                archivada: false,
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
        titulares() {
            return this.lista.usuarios.map((usuario) => usuario.email);
        },
        novalista() {
            return {
                ...this.lista,
                titulares: this.titulares,
                criadoPor: this.$auth.currentUser.email,
                archivada: false,
            };
        },
        estaValida() {
            return (
                this.lista.nome !== "" &&
                this.lista.usuarios.length > 0 &&
                this.lista.usuarios.find(
                    (u) => u.email === this.$auth.currentUser.email
                )
            );
        },
    },
    methods: {
        addUsuario(usuario) {
            this.lista.usuarios.push(usuario);
            this.lista.usuarios.sort((a, b) => {
                return a.slug.localeCompare(b.slug);
            });
        },
        deletarUsuario(index) {
            this.lista.usuarios.splice(index, 1);
        },
        selecionarFoto(foto) {
            this.foto = foto;
        },
        criarLista() {
            this.loading = true;
            const lista = this.novalista;
            this.$store
                .dispatch("appcontas/listas/salvarNovaLista", {
                    lista,
                    foto: this.foto,
                })
                .then(({ msg, result, data }) => {
                    if (result) {
                        console.log(msg);
                        this.$router.push({
                            name: "contas-id",
                            params: { id: data.id },
                        });
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        deletarCategoria(index) {
            this.lista.categorias.splice(index, 1);
        },
        addCategoria() {
            this.lista.categorias.push("");
        },
    },
    watch: {
        "lista.tipo"(newValue) {
            switch (newValue) {
                case "mercado":
                    this.lista.categorias = this.mercados;
                    break;

                default:
                    this.lista.categorias = this.categorias;
                    break;
            }
        },
    },
};
</script>

<style>
.borderBottom {
    border-bottom: 1px solid rgba(222, 222, 222, 0.25);
}
</style>