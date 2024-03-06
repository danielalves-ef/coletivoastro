<template>
    <v-container class="px-4">
        <v-row>
            <!-- TITULO -->
            <v-col cols="auto" class="pa-2">
                <span class="text-h5"> Adicionar conta </span>
            </v-col>
            <v-spacer></v-spacer>
            <!-- DATA -->
            <v-col cols="auto" class="pa-2" :style="{ maxWidth: '138px' }">
                <astro-seletor-data
                    @selecionar="selecionarData"
                ></astro-seletor-data>
            </v-col>
        </v-row>
        <!-- ICONE, CONCEITO -->
        <v-row>
            <v-col class="pa-2" cols="auto" align-self="center">
                <astro-seletor-icone
                    v-if="false"
                    :icone="conta.icone"
                    @selecionar="selecionarIcone"
                >
                </astro-seletor-icone>
                <astro-seletor-categoria
                    :icone="conta.icone"
                    @selecionar="selecionarIcone"
                >
                </astro-seletor-categoria>
            </v-col>
            <v-col class="pa-2">
                <v-text-field
                    v-model="conta.conceito"
                    outlined
                    dense
                    label="Conceito"
                    :append-icon="conta.icone"
                    @click:append.stop="iconPopup = true"
                    hide-details="auto"
                >
                </v-text-field>
            </v-col>
        </v-row>
        <!-- FOTO, VALOR, QUEM PAGOU -->
        <v-row>
            <v-col cols="auto" class="pa-2">
                <astro-seletor-foto
                    size="90"
                    @selecionar="selecionarFoto"
                    title="Foto do recibo"
                >
                </astro-seletor-foto>
            </v-col>
            <v-col>
                <v-row>
                    <v-col class="pa-2" cols="12">
                        <v-text-field
                            outlined
                            dense
                            type="number"
                            label="Valor"
                            append-icon="euro"
                            hide-details="auto"
                            v-model.number="conta.valor"
                        >
                            <template v-slot:prepend>
                                <div class="mt-n1">
                                    <p
                                        class="
                                            mb-0
                                            mt-n3
                                            text-caption
                                            grey--text
                                            text--lighten-1
                                        "
                                        :class="[
                                            $vuetify.theme.dark
                                                ? 'text--lighten-1'
                                                : 'text--darken-2',
                                        ]"
                                    >
                                        Categoria
                                    </p>
                                    <astro-seletor-lista
                                        :itens="lista.categorias"
                                        :item="conta.categoria"
                                        @selecionar="selecionarCategoria"
                                        title="Selecionar categoria"
                                    ></astro-seletor-lista>
                                    <!-- <v-chip color="primary" label small
                                                >Alimentação</v-chip
                                            > -->
                                </div>
                            </template>
                        </v-text-field>
                    </v-col>

                    <v-col class="pa-2" cols="12">
                        <v-select
                            :items="usuarios"
                            label="Quem pagou"
                            dense
                            outlined
                            hide-details
                            append-icon="payment"
                            v-model="conta.quemPagou"
                            item-text="slug"
                            item-value="slug"
                            menu-props="offsetY"
                        >
                            <!-- <template v-slot:prepend>
                                <div class="mt-n1">
                                    <p
                                        class="
                                            mb-0
                                            mt-n3
                                            text-caption
                                            grey--text
                                            text--lighten-1
                                        "
                                        :class="[
                                            $vuetify.theme.dark
                                                ? 'text--lighten-1'
                                                : 'text--darken-2',
                                        ]"
                                    >
                                        Nota
                                    </p>
                                    <v-btn
                                        @click="showNota = !showNota"
                                        color="primary"
                                        icon
                                        small
                                    >
                                        <v-icon
                                            v-if="
                                                conta.nota && conta.nota !== ''
                                            "
                                            >mdi-note-edit</v-icon
                                        >
                                        <v-icon v-else
                                            >mdi-note-edit-outline</v-icon
                                        >
                                    </v-btn>
                                </div>
                            </template> -->
                        </v-select>
                    </v-col>
                </v-row>
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
                        v-model="conta.pagadores"
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
                        v-model="conta.pagadores"
                        hide-details
                        value="outros"
                    >
                        <template v-slot:label>
                            <v-icon>mdi-account-multiple-plus-outline</v-icon>
                        </template>
                    </v-checkbox>
                </div>
            </v-col>
        </v-row>

        <!-- OUTROS PAGADORES (NUMERO) -->
        <v-expand-transition>
            <v-row justify="center" v-show="conta.pagadores.includes('outros')">
                <v-col cols="12">
                    <v-text-field
                        v-model.number="outrosPagadores"
                        type="number"
                        label="Quantos outros?"
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
                <v-col cols="12">
                    <v-text-field
                        v-for="numeroOutro in outrosPagadores"
                        :key="numeroOutro"
                        hide-details="auto"
                        dense
                        :prefix="'outro ' + numeroOutro + ':  '"
                        placeholder="insira o nome"
                        prepend-inner-icon="mdi-account-plus"
                        filled
                        outlined
                        class="mb-2"
                        v-model="outros[numeroOutro - 1]"
                    >
                    </v-text-field>
                </v-col>
            </v-row>
        </v-expand-transition>

        <!-- NOTA -->
        <v-expand-transition>
            <v-row v-if="showNota">
                <v-col cols="12" class="pa-2">
                    <v-textarea
                        hide-details="auto"
                        label="Nota"
                        rows="2"
                        outlined
                        dense
                        v-model="conta.nota"
                    ></v-textarea>
                </v-col>
            </v-row>
        </v-expand-transition>
        <!-- DIVISAO IGUAL -->
        <v-row>
            <v-col cols="auto">
                <div class="d-flex align-center">
                    <span class="caption mr-2">Divisão igual?</span>
                    <v-switch
                        dense
                        class="mt-0"
                        :hide-details="true"
                        v-model="divisaoIgual"
                    ></v-switch>
                </div>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="auto">
                <v-btn
                    @click="showNota = !showNota"
                    small
                    :color="conta.nota !== '' ? 'primary' : ''"
                    >Nota<v-icon right>mdi-note-edit-outline</v-icon></v-btn
                >
            </v-col>
        </v-row>

        <!-- DIVISAO NÃO IGUAL -->
        <v-expand-transition>
            <v-row v-if="!divisaoIgual" justify="center">
                <v-btn-toggle
                    v-model="conta.formaDivisao"
                    mandatory
                    dense
                    active-class="primary "
                >
                    <v-btn value="igual">
                        <v-icon>mdi-equal</v-icon>
                    </v-btn>
                    <v-btn value="numerico">
                        <v-icon>mdi-numeric</v-icon>
                    </v-btn>
                    <v-btn value="porcentagem">
                        <v-icon>mdi-percent</v-icon>
                    </v-btn>
                    <v-btn value="partes">
                        <v-icon>mdi-equalizer</v-icon>
                    </v-btn>
                </v-btn-toggle>
                <v-col cols="12" md="10">
                    <v-text-field
                        v-for="(pagador, index) in pagadores"
                        :key="pagador"
                        v-model.number="pagamentoSeparado[index]"
                        :prefix="pagador + ': '"
                        :suffix="divisaoSufix"
                        type="number"
                        class="mb-2 input-right"
                        filled
                        outlined
                        placeholder="insira o valor"
                        prepend-inner-icon="mdi-account"
                        dense
                        :ref="'numberinput-' + pagador"
                        hide-details="auto"
                    >
                    </v-text-field>
                </v-col>
            </v-row>
        </v-expand-transition>
        <!-- ALERTS COM RESULTADO -->
        <v-row v-if="divisaoIgual">
            <v-col cols="12">
                <v-alert class="mb-0" color="primary" text dense>
                    <p
                        class="mb-0"
                        :class="{
                            'white--text': $vuetify.theme.isDark,
                        }"
                    >
                        {{ (conta.valor / pagadores.length) | euros }}
                        por pessoa ({{ pagamento.length }}
                        {{ pagamento.length === 1 ? "pessoa" : "pessoas" }})
                    </p>
                </v-alert>
            </v-col>
        </v-row>
        <v-row v-if="!divisaoIgual">
            <v-col>
                <v-alert class="mx-1 mb-0" color="primary" text dense>
                    <p
                        class="mb-2"
                        :class="{
                            'white--text': $vuetify.theme.isDark,
                        }"
                    >
                        <strong>
                            {{ $helpers.toMoney(conta.valor) }}
                        </strong>
                        - ({{ pagamento.length }}
                        {{ pagamento.length === 1 ? "pessoa" : "pessoas" }})
                    </p>
                    <astro-divider class="mb-2"> </astro-divider>
                    <p
                        v-for="pagador in pagamento"
                        :key="pagador.slug"
                        class="mb-1 pl-6"
                        :class="{
                            'white--text': $vuetify.theme.isDark,
                        }"
                    >
                        <v-icon
                            :style="{ verticalAlign: 'baseline' }"
                            small
                            :color="$vuetify.theme.isDark ? 'white' : 'primary'"
                            >mdi-account</v-icon
                        >
                        {{ pagador.divisao | euros }} :
                        <b>{{ pagador.slug | capitalize }}</b>
                    </p>
                </v-alert>
            </v-col>
        </v-row>
        <!-- BOTAO ADICIONAR -->
        <v-row>
            <v-col cols="12">
                <v-btn
                    :disabled="!isValida"
                    @click="salvarNovoItem"
                    color="primary"
                    block
                    large
                    :loading="loading"
                    >Adicionar</v-btn
                >
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import AstroSeletorData from "@/components/astrolista/AstroSeletorData.vue";
import AstroSeletorFoto from "@/components/astrolista/AstroSeletorFoto.vue";
import AstroSeletorIcone from "@/components/astrolista/AstroSeletorIcone.vue";
import AstroSeletorLista from "@/components/astrolista/AstroSeletorLista.vue";
import AstroSeletorCategoria from "@/components/astrolista/AstroSeletorCategoria.vue";
import AstroDivider from "@/components/layout/AstroDivider.vue";
export default {
    components: {
        AstroSeletorData,
        AstroSeletorIcone,
        AstroSeletorFoto,
        AstroDivider,
        AstroSeletorCategoria,
        AstroSeletorLista,
    },
    props: {
        lista: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            showNota: false,
            outrosPagadores: 0,
            divisaoIgual: true,
            formaDivisao: "igual",
            conta: {
                valor: 0,
                conceito: "",
                quemPagou: "",
                pagadores: [],
                icone: "mdi-home",
                categoria: "",
                nota: "",
                data: new Date(),
                mes: new Date().getMonth(),
                ano: new Date().getFullYear(),
                formaDivisao: "igual",
                dataText: new Date().toLocaleString("pt-BR", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                }),
                mesText: new Date().toLocaleString("pt-BR", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                }),
                now: new Date().getTime(),
            },
            outros: [],
            pagamentoSeparado: [],
            foto: null,
            loading: false,
        };
    },
    computed: {
        categorias() {
            return this.lista.categorias;
        },
        isValida() {
            return (
                this.conta.conceito &&
                this.conta.conceito !== "" &&
                this.conta.valor &&
                this.conta.valor !== 0 &&
                this.conta.quemPagou &&
                this.conta.quemPagou !== ""
            );
        },
        temOutros() {
            return this.conta.pagadores.includes("outros");
        },
        outrosIndex() {
            return this.conta.pagadores.findIndex((p) => p === "outros");
        },
        usuarios() {
            return Object.values(this.lista.usuarios).sort((a, b) => {
                return a.slug.localeCompare(b.slug);
            });
        },
        pagadores() {
            const pagadores = [...this.conta.pagadores];

            if (this.temOutros) {
                const index = pagadores.findIndex((p) => p === "outros");
                pagadores.splice(index, 1, ...this.outros);
            }
            return pagadores;
        },
        pagamentoMaximo() {
            return (pagadorAtual) => {
                let total = this.conta.valor;
                let pagadores = this.pagadores;
                let maximo = pagadores.reduce((initial, current, index) => {
                    let valor =
                        pagadorAtual != current
                            ? this.pagamentoSeparado[index]
                                ? +this.pagamentoSeparado[index]
                                : 0
                            : 0;
                    console.log({ initial, valor });

                    return initial - valor;
                }, total);
                console.log(maximo);
                return +maximo;
            };
        },
        pagamento() {
            if (this.conta.valor <= 0) {
                return [];
            }

            const pagadores = this.pagadores;

            return pagadores.map((pagador, index) => {
                let usuario = this.usuarios.find(
                    (usuario) => usuario.slug === pagador
                );
                if (!usuario) {
                    usuario = {
                        slug: pagador.toLowerCase(),
                        nome: this.$helpers.capitalize(pagador),
                    };
                }

                const numPagadores = pagadores.length;
                // const divisao = this.divisaoIgual
                //     ? this.conta.valor / numPagadores
                //     : this.pagamentoSeparado[index];

                // ### new
                let divisao;
                if (this.divisaoIgual) {
                    divisao = this.conta.valor / numPagadores;
                } else {
                    if (!this.pagamentoSeparado[index]) {
                        divisao = this.conta.valor / numPagadores;
                    } else {
                        switch (this.conta.formaDivisao) {
                            case "porcentagem":
                                divisao =
                                    (this.conta.valor *
                                        this.pagamentoSeparado[index]) /
                                    100;
                                break;
                            case "numerico":
                                divisao = this.pagamentoSeparado[index];
                                break;
                            case "partes":
                                divisao =
                                    (this.conta.valor /
                                        this.pagamentoSeparado.reduce(
                                            (total, item) => {
                                                return total + item;
                                            },
                                            0
                                        )) *
                                    this.pagamentoSeparado[index];
                                break;
                            default:
                                divisao = this.conta.valor / numPagadores;
                                break;
                        }
                    }
                }

                // divisao = divisao.toFixed(2);
                // ### new

                const pagamento = this.conta.quemPagou === pagador;

                return {
                    slug: usuario.slug,
                    nome: usuario.nome,
                    divisao,
                    pagamento,
                };
            });
        },
        fotoURL() {
            if (this.foto) {
                const objectURL = URL.createObjectURL(this.foto);
                return objectURL;
            }
            return null;
        },
        cor() {
            const cor = this.pagamento.every(({ pagamento }) => pagamento);
            return cor ? "success" : "danger";
        },
        novaConta() {
            return {
                ...this.conta,
                cor: this.cor,
                pagamento: this.pagamento,
                criadoPor: this.$auth.currentUser.email,
            };
        },
        divisaoSufix() {
            let sufix;
            switch (this.conta.formaDivisao) {
                case "partes":
                    sufix = "parte(s)";
                    break;

                case "porcentagem":
                    sufix = "%";
                    break;

                default:
                    sufix = "€";
                    break;
            }
            return sufix;
        },
        treeview() {
            const name = `${this.$helpers.toMoney(this.conta.valor)} (${
                this.pagadores.length
            } ${this.pagadores.length === 1 ? "pessoa" : "pessoas"})`;
            const itens = this.pagamento.map((item) => {
                return {
                    id: item.slug,
                    name: `${this.$helpers.toMoney(
                        item.divisao
                    )} : ${this.$helpers.capitalize(item.slug)} `,
                };
            });
            return [
                {
                    id: "pagamento",
                    name: name,
                    children: itens,
                },
            ];
        },
    },

    methods: {
        selecionarData(date) {
            const data = new Date(date);
            this.conta.data = date;
            this.conta.mes = data.getMonth();
            this.conta.ano = data.getFullYear();
            this.conta.mesText = data.toLocaleString("pt-BR", {
                month: "long",
            });
            this.conta.dataText = data.toLocaleString("pt-BR", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
            });
            this.conta.now = data.getTime();
            console.log({ conta: this.conta });
        },
        selecionarIcone(icone) {
            this.conta.icone = icone;
        },
        selecionarCategoria(categoria) {
            this.conta.categoria = categoria;
        },
        selecionarFoto(foto) {
            this.foto = foto;
        },
        salvarNovoItem() {
            this.loading = true;
            this.$store
                .dispatch("appcontas/lista/addItem", {
                    item: this.novaConta,
                    foto: this.foto,
                })
                .then(() => {
                    this.$swal({
                        title: "Item adicionado",
                        icon: "success",
                        timer: 2000,
                        timerProgressBar: true,
                    }).then(() => {
                        this.$router.push({ name: "contas-id" });
                    });
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
    watch: {
        outrosPagadores(newValue, oldValue) {
            if (oldValue > newValue) {
                this.outros.splice(newValue, 1);
            }
        },
        divisaoIgual(newValue) {
            if (newValue) {
                this.conta.formaDivisao = "igual";
            }
        },
        "conta.formaDivisao"(newValue) {
            switch (newValue) {
                case "porcentagem":
                    this.pagamentoSeparado = this.pagadores.map(() => {
                        return (100 / this.pagadores.length).toFixed(2);
                    });
                    break;

                case "partes":
                    this.pagamentoSeparado = this.pagadores.map(() => {
                        return 1;
                    });
                    break;
                case "numerico":
                    this.pagamentoSeparado = this.pagadores.map(() => {
                        return (
                            this.conta.valor / this.pagadores.length
                        ).toFixed(2);
                    });
                    break;

                default:
                    this.pagamentoSeparado = this.pagadores.map(() => {
                        return (
                            this.conta.valor / this.pagadores.length
                        ).toFixed(2);
                    });
                    break;
            }
        },
        "conta.categoria"(newValue) {
            if (this.lista.tipo === "mercado") {
                this.conta.conceito = `${newValue} - ${this.conta.dataText.substr(
                    0,
                    5
                )}`;
            }
        },
    },
    mounted() {
        window.scrollTo(0, 0);
        this.conta.categoria = this.lista.categorias[0];
        this.conta.pagadores = this.lista.usuarios.map((u) => u.slug);
    },
    created() {
        console.log({ contasadd: this });
    },
};
</script>

<style >
.input-right input {
    text-align: right;
}
</style>