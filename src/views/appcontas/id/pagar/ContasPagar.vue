<template>
    <div>
        <!-- <h1>Pagar</h1> -->
        <v-container>
            <v-row>
                <v-col cols="12 pt-0">
                    <v-subheader class="px-0">
                        <v-icon left>mdi-account-cash</v-icon>
                        Quem esta pagando?
                    </v-subheader>
                    <v-chip-group column v-model="pagadorAtual" mandatory>
                        <v-chip
                            v-for="user in usuarios"
                            :color="user.slug === pagadorAtual ? 'primary' : ''"
                            :key="user.slug"
                            label
                            :value="user.slug"
                            filter
                            filter-icon="mdi-account-check"
                        >
                            {{ $helpers.capitalize(user.slug) }}
                        </v-chip>
                        <v-chip
                            v-for="outro in outros"
                            :color="outro === pagadorAtual ? 'primary' : ''"
                            :key="outro"
                            :value="outro"
                            filter
                            filter-icon="mdi-account-check"
                        >
                            {{ $helpers.capitalize(outro) }}
                        </v-chip>
                    </v-chip-group>
                    <v-subheader class="px-0" v-if="contasParaPagar.length > 0">
                        <v-icon left>mdi-cash-check</v-icon>
                        Selecione as contas a pagar
                        <v-spacer></v-spacer>
                        <astro-button-ordenar></astro-button-ordenar
                    ></v-subheader>

                    <v-list subheader class="mt-2">
                        <template v-if="contasParaPagar.length > 0">
                            <v-list-item link>
                                <v-list-item-action>
                                    <v-checkbox
                                        v-model="todosSelecionados"
                                        color="primary lighten-2"
                                    ></v-checkbox>
                                </v-list-item-action>
                                <v-list-item-title
                                    @click="clickSelecionarTodos"
                                >
                                    <v-icon left>mdi-check-all</v-icon>
                                    Selecionar todas</v-list-item-title
                                >
                            </v-list-item>
                            <astro-divider></astro-divider>
                            <v-list-item-group
                                v-model="contasSelecionadas"
                                multiple
                            >
                                <v-slide-x-transition group mode="out-in">
                                    <v-list-item
                                        v-for="item in contasParaPagar"
                                        :key="item.id"
                                        :value="item"
                                        class="my-1"
                                    >
                                        <template v-slot:default="{ active }">
                                            <v-list-item-action>
                                                <v-checkbox
                                                    :input-value="active"
                                                    color="primary lighten-2"
                                                ></v-checkbox>
                                            </v-list-item-action>
                                            <v-list-item-avatar>
                                                <v-icon left>{{
                                                    item.icone
                                                }}</v-icon>
                                            </v-list-item-avatar>
                                            <v-list-item-content>
                                                <v-list-item-title>{{
                                                    item.conceito
                                                }}</v-list-item-title>
                                                <v-list-item-subtitle>
                                                    <small
                                                        v-html="
                                                            contaSubtitulo(item)
                                                        "
                                                    >
                                                        <!-- {{
                                                    $helpers.toMoney(item.valor)
                                                }} -->
                                                    </small>
                                                </v-list-item-subtitle>
                                            </v-list-item-content>
                                            <v-list-item-action-text
                                                class="text-center"
                                            >
                                                {{
                                                    $helpers.toMoney(
                                                        parteCadaUsuario(
                                                            item,
                                                            pagadorAtual
                                                        )
                                                    )
                                                }}
                                                <br />
                                                cada
                                            </v-list-item-action-text>
                                        </template>
                                    </v-list-item>
                                </v-slide-x-transition>
                            </v-list-item-group>
                        </template>
                        <template v-else>
                            <v-subheader>
                                {{ $helpers.capitalize(pagadorAtual) }} não tem
                                contas a pagar
                            </v-subheader>
                        </template>
                    </v-list>
                </v-col>
                <v-col cols="12">
                    <v-alert
                        dense
                        v-if="contasSelecionadas.length > 0"
                        color="primary"
                        text
                        class="text-center"
                    >
                        {{ textoConfirmacao }}
                    </v-alert>
                    <v-fade-transition>
                        <v-btn
                            v-if="contasParaPagar.length > 0"
                            @click="pagarItens"
                            :disabled="contasSelecionadas.length == 0"
                            block
                            :loading="pagarBtn === 'loading'"
                            color="primary gradient"
                            x-large
                            >Pagar
                        </v-btn>
                    </v-fade-transition>
                </v-col>
                <v-snackbar
                    :color="snackbar.color"
                    v-model="snackbar.active"
                    timeout="3000"
                    app
                    text
                >
                    {{ snackbar.text }}</v-snackbar
                >
            </v-row>
        </v-container>
    </div>
</template>

<script>
import AstroButtonOrdenar from "@/components/astrolista/AstroButtonOrdenar.vue";
import AstroDivider from "@/components/layout/AstroDivider.vue";
export default {
    components: { AstroButtonOrdenar, AstroDivider },
    props: {
        lista: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            date: null,
            pagadorAtual: null,
            contasSelecionadas: [],
            pagarBtn: "default",
            snackbar: {
                text: "",
                active: false,
                color: "primary",
            },
            todosSelecionados: false,
        };
    },
    computed: {
        textoConfirmacao() {
            const usuario = this.$helpers.capitalize(this.pagadorAtual);
            const itens = this.contasSelecionadas.length;
            return `${usuario} esta pagando ${itens} ${
                itens === 1 ? "item" : "itens"
            }`;
        },
        usuarios() {
            return this.lista.usuarios;
        },
        outros() {
            const outros = [];
            const usuarios = this.lista.usuarios.map((u) => u.slug);
            this.lista.itens.forEach((item) => {
                item.pagamento.forEach((pag) => {
                    if (!usuarios.includes(pag.slug)) {
                        if (!pag.pagamento) {
                            if (!outros.includes(pag.slug)) {
                                outros.push(pag.slug);
                            }
                        }
                    }
                });
            });
            return outros;
        },
        parteCadaUsuario() {
            return (item, pagadorAtual) => {
                const cada = item.pagamento.find(
                    (pag) => pag.slug === pagadorAtual
                );
                if (cada) {
                    return cada.divisao;
                }
                return 0;
            };
        },
        usuarioLogado() {
            const usuarioAuthEmail = this.$auth.currentUser.email;
            if (!usuarioAuthEmail) {
                return null;
            }
            const usuarioMatch = Object.values(this.lista.usuarios).find(
                (usuario) => {
                    return usuario.email === usuarioAuthEmail;
                }
            );
            return usuarioMatch.slug || null;
        },
        contasParaPagar() {
            if (!this.pagadorAtual) {
                return [];
            }
            return this.lista.itens.filter((item) => {
                const itemPagador = item.pagamento.find((pag) => {
                    return pag.slug === this.pagadorAtual && !pag.pagamento;
                });
                return itemPagador;
            });
        },
        totalParaPagar() {
            return this.contasSelecionadas.reduce((total, item) => {
                if (item.quemPagou === this.pagadorAtual) {
                    return total;
                }
                if (!total[item.quemPagou]) {
                    total[item.quemPagou] = item.divisao[this.pagadorAtual];
                } else {
                    total[item.quemPagou] += item.divisao[this.pagadorAtual];
                }
                return total;
            }, {});
        },
        textoBizum() {
            const arrayConceitos = this.contasSelecionadas.map((item) =>
                item.conceito.substr(0, 3)
            );
            const texto = arrayConceitos.join("+");

            return texto.substr(0, 35).toLowerCase();
        },
    },

    methods: {
        contaSubtitulo(item) {
            return `<strong> ${this.$helpers.toMoney(
                item.valor
            )}</strong> pago por <strong>${this.$helpers.capitalize(
                item.quemPagou
            )}</strong>`;
        },
        pagarItens() {
            this.pagarBtn = "loading";
            this.$store
                .dispatch("appcontas/lista/pagarItens", {
                    itens: this.contasSelecionadas,
                    pagador: this.pagadorAtual,
                })
                .then(() => {
                    this.contasSelecionadas = [];
                    this.pagarBtn = "default";
                    this.snackbar.text = "Contas marcadas como pagas";
                    this.snackbar.color = "success";
                    this.snackbar.active = true;
                    //   snack
                });
        },
        selecionarData(data) {
            this.date = data;
        },
        clickSelecionarTodos() {
            this.todosSelecionados = !this.todosSelecionados;
        },
        selecionarTodos(todos = true) {
            if (todos) {
                this.contasSelecionadas = this.contasParaPagar;
            } else {
                this.contasSelecionadas = [];
            }
        },
    },
    watch: {
        todosSelecionados(newValue) {
            if (newValue) {
                this.selecionarTodos();
            } else {
                this.selecionarTodos(false);
            }
        },
    },
    mounted() {
        window.scrollTo(0, 0);
    },
    created() {
        this.pagadorAtual = this.usuarioLogado;
        console.log({ contasPagar: this });
    },
};
</script>

<style>
</style>