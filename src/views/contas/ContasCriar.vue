<template>
    <div>
        <v-container class="pa-5" :style="{ maxWidth: '500px' }">
            <v-row>
                <v-col cols="12">
                    <!-- HEADER -->
                    <div>
                        <h2>Criar nova lista</h2>
                    </div>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <!-- CONTENT -->
                    <div v-show="true">
                        <!-- NOME DA LISTA -->
                        <div>
                            <!-- <h3>Nome da lista</h3> -->
                            <v-text-field
                                class="mx-auto text-left"
                                v-model="lista.nome"
                                placeholder="Digite um nome para a sua lista"
                                label="Nome da lista"
                                outlined
                                hide-details="auto"
                            ></v-text-field>
                        </div>
                        <!-- USUARIOS -->
                        <div>
                            <v-subheader> Usuarios: </v-subheader>
                            <astro-lista-itens
                                :itens="lista.usuarios"
                                @item:deletar="deletarItem"
                                @item:editar="editarItem"
                                ref="astrolistauser"
                                itemTitulo="nome"
                                icon="mdi-account"
                                itemSubtitulo="email"
                                :btnCheck="false"
                                :btnInfo="false"
                            >
                                <template v-slot:itemTitulo="{ item }">
                                    {{ item.nome }} - ({{ item.slug }})
                                </template>
                            </astro-lista-itens>
                        </div>
                    </div>
                </v-col>
            </v-row>
            <!-- ADICIONAR USUARIOS -->
            <v-row>
                <v-col class="text-center">
                    <v-btn
                        class="gradient"
                        color="primary"
                        v-show="!showNovo"
                        @click="showNovo = true"
                    >
                        <v-icon class="mr-2"> mdi-account-plus </v-icon>
                        Adicionar usuario</v-btn
                    >
                </v-col>
            </v-row>
            <!-- SUBMIT LISTA -->
            <v-row justify="center">
                <v-col class="text-center">
                    <v-btn
                        x-large
                        color="success"
                        class="gradient"
                        :disabled="!isListaValida"
                        @click="formatarNovaLista"
                    >
                        <v-icon class="mr-2"> save </v-icon>
                        Criar lista</v-btn
                    >
                </v-col>
            </v-row>
        </v-container>
        <!-- ADICIONAR NOVO ITEM -->
        <v-dialog max-width="400" v-model="showNovo">
            <v-card>
                <v-card-title>
                    <h4>Adicionar usuario</h4>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <div>
                                    <v-text-field
                                        class="mx-auto"
                                        label="Nome"
                                        v-model="novoUsuario.nome"
                                    ></v-text-field>
                                    <v-text-field
                                        class="mx-auto"
                                        label="Slug"
                                        v-model="novoUsuario.slug"
                                    ></v-text-field>
                                    <v-text-field
                                        class="mx-auto"
                                        label="Email"
                                        v-model="novoUsuario.email"
                                    ></v-text-field>
                                </div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <div class="d-flex justify-left align-center">
                                    <v-avatar
                                        size="40px"
                                        color="primary"
                                        class="mr-4"
                                    >
                                        <v-icon dark> mdi-account </v-icon>
                                    </v-avatar>
                                    <div>
                                        <h3>
                                            {{ novoUsuario.nome }}
                                            <span
                                                v-if="novoUsuario.slug !== ''"
                                            >
                                                - ({{ novoUsuario.slug }})</span
                                            >
                                        </h3>
                                        <small>{{ novoUsuario.email }}</small>
                                    </div>
                                </div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-btn
                                    class="my-3"
                                    type="gradient"
                                    :disabled="!isNovoValido"
                                    @click="adicionarNovoUsuario"
                                    >Salvar novo usuario</v-btn
                                >
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>
        <!-- EDITAR ITEM -->
        <v-dialog max-width="400" v-model="editar.ativo">
            <v-card v-if="editar.index !== -1">
                <v-card-title>
                    <h4>Editar usuario</h4>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field
                                    class="mx-auto"
                                    label="Nome"
                                    v-model="editar.item.nome"
                                ></v-text-field>
                                <v-text-field
                                    class="mx-auto"
                                    label="Slug"
                                    v-model="editar.item.slug"
                                ></v-text-field>
                                <v-text-field
                                    class="mx-auto"
                                    label="Email"
                                    v-model="editar.item.email"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <div class="d-flex justify-left items-center">
                                    <v-avatar
                                        class="mr-2"
                                        size="40px"
                                        color="primary"
                                    >
                                        <v-icon dark>
                                            mdi-account</v-icon
                                        ></v-avatar
                                    >
                                    <div>
                                        <h3>
                                            {{ editar.item.nome }}
                                            <span
                                                v-if="editar.item.slug !== ''"
                                            >
                                                - ({{ editar.item.slug }})</span
                                            >
                                        </h3>
                                        <small>{{ editar.item.email }}</small>
                                    </div>
                                </div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-btn
                                    :disabled="!isEditarValido"
                                    @click.native="salvarUsuario"
                                    class="mt-2 mx-auto"
                                    type="gradient"
                                    color="primary"
                                >
                                    <v-icon class="mr-2"> check</v-icon>
                                    Salvar</v-btn
                                >
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import AstroListaItens from "@/components/astrolista/AstroListaItens.vue";
export default {
    name: "contas-criar",
    components: { AstroListaItens },
    data() {
        return {
            lista: {
                nome: "",
                usuarios: [],
            },
            editar: {
                index: -1,
                ativo: false,
                item: {},
            },
            novoUsuario: {
                nome: "",
                slug: "",
                email: "",
            },
            showNovo: false,
            showCriarLista: false,
        };
    },
    computed: {
        isNovoValido() {
            return (
                this.novoUsuario.nome !== "" &&
                this.novoUsuario.slug !== "" &&
                this.novoUsuario.email !== ""
            );
        },
        isEditarValido() {
            return (
                this.editar.item.nome !== "" &&
                this.editar.item.slug !== "" &&
                this.editar.item.email !== ""
            );
        },
        isListaValida() {
            return this.lista.nome !== "" && this.lista.usuarios.length > 0;
        },
    },
    watch: {
        "novoUsuario.slug"(newValue) {
            this.novoUsuario.slug = newValue.toLowerCase();
        },
        "novoUsuario.email"(newValue) {
            this.novoUsuario.email = newValue.toLowerCase();
        },
        "editar.item.slug"(newValue) {
            this.editar.item.slug = newValue.toLowerCase();
        },
        "editar.item.email"(newValue) {
            this.editar.item.email = newValue.toLowerCase();
        },
    },
    methods: {
        deletarItem({ index }) {
            this.lista.usuarios.splice(index, 1);
        },
        editarItem({ item, index }) {
            this.editar.ativo = true;
            this.editar.index = index;
            this.editar.item = { ...item };
        },
        adicionarNovoUsuario() {
            this.lista.usuarios.push(this.novoUsuario);
            this.resetarNovoUsuario();
            this.showNovo = false;
        },
        resetarNovoUsuario() {
            this.novoUsuario = {
                nome: "",
                slug: "",
                email: "",
            };
        },
        salvarUsuario() {
            this.lista.usuarios[this.editar.index] = { ...this.editar.item };
            this.$refs.astrolistauser.onSwipe("left", this.editar.index);
            this.editar.ativo = false;
            this.editar.index = -1;
            this.editar.item = {};
        },
        formatarNovaLista() {
            const lista = {};
            lista.nome = this.lista.nome;
            lista.criadaEm = Date.now();
            const usuarios = {};
            const titulares = [];

            this.lista.usuarios.forEach((usuario) => {
                usuarios[usuario.slug] = {
                    nome: usuario.nome,
                    slug: usuario.slug,
                    email: usuario.email,
                };
                titulares.push(usuario.email);
            });

            lista.usuarios = usuarios;
            lista.titulares = titulares;
            this.salvarNovaLista(lista);
            console.log(lista);
        },
        salvarNovaLista(lista) {
            this.$store
                .dispatch("appcontas/listas/salvarNovaLista", { lista })
                .then(({ msg, result, data }) => {
                    if (result) {
                        console.log(msg);
                        this.$router.push({
                            name: "contas-id",
                            params: { id: data.id },
                        });
                    }
                });
        },
    },
    mounted() {
        const logUser = {
            nome: this.$store.state.auth.usuario.displayName.split(" ")[0],
            slug: this.$store.state.auth.usuario.displayName
                .substr(0, 4)
                .toLowerCase(),
            email: this.$store.state.auth.usuario.email,
        };
        this.lista.usuarios.push(logUser);
    },
};
</script>

<style>
</style>