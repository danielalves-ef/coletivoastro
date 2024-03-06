<template>
    <v-dialog
        max-width="400"
        v-if="item"
        v-model="active"
        :fullscreen="$isMobile"
    >
        <v-card>
            <v-toolbar>
                <v-toolbar-title>
                    {{ item.conceito }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn @click="fechar" icon>
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text>
                <v-subheader class="primary gradient mt-5 rounded-lg">
                    <h4 class="white--text">
                        <v-icon class="mr-2" color="white">list</v-icon> Info
                        geral
                    </h4>
                </v-subheader>
                <v-list>
                    <!-- CONCEITO -->
                    <v-list-item dense>
                        <v-list-item-icon class="mr-3">
                            <v-icon>{{ item.icone }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>
                                {{ item.id }}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item dense>
                        <v-list-item-icon class="mr-3">
                            <v-icon>{{ item.today }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>
                                {{ item.dataText }}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <!-- VALOR -->
                    <!-- CONCEITO -->
                    <v-list-item dense>
                        <v-list-item-icon class="mr-3">
                            <v-icon>{{ item.icone }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>
                                {{ item.conceito }}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <!-- VALOR -->
                    <v-list-item dense>
                        <v-list-item-icon class="mr-3">
                            <v-icon>euro</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>
                                {{ item.valor | euros }}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <!-- QUEM PAGOU -->
                    <v-list-item dense>
                        <v-list-item-icon class="mr-3">
                            <v-icon>payment</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>
                                Pago por {{ item.quemPagou | capitalize }}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <!-- MES -->
                    <v-list-item dense>
                        <v-list-item-icon class="mr-3">
                            <v-icon>today</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>
                                {{ item.mesText }}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                <v-subheader class="primary gradient rounded-lg">
                    <h4 class="white--text">
                        <v-icon class="mr-2" color="white">group</v-icon>
                        Pagadores
                    </h4>
                </v-subheader>
                <v-list>
                    <v-list-item
                        dense
                        v-for="(div, pagador) in item.pagamento"
                        :key="pagador"
                        :style="{ opacity: item.divisao[pagador] ? '' : '0.4' }"
                    >
                        <v-list-item-avatar>
                            <v-avatar color="primary" class="gradient">
                                <v-icon color="white"> person </v-icon>
                            </v-avatar>
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-title>
                                {{ pagador | capitalize }}
                            </v-list-item-title>
                            <v-list-item-subtitle
                                >{{ item.divisao[pagador] | euros }}
                            </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-icon>
                            <v-icon :color="div ? 'success' : 'danger'">{{
                                div ? "check_circle" : "cancel"
                            }}</v-icon>
                        </v-list-item-icon>
                    </v-list-item>
                </v-list>
                <v-card-actions class="justify-space-between">
                    <v-btn @click="fechar">
                        <v-icon class="mr-2"> close </v-icon>
                        Fechar
                    </v-btn>
                    <v-btn @click="editar" color="primary">
                        <v-icon class="mr-2"> edit </v-icon>
                        Editar
                    </v-btn>
                </v-card-actions>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: "astro-show-conta",
    props: {},
    data() {
        return {
            active: true,
            item: null,
            index: -1,
        };
    },
    watch: {
        active(newValue) {
            if (newValue === false) {
                this.fechar();
            }
        },
    },
    methods: {
        open({ item, index }) {
            this.item = JSON.parse(JSON.stringify(item));
            this.active = true;
            this.index = index;
        },
        fechar() {
            this.active = false;
        },
        editar() {
            this.$emit("item:editar", { item: this.item });
            this.fechar();
        },
        isEmpty(item, pagador) {
            return Number(item.divisao[pagador]) > 0;
        },
        salvar({ item }) {
            console.log(item);
        },
    },
};
</script>

<style>
</style>