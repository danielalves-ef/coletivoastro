<template>
    <div>
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-expansion-panels v-model="indexAberto">
                        <v-expansion-panel
                            v-for="painel in paineis"
                            :key="painel.nome"
                            :id="painel.nome"
                        >
                            <v-expansion-panel-header
                                class="pa-0 pr-4 elevation-4"
                            >
                                <template v-slot="{ open }">
                                    <div
                                        class="px-4 py-2"
                                        :style="{
                                            boxShadow: open
                                                ? 'currentcolor -2px 0px 0px 0px'
                                                : '',
                                        }"
                                    >
                                        <v-avatar
                                            size="40"
                                            :color="painel.cor"
                                            class="gradient mr-2"
                                        >
                                            <v-icon dark>{{
                                                painel.icone
                                            }}</v-icon>
                                        </v-avatar>
                                        Tema
                                    </div>
                                </template>
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <component :is="painel.componente"></component>
                                <!-- <ajustes-personalizar></ajustes-personalizar> -->
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <table
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        width="100%"
                        style="color: #716da6; font-size: 16px"
                    >
                        <td
                            align="center"
                            bgcolor="#ffffff"
                            style="padding: 40px 0 30px 0"
                        >
                            <img
                                src="https://firebasestorage.googleapis.com/v0/b/coletivoastro.appspot.com/o/astro%2Fastrologo.png?alt=media&token=97eae1f4-30cb-4299-9daf-66f45e47a022"
                                alt="Criando Mágica de E-mail"
                                width="150"
                                style="display: block"
                            />
                        </td>
                        <tr>
                            <td
                                bgcolor="#ffffff"
                                align="center"
                                style="color: #000000; font-size: 26px"
                            >
                                Coletivo Astro
                            </td>
                        </tr>
                        <tr>
                            <td
                                bgcolor="#ffffff"
                                align="center"
                                style="color: #616161; font-size: 12px"
                            >
                                App Contas
                            </td>
                        </tr>
                        <tr>
                            <td
                                bgcolor="#ffffff"
                                align="center"
                                style="
                                    color: #000000;
                                    font-size: 16px;
                                    padding: 0px 10px;
                                "
                            >
                                Você foi adicionado na lista 'Contas de casa'
                            </td>
                        </tr>

                        <tr>
                            <td
                                bgcolor="#ffffff"
                                align="center"
                                style="
                                    color: #000000;
                                    font-size: 16px;
                                    padding: 20px;
                                "
                            >
                                <button
                                    style="
                                        background-color: #716da6;
                                        font-size: 16px;
                                        color: #ffffff;
                                        padding: 12px 10px;
                                        border-radius: 10px;
                                    "
                                >
                                    Clique aqui para abrir a lista
                                </button>
                            </td>
                        </tr>
                    </table>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import AjustesPersonalizar from "@/components/ajustes/AjustesPersonalizar.vue";
export default {
    name: "ajuda",
    components: { AjustesPersonalizar },
    computed: {
        hash() {
            return this.$route.hash;
        },
    },

    data() {
        return {
            paineis: [
                {
                    nome: "tema",
                    hash: "tema",
                    componente: "ajustes-personalizar",
                    icone: "mdi-monitor-dashboard",
                    cor: "primary",
                },
            ],
            indexAberto: -1,
        };
    },
    methods: {
        getHashFromUrl() {
            if (this.hash) {
                const index = this.paineis.findIndex((item) => {
                    const itemhash = "#" + item.hash;
                    return itemhash === this.hash;
                });
                if (index !== -1) {
                    this.indexAberto = index;
                }
            }
        },
    },
    mounted() {
        this.getHashFromUrl();
    },
};
</script>

<style>
</style>