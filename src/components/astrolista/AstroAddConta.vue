<template>
    <div>
        <!-- <div @click="novaContaPopup = true">
            <slot>
                <v-btn color="primary">Adicionar conta</v-btn>
            </slot>
        </div> -->

        <v-dialog max-width="500" v-model="novaContaPopup" scrollable>
            <template v-slot:activator="{ on, attrs }">
                <slot v-bind:evento="on" v-bind:atributos="attrs">
                    <v-btn v-on="on" v-bind="attrs" color="primary"
                        >Adicionar conta</v-btn
                    >
                </slot>
            </template>
            <v-card>
                <v-toolbar flat dense>
                    <v-toolbar-title>Adicionar nova conta</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn @click.stop="novaContaPopup = false" icon>
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                    <!-- FORM  -->
                    <v-container>
                        <!-- AVATAR Y MES -->
                        <v-row class="mt-3" justify="center" align="center">
                            <v-col class="pa-2 flex-grow-0">
                                <!-- DIALOG ICONE -->
                                <v-btn
                                    class="gradient"
                                    @click.stop="abrirSeletorIcone"
                                    fab
                                    ref="btnSeletorIcone"
                                    color="primary"
                                >
                                    <v-icon color="white">{{
                                        novaConta.icone
                                    }}</v-icon>
                                </v-btn>
                            </v-col>
                            <v-spacer></v-spacer>
                            <v-col class="pa-2" cols="6">
                                <v-select
                                    :items="meses"
                                    v-model="novaConta.mes"
                                    label="Mês"
                                    item-text="nome"
                                    item-value="mes"
                                    dense
                                    outlined
                                    hide-details
                                    append-icon="today"
                                ></v-select>
                            </v-col>
                        </v-row>
                        <!-- CONCEITO -->
                        <v-row class="mt-3">
                            <v-col class="pa-2" cols="12">
                                <v-text-field
                                    v-model="novaConta.conceito"
                                    outlined
                                    dense
                                    label="Conceito"
                                    :append-icon="novaConta.icone"
                                    @click:append.stop="iconPopup = true"
                                    hide-details="auto"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <!-- VALOR -->
                        <v-row class="mt-3">
                            <v-col class="pa-2" cols="12">
                                <v-text-field
                                    outlined
                                    dense
                                    type="number"
                                    label="Valor"
                                    append-icon="euro"
                                    hide-details="auto"
                                    v-model.number="novaConta.valor"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <!-- QUEM PAGOU -->
                        <v-row class="mt-3">
                            <v-col class="pa-2" cols="12">
                                <v-select
                                    :items="objetoUsuario"
                                    label="Quem pagou"
                                    dense
                                    outlined
                                    hide-details
                                    append-icon="payment"
                                    v-model="novaConta.quemPagou"
                                    item-text="nome"
                                    item-value="slug"
                                >
                                    <!-- <span v-for="user in usuarios" :key="user.slug">
                                    {{user.slug}}
                                </span> -->
                                </v-select>
                            </v-col>
                        </v-row>
                        <!-- PAGADORES -->
                        <v-row class="mt-3">
                            <v-col class="pa-2" cols="12">
                                <span class="caption">Pagadores</span>
                                <div class="grid-pagadores">
                                    <v-checkbox
                                        v-for="user in usuarios"
                                        :key="user.slug"
                                        class="check-pagadores mr-2 mt-0"
                                        v-model="novaConta.pagadores"
                                        hide-details
                                        :value="user.slug"
                                    >
                                        <template v-slot:label>
                                            <span class="body-2 ml-1">
                                                {{ user.slug | capitalize }}
                                            </span>
                                        </template>
                                    </v-checkbox>
                                    <v-checkbox
                                        class="check-pagadores mt-0"
                                        v-model="novaConta.pagadores"
                                        hide-details
                                        value="outros"
                                    >
                                        <template v-slot:label>
                                            <v-icon
                                                >mdi-account-multiple-plus-outline</v-icon
                                            >
                                        </template>
                                    </v-checkbox>
                                </div>
                            </v-col>
                        </v-row>
                        <!-- OUTROS PAGADORES (NUMERO) -->
                        <v-expand-transition>
                            <v-row
                                justify="center"
                                v-show="novaConta.pagadores.includes('outros')"
                            >
                                <v-col cols="12" md="8">
                                    <v-text-field
                                        v-model="outrosPagadores"
                                        type="number"
                                        prefix="Quantidade"
                                        filled
                                        dense
                                        hide-details="auto"
                                    >
                                        <template v-slot:prepend>
                                            <v-btn
                                                :disabled="outrosPagadores <= 0"
                                                color="primary"
                                                small
                                                @click="outrosPagadores--"
                                            >
                                                <v-icon> mdi-minus </v-icon>
                                            </v-btn>
                                        </template>
                                        <template v-slot:append-outer>
                                            <v-btn
                                                color="primary"
                                                small
                                                @click="outrosPagadores++"
                                            >
                                                <v-icon> mdi-plus </v-icon>
                                            </v-btn>
                                        </template>
                                    </v-text-field>
                                </v-col>
                            </v-row>
                        </v-expand-transition>
                        <!-- DIVISAO IGUAL -->
                        <v-row>
                            <v-col>
                                <div class="d-flex align-center">
                                    <span class="caption mr-2"
                                        >Divisão igual?</span
                                    >
                                    <v-switch
                                        dense
                                        class="mt-0"
                                        :hide-details="true"
                                        v-model="divisaoIgual"
                                    ></v-switch>
                                </div>
                            </v-col>
                        </v-row>
                        <!-- DIVISAO NÃO IGUAL -->
                        <v-expand-transition>
                            <v-row v-if="!divisaoIgual" justify="center">
                                <v-col cols="12" md="10">
                                    <v-text-field
                                        v-for="pagador in novaConta.pagadores"
                                        :key="pagador"
                                        v-model="novaConta.divisao[pagador]"
                                        type="number"
                                        :prefix="pagador + ': '"
                                        suffix="€"
                                        filled
                                        step="1.00"
                                        :max="pagamentoMaximo(pagador)"
                                        dense
                                        :ref="'numberinput-' + pagador"
                                        hide-details="auto"
                                        @change="
                                            handleNumberChange($event, pagador)
                                        "
                                    >
                                        <template v-slot:prepend>
                                            <v-btn
                                                @click="
                                                    handleNumberInputDown(
                                                        pagador
                                                    )
                                                "
                                                color="primary"
                                                small
                                            >
                                                <v-icon> mdi-minus </v-icon>
                                            </v-btn>
                                        </template>
                                        <template v-slot:append-outer>
                                            <v-btn
                                                @click="
                                                    handleNumberInputUp(pagador)
                                                "
                                                color="primary"
                                                small
                                            >
                                                <v-icon> mdi-plus </v-icon>
                                            </v-btn>
                                        </template>
                                    </v-text-field>
                                </v-col>
                            </v-row>
                        </v-expand-transition>
                        <!-- ALERTS COM RESULTADO -->
                        <v-row v-if="divisaoIgual">
                            <v-col cols="12">
                                <v-alert color="primary" text>
                                    <p
                                        class="mb-0"
                                        :class="{
                                            'white--text':
                                                $vuetify.theme.isDark,
                                        }"
                                    >
                                        Cada um paga: {{ divisao | euros }}
                                    </p>
                                </v-alert>
                            </v-col>
                        </v-row>
                        <v-row v-if="!divisaoIgual">
                            <v-col v-for="(div, key) in usuarios" :key="key">
                                <v-alert
                                    class="mx-1"
                                    color="primary"
                                    text
                                    dense
                                >
                                    <span>
                                        <b>{{ key | capitalize }}</b></span
                                    >
                                    <p class="mb-0">
                                        {{ novaConta.divisao[key] | euros }}
                                    </p>
                                </v-alert>
                            </v-col>
                        </v-row>
                        <!-- BOTAO ADD -->
                        <v-row>
                            <v-btn
                                :disabled="!isContaValida"
                                @click="adicionarConta"
                                block
                                max-width="250"
                                color="primary"
                            >
                                Adicionar
                            </v-btn>
                        </v-row>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>
        <astro-seletor-icone
            ref="seletoricone"
            @selecionar="selecionarIcone"
        ></astro-seletor-icone>
    </div>
</template>


<script>
import { meses } from "@/assets/variables/variables.js";
import AstroSeletorIcone from "./AstroSeletorIcone2.vue";

export default {
    components: { AstroSeletorIcone },
    name: "astro-add-conta",
    props: {
        usuarios: {
            type: Object,
            default: () => ({
                nat: {
                    email: "natsalgadona@gmail.com",
                    slug: "nat",
                    deve: {
                        carol: 0,
                        dani: 0,
                    },
                    nome: "Natalia",
                },
                carol: {
                    deve: {
                        dani: 0,
                        nat: 0,
                    },
                    email: "carolinasalgadoalves@gmail.com",
                    slug: "carol",
                    nome: "Carolina",
                },
                dani: {
                    nome: "Daniel",
                    email: "danielalves.ef@gmail.com",
                    deve: {
                        carol: 0,
                        nat: 0,
                    },
                    slug: "dani",
                },
            }),
        },
        active: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            novaConta: {
                conceito: "",
                valor: "",
                quemPagou: "",
                icone: "shopping_cart",
                pagadores: [],
                mes: new Date().getMonth(),
                mesText: meses[new Date().getMonth()].nome,
                divisao: null,
                pagamento: null,
            },
            divisaoCada: 0,
            divisaoIgual: true,
            iconPopup: false,
            novaContaPopup: false,
            outrosPagadores: 1,
            meses,
        };
    },
    computed: {
        objetoUsuario() {
            return [...Object.values(this.usuarios)];
        },
        doc() {
            return this.$route.params.id;
        },
        isContaValida() {
            return (
                this.novaConta.conceito !== "" &&
                this.novaConta.valor !== "" &&
                this.novaConta.valor > 0 &&
                this.novaConta.quemPagou !== "" &&
                this.novaConta.pagadores.length > 0
            );
        },
        divisao() {
            if (!this.novaConta.divisao) {
                return;
            }
            const total =
                typeof this.novaConta.valor === "number"
                    ? this.novaConta.valor
                    : 0;
            const temOutros = this.novaConta.pagadores.includes("outros");
            const numPagadores = temOutros
                ? this.novaConta.pagadores.length - 1 + this.outrosPagadores
                : this.novaConta.pagadores.length;

            let usuarios = Object.keys(this.usuarios);
            usuarios.push("outros");
            // DIVISAO IGUALITARIA
            if (this.divisaoIgual) {
                let resultado = total / numPagadores;
                let resultadoOutros = temOutros
                    ? resultado * this.outrosPagadores
                    : 0;
                usuarios.forEach((user) => {
                    if (this.novaConta.pagadores.includes(user)) {
                        this.novaConta.divisao[user] =
                            user === "outros"
                                ? +resultadoOutros.toFixed(2)
                                : +resultado.toFixed(2);
                    } else {
                        this.novaConta.divisao[user] = 0;
                    }
                });

                return +resultado.toFixed(2);
            }
            // DIVISAO SEPARADO
            else {
                usuarios.forEach((user) => {
                    if (!this.novaConta.pagadores.includes(user)) {
                        this.novaConta.divisao[user] = 0;
                    }
                });
                return 0;
            }
        },
        pagamentoMaximo() {
            return (pagadorAtual) => {
                let total = this.novaConta.valor;
                let pagadores = this.novaConta.pagadores;
                let maximo = pagadores.reduce((initial, current) => {
                    let valor =
                        pagadorAtual != current
                            ? this.novaConta.divisao[current]
                            : 0;
                    return initial - valor;
                }, total);
                return maximo;
            };
        },
    },
    mounted() {
        this.iniciarVariaveis();
        this.getRouteQuery();
    },
    updated() {
        this.getRouteQuery();
    },
    watch: {
        "novaConta.mes"(newValue) {
            this.novaConta.mesText = this.meses[newValue].nome;
        },
    },
    methods: {
        getRouteQuery() {
            if (
                this.$route.query.mes === null ||
                this.$route.query.mes === undefined ||
                this.$route.query.mes === ""
            ) {
                return;
            }
            if (this.$route.query.mes === "") {
                this.novaConta.mes = new Date().getMonth();
                return;
            }
            this.novaConta.mes = Number(this.$route.query.mes);
        },
        iniciarVariaveis() {
            const divisao = {};
            const pagamento = {};
            const keys = Object.keys(this.usuarios);

            keys.forEach((key) => {
                divisao[key] = 0;
                pagamento[key] = false;
                this.novaConta.pagadores.push(key);
            });
            divisao["outros"] = 0;
            this.novaConta.divisao = divisao;
            this.novaConta.pagamento = pagamento;
        },
        open() {
            this.novaContaPopup = true;
        },
        reset() {
            this.novaConta = {
                conceito: "",
                valor: "",
                quemPagou: "",
                icone: "shopping_cart",
                pagadores: [],
                mes: new Date().getMonth(),
                mesText: meses[new Date().getMonth()].nome,
                divisao: null,
                pagamento: null,
            };
            this.iniciarVariaveis();
        },
        checkPagamento() {
            const pagamento = Object.keys(this.novaConta.pagamento);
            pagamento.forEach((user) => {
                if (this.novaConta.divisao[user] === 0) {
                    this.novaConta.pagamento[user] = true;
                }
            });
            this.novaConta.pagamento[this.novaConta.quemPagou] = true;
        },
        handleNumberInputUp(pagador) {
            console.log(this.$refs["numberinput-" + pagador][0]);
            const input = this.$refs["numberinput-" + pagador][0].$refs.input;
            input.stepUp();
            input.value = Number(input.value).toFixed(2);
            this.novaConta.divisao[pagador] = Number(input.value).toFixed(2);
        },
        handleNumberInputDown(pagador) {
            console.log(this.$refs["numberinput-" + pagador][0]);
            const input = this.$refs["numberinput-" + pagador][0].$refs.input;
            input.stepDown();
            this.novaConta.divisao[pagador] = Number(input.value).toFixed(2);
        },
        handleNumberChange(e, pagador) {
            console.log(e, "change");

            if (e > this.pagamentoMaximo(pagador)) {
                this.novaConta.divisao[pagador] =
                    this.pagamentoMaximo(pagador).toFixed(2);
            } else {
                this.novaConta.divisao[pagador] = Number(e).toFixed(2);
            }
        },
        adicionarConta() {
            if (!this.isContaValida) return;
            const now = Date.now();
            const data = new Date(now).toLocaleDateString();
            const ano = new Date(now).getFullYear();
            this.checkPagamento();
            const novaConta = { ...this.novaConta };
            novaConta.data = now;
            novaConta.dataText = data;
            novaConta.ano = ano;
            // novaConta.cor = "danger";

            const color = (pagamento) => {
                const valores = Object.values(pagamento);
                const every = valores.every((valor) => {
                    return valor;
                });
                if (every) {
                    return "success";
                }
                return "danger";
            };

            novaConta.cor = color(novaConta.pagamento);

            // this.$emit("item:add", novaConta);
            this.$store
                .dispatch("appcontas/addItem", {
                    item: novaConta,
                    id: this.doc,
                })
                .then(() => {
                    this.reset();
                    this.novaContaPopup = false;
                });
        },
        selecionarIcone(icone) {
            this.novaConta.icone = icone;
            this.$refs.btnSeletorIcone.$el.blur();
        },
        abrirSeletorIcone() {
            this.$refs.seletoricone.open();
        },
    },
};
</script>



<style>
</style>