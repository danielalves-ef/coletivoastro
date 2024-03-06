<template>
    <div>
        <v-dialog
            v-if="item"
            max-width="500"
            v-model="itemPopup"
            :fullscreen="$isMobile"
        >
            <v-card>
                <v-toolbar flat dense>
                    <v-toolbar-title
                        >Editando <i>{{ item.conceito }}</i></v-toolbar-title
                    >
                    <v-spacer></v-spacer>
                    <v-btn @click.stop="itemPopup = false" icon>
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                    <!-- FORM  -->
                    <v-container>
                        <!-- AVATAR Y MES -->
                        <v-row class="mt-3" justify="center" align="center">
                            <v-col class="pa-2 flex-grow-0">
                                <v-tooltip right>
                                    <template v-slot:activator="{ on, attrs }">
                                        <div v-on="on" v-bind="attrs">
                                            <!-- DIALOG ICONE -->
                                            <v-btn
                                                class="gradient"
                                                @click.stop="abrirSeletorIcone"
                                                fab
                                                color="primary"
                                            >
                                                <v-icon color="white">{{
                                                    item.icone
                                                }}</v-icon>
                                            </v-btn>
                                        </div>
                                    </template>
                                    <span>Escolha o icone</span>
                                </v-tooltip>
                            </v-col>
                            <v-spacer></v-spacer>
                            <v-col class="pa-2" cols="6">
                                <v-select
                                    :items="meses"
                                    v-model="item.mes"
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
                                    v-model="item.conceito"
                                    outlined
                                    dense
                                    label="Conceito"
                                    :append-icon="item.icone"
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
                                    v-model.number="item.valor"
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
                                    v-model="item.quemPagou"
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
                                        v-model="item.pagadores"
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
                                        v-model="item.pagadores"
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
                                v-show="item.pagadores.includes('outros')"
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
                                        v-for="pagador in item.pagadores"
                                        :key="pagador"
                                        v-model="item.divisao[pagador]"
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
                        <v-row justify="center" v-if="!divisaoIgual">
                            <v-alert
                                v-for="(div, key) in usuarios"
                                :key="key"
                                class="mx-1"
                                color="primary"
                                text
                                dense
                                max-width="120"
                            >
                                <span>
                                    <b>{{ key | capitalize }}</b></span
                                >
                                <p class="mb-0">
                                    {{ item.divisao[key] | euros }}
                                </p>
                            </v-alert>
                        </v-row>
                        <!-- BOTAO ADD -->
                        <v-row>
                            <v-btn
                                :disabled="!isContaValida"
                                @click="salvarAlteracoes"
                                block
                                max-width="250"
                                color="primary"
                            >
                                Salvar alterações
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
    name: "astro-editar-conta",
    props: {
        usuarios: {
            type: Object,
            default: () => ({}),
        },
        active: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            item: null,
            divisaoCada: 0,
            divisaoIgual: true,
            iconPopup: false,
            itemPopup: false,
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
                this.item.conceito !== "" &&
                this.item.valor !== "" &&
                this.item.valor > 0 &&
                this.item.quemPagou !== "" &&
                this.item.pagadores.length > 0
            );
        },
        divisao() {
            if (!this.item.divisao) {
                return;
            }
            const total =
                typeof this.item.valor === "number" ? this.item.valor : 0;
            const temOutros = this.item.pagadores.includes("outros");
            const numPagadores = temOutros
                ? this.item.pagadores.length - 1 + this.outrosPagadores
                : this.item.pagadores.length;

            let usuarios = Object.keys(this.usuarios);
            usuarios.push("outros");
            // DIVISAO IGUALITARIA
            if (this.divisaoIgual) {
                let resultado = total / numPagadores;
                let resultadoOutros = temOutros
                    ? resultado * this.outrosPagadores
                    : 0;
                usuarios.forEach((user) => {
                    if (this.item.pagadores.includes(user)) {
                        this.item.divisao[user] =
                            user === "outros"
                                ? +resultadoOutros.toFixed(2)
                                : +resultado.toFixed(2);
                    } else {
                        this.item.divisao[user] = 0;
                    }
                });

                return +resultado.toFixed(2);
            }
            // DIVISAO SEPARADO
            else {
                usuarios.forEach((user) => {
                    if (!this.item.pagadores.includes(user)) {
                        this.item.divisao[user] = 0;
                    }
                });
                return 0;
            }
        },
        pagamentoMaximo() {
            return (pagadorAtual) => {
                let total = this.item.valor;
                let pagadores = this.item.pagadores;
                let maximo = pagadores.reduce((initial, current) => {
                    let valor =
                        pagadorAtual != current
                            ? this.item.divisao[current]
                            : 0;
                    return initial - valor;
                }, total);
                return maximo;
            };
        },
    },
    mounted() {},
    watch: {
        "item.mes"(newValue) {
            this.item.mesText = this.meses[newValue].nome;
        },
    },
    methods: {
        checkPagamento() {
            const pagamento = Object.keys(this.item.pagamento);
            pagamento.forEach((user) => {
                if (this.item.divisao[user] === 0) {
                    this.item.pagamento[user] = true;
                }
            });
        },
        handleNumberInputUp(pagador) {
            console.log(this.$refs["numberinput-" + pagador][0]);
            const input = this.$refs["numberinput-" + pagador][0].$refs.input;
            input.stepUp();
            input.value = Number(input.value).toFixed(2);
            this.item.divisao[pagador] = Number(input.value).toFixed(2);
        },
        handleNumberInputDown(pagador) {
            console.log(this.$refs["numberinput-" + pagador][0]);
            const input = this.$refs["numberinput-" + pagador][0].$refs.input;
            input.stepDown();
            this.item.divisao[pagador] = Number(input.value).toFixed(2);
        },
        handleNumberChange(e, pagador) {
            console.log(e, "change");

            if (e > this.pagamentoMaximo(pagador)) {
                this.item.divisao[pagador] =
                    this.pagamentoMaximo(pagador).toFixed(2);
            } else {
                this.item.divisao[pagador] = Number(e).toFixed(2);
            }
        },

        selecionarIcone(icone) {
            this.item.icone = icone;
        },
        abrirSeletorIcone() {
            this.$refs.seletoricone.open();
        },
        open({ item }) {
            this.itemPopup = true;
            this.item = item;
        },
        salvarAlteracoes() {
            if (!this.isContaValida) return;
            this.$store
                .dispatch("appcontas/editarItem", { item: this.item })
                .then(() => {
                    this.itemPopup = false;
                });
        },
    },
};
</script>



<style>
</style>