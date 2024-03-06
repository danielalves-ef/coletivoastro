<template>
    <v-container>
        <!-- INFO GERAL -->
        <v-row v-if="false">
            <v-col cols="12">
                <v-list-item three-line link>
                    <v-list-item-avatar tile size="80" color="primary">
                        <v-icon color="white" size="50">$appcontas</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title class="text-h5 mb-1">
                            {{ lista.nome }}
                        </v-list-item-title>
                        <v-list-item-subtitle>{{
                            lista.descricao
                        }}</v-list-item-subtitle>
                        <v-list-item-subtitle>
                            <v-chip
                                color="primary"
                                label
                                x-small
                                class="mr-1"
                                >{{ lista.tipo }}</v-chip
                            >
                        </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-btn :to="{ name: 'contas-detalhes-editar' }" icon
                            ><v-icon>mdi-pencil</v-icon></v-btn
                        >
                    </v-list-item-action>
                </v-list-item>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="auto">
                <v-avatar class="rounded" tile size="90" color="primary"
                    ><v-img v-if="lista.fotoURL" :src="lista.fotoURL"></v-img>
                    <v-icon dark size="60" v-else>$appcontas</v-icon>
                </v-avatar>
            </v-col>

            <v-col class="pl-1">
                <div class="d-flex">
                    <span class="text-h6"> {{ lista.nome }}</span>
                    <v-spacer></v-spacer>
                    <v-btn small :to="{ name: 'contas-detalhes-editar' }" icon
                        ><v-icon>mdi-pencil</v-icon></v-btn
                    >
                </div>
                <p
                    class="text-caption mb-0 text--secondary"
                    :style="{ lineHeight: '1rem' }"
                >
                    {{ lista.descricao }}
                </p>
                <div>
                    <v-chip label color="primary" x-small>
                        {{ lista.tipo }}</v-chip
                    >
                </div>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12">
                <v-expansion-panels accordion flat v-model="tabs" multiple>
                    <v-expansion-panel class="transparent">
                        <v-expansion-panel-header
                            class="pa-0"
                            :style="{ minHeight: '40px' }"
                            hide-actions
                        >
                            <astro-divider class="text-center">
                                <v-icon>mdi-account-group</v-icon>
                                Usuarios
                            </astro-divider>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-list-item
                                v-for="usuario in lista.usuarios"
                                :key="usuario.email"
                                class="px-0"
                            >
                                <v-list-item-avatar color="primary">
                                    <small class="white--text">
                                        {{ usuario.slug }}
                                    </small>
                                </v-list-item-avatar>
                                <v-list-item-content>
                                    <v-list-item-title>
                                        {{ usuario.nome }}
                                    </v-list-item-title>
                                    <v-list-item-subtitle>
                                        {{ usuario.email }}
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel class="transparent">
                        <v-expansion-panel-header hide-actions class="px-0">
                            <astro-divider class="text-center">
                                <span v-if="lista.tipo === 'mercado'">
                                    <v-icon>mdi-store</v-icon>
                                    Mercados
                                </span>
                                <span v-else>
                                    <v-icon>mdi-shape</v-icon>
                                    Categorias
                                </span>
                            </astro-divider>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <div class="text-center mb-1">
                                <v-chip
                                    v-for="(
                                        categoria, index
                                    ) in lista.categorias"
                                    :key="categoria"
                                    label
                                    class="ma-1"
                                >
                                    <v-icon left
                                        >mdi-numeric-{{
                                            index + 1
                                        }}-circle</v-icon
                                    >{{ categoria }}
                                </v-chip>
                            </div>
                            <!-- <v-list-item
                                v-for="(categoria, index) in lista.categorias"
                                :key="categoria"
                                dense
                            >
                                <v-list-item-icon>
                                    <v-icon
                                        >mdi-numeric-{{
                                            index + 1
                                        }}-circle-outline</v-icon
                                    >
                                </v-list-item-icon>
                                <v-list-item-title>
                                    {{ categoria }}
                                </v-list-item-title>
                            </v-list-item> -->
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel
                        v-if="lista.contasProgramadas.length > 0"
                        class="transparent"
                    >
                        <v-expansion-panel-header hide-actions class="px-0">
                            <astro-divider class="text-center">
                                <v-icon>mdi-folder-star</v-icon>
                                Contas programadas
                            </astro-divider>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-list-item
                                class="mx-n4"
                                v-for="tarefa in lista.contasProgramadas"
                                :key="tarefa.id"
                            >
                                <v-list-item-avatar color="primary">
                                    <v-icon dark>
                                        {{ tarefa.item.icone }}
                                    </v-icon>
                                </v-list-item-avatar>
                                <v-list-item-content>
                                    <v-list-item-title>
                                        {{ tarefa.item.conceito }}
                                    </v-list-item-title>
                                    <v-list-item-subtitle>
                                        € {{ tarefa.item.valor }}
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-action>
                                    <div>
                                        <v-btn
                                            icon
                                            color="danger"
                                            @click="deletarTarefa(tarefa.id)"
                                            ><v-icon>mdi-close</v-icon></v-btn
                                        >
                                    </div>
                                </v-list-item-action>
                            </v-list-item>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-col>
            <v-col cols="12" class="pt-0">
                <astro-divider class="text-center"> Ações </astro-divider>
            </v-col>
            <v-col v-if="false" cols="12">
                <v-btn color="danger darken-3" dark v-if="isCriador" block>
                    Deletar lista
                </v-btn>
                <v-btn color="danger darken-3" dark v-else block>
                    Sair da lista
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import AstroDivider from "@/components/layout/AstroDivider.vue";
export default {
    components: { AstroDivider },
    props: {
        lista: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            tabs: [0, 1, 2, 3],
        };
    },

    methods: {
        isCriador() {
            return this.lista.criadoPor === this.$auth.currentUser.email;
        },
        getContasProgramadas() {
            this.$store.dispatch("appcontas/lista/getContasProgramadas");
        },
        deletarTarefa(id) {
            this.$store
                .dispatch("appcontas/lista/deletarTarefa", id)
                .then(() => {
                    this.getContasProgramadas();
                })
                .catch((e) => {
                    this.$swal({
                        title: "Algo deu errado",
                        text: e,
                        icon: "error",
                    });
                });
        },
    },
    created() {
        window.scrollTo(0, 0);
        this.getContasProgramadas();
    },
};
</script>

<style>
</style>