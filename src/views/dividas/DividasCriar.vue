<template>
    <div>
        <v-toolbar dark color="primary gradient" dense>
            <v-btn icon class="ml-0" :to="{ name: 'contas' }" exact>
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-toolbar-title> Novo creditário </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon class="mr-0">
                <v-icon>mdi-help-circle-outline</v-icon>
            </v-btn>
        </v-toolbar>
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-card flat>
                        <v-card-title class="justify-center">
                            Detalhes
                        </v-card-title>
                        <v-card-text>
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field
                                        filled
                                        label="Nome"
                                        dense
                                        v-model="crediario.nome"
                                        hide-details="auto"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field
                                        filled
                                        label="valor"
                                        hide-details="auto"
                                        dense
                                        type="number"
                                        v-model.number="crediario.valor"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <v-card-title class="justify-center">
                            Usuarios
                        </v-card-title>
                        <v-card-text>
                            <v-row>
                                <v-col
                                    cols="12"
                                    v-if="crediario.usuarios.length > 0"
                                >
                                    <v-list-item
                                        v-for="(
                                            user, index
                                        ) in crediario.usuarios"
                                        :key="index"
                                    >
                                        <v-list-item-avatar
                                            dark
                                            color="primary"
                                            class="gradient"
                                        >
                                            <span class="white--text">
                                                {{ user.nome.charAt(0) }}</span
                                            >
                                        </v-list-item-avatar>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                {{ user.nome }}
                                            </v-list-item-title>
                                            <v-list-item-subtitle>
                                                {{ user.email }}
                                            </v-list-item-subtitle>
                                        </v-list-item-content>
                                        <v-list-item-action>
                                            <v-btn
                                                icon
                                                @click="removeUsuario(index)"
                                            >
                                                <v-icon> mdi-close </v-icon>
                                            </v-btn>
                                        </v-list-item-action>
                                    </v-list-item>
                                </v-col>
                                <v-col cols="12" class="text-center">
                                    <contas-criar-usuario
                                        @adicionar="adicionarUsuario"
                                    >
                                        <template v-slot="{ id }">
                                            <v-btn
                                                color="primary"
                                                large
                                                :id="id"
                                                outlined
                                            >
                                                <v-icon left>mdi-plus</v-icon>
                                                Adicionar usuario
                                            </v-btn>
                                        </template>
                                    </contas-criar-usuario>
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <v-card-text>
                            <v-row>
                                <v-col v-if="false" cols="12">
                                    <astro-divider></astro-divider>
                                </v-col>
                                <v-col cols="12">
                                    <v-btn
                                        block
                                        :disabled="!crediarioValido"
                                        color="success"
                                        x-large
                                        :id="id"
                                    >
                                        Começar crediário
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import ContasCriarUsuario from "@/components/astrolista/ContasCriarUsuario.vue";
import AstroDivider from "@/components/layout/AstroDivider.vue";

export default {
    components: { ContasCriarUsuario, AstroDivider },
    data() {
        return {
            crediario: {
                nome: null,
                valor: null,
                usuarios: [],
            },
        };
    },
    computed: {
        usuario() {
            return this.$store.state.auth.usuario;
        },
        crediarioValido() {
            const nome = this.crediario.nome && this.crediario.nome !== "";
            const valor = this.crediario.valor && this.crediario.nome !== 0;
            const usuarios =
                this.crediario.usuarios && this.crediario.usuarios.length > 0;
            return nome && valor && usuarios;
        },
    },
    methods: {
        removeUsuario(index) {
            this.crediario.usuarios.splice(index, 1);
        },
        adicionarUsuario(usuario) {
            this.crediario.usuarios.push(usuario);
        },
        criarCrediario() {
            this.$store.dispatch("appcrediario");
        },
    },
    mounted() {},
};
</script>

<style>
</style>