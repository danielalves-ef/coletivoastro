<template>
    <v-container>
        <v-row>
            <!-- TITULO -->
            <v-col cols="auto" class="pa-2">
                <span class="text-h5">
                    <v-btn icon left @click="fecharEdit" large>
                        <v-icon>mdi-arrow-left </v-icon>
                    </v-btn>
                    Editar conta
                </span>
            </v-col>
            <v-spacer></v-spacer>
            <!-- DATA -->
            <v-col cols="auto" class="pa-2" :style="{ maxWidth: '138px' }">
                <astro-seletor-data
                    @selecionar="selecionarData"
                    :data="conta.data"
                ></astro-seletor-data>
            </v-col>
        </v-row>
        <!-- ICONE, CONCEITO -->
        <v-row>
            <v-col class="pa-2" cols="auto" align-self="center">
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
                            </template></v-text-field
                        >
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
        <!-- BOTAO SALVAR -->
        <v-row>
            <v-col cols="6">
                <v-btn
                    dark
                    color="danger darken-2"
                    @click="fecharEdit"
                    block
                    large
                    >Cancelar</v-btn
                >
            </v-col>
            <v-col cols="6">
                <v-btn
                    :loading="loading"
                    :disabled="!foiAlterado"
                    color="primary"
                    @click="salvarAlteracoes"
                    block
                    large
                    >Salvar
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import AstroSeletorData from "@/components/astrolista/AstroSeletorData.vue";
import AstroSeletorFoto from "@/components/astrolista/AstroSeletorFoto.vue";
import AstroDivider from "@/components/layout/AstroDivider.vue";
import AstroSeletorCategoria from "@/components/astrolista/AstroSeletorCategoria.vue";
import AstroSeletorLista from "@/components/astrolista/AstroSeletorLista.vue";

export default {
    components: {
        AstroSeletorData,
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
        item: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            showNota: false,
            loading: false,
            outrosPagadores: 0,
            divisaoIgual: true,
            conta: null,
            outros: [],
            pagamentoSeparado: [],
            foto: null,
        };
    },
    computed: {
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

                const pagamento = this.item.pagamento[index]
                    ? this.item.pagamento[index].pagamento
                    : false;

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
        foiAlterado() {
            const item = { ...this.item };
            const novaConta = { ...this.novaConta };
            console.log({ item, novaConta });
            item.pagamento = item.pagamento.map(
                ({ slug, divisao, nome, pagamento }) => {
                    return {
                        slug,
                        nome,
                        divisao,
                        pagamento,
                    };
                }
            );
            console.log({ item });

            return (
                JSON.stringify(novaConta) !== JSON.stringify(item) || this.foto
            );
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
        selecionarCategoria(categoria) {
            this.conta.categoria = categoria;
        },
        selecionarIcone(icone) {
            this.conta.icone = icone;
        },
        selecionarFoto(foto) {
            this.foto = foto;
        },
        salvarAlteracoes() {
            this.loading = true;
            this.$store
                .dispatch("appcontas/lista/editarItem", {
                    item: this.novaConta,
                    foto: this.foto,
                })
                .then(() => {
                    this.loading = false;
                    this.$swal({
                        title: "Alterações salvas",
                        icon: "success",
                    });
                    this.fecharEdit();
                })
                .catch((e) => {
                    this.loading = false;
                    this.$swal({
                        title: "Algo deu errado",
                        text: e,
                        icon: "error",
                    }).then(() => {
                        this.fecharEdit();
                    });
                });
            // .finally(() => {
            //     this.loading = false;
            //     this.fecharEdit();
            // });
        },
        init() {
            this.conta = JSON.parse(JSON.stringify(this.item));
            let outrosPagadores = 0;
            let outros = [];
            const usuarios = this.lista.usuarios.map((u) => u.slug);

            if (this.item.pagadores.includes("outros")) {
                outros = this.item.pagamento
                    .filter((pag) => {
                        return !usuarios.includes(pag.slug);
                    })
                    .map((u) => u.slug);
                outrosPagadores = outros.length;
            }
            this.divisaoIgual = this.item.formaDivisao === "igual";

            if (this.item.formaDivisao === "partes") {
                const menorParte = this.item.pagamento.reduce((t, i) => {
                    if (t === 0) {
                        return (t = i.divisao);
                    }
                    return t < i.divisao ? t : i.divisao;
                }, this.item.valor);

                this.pagamentoSeparado = this.item.pagamento.map((item) => {
                    console.log(item.divisao, menorParte);
                    return item.divisao / menorParte;
                });
                console.log(this.pagamentoSeparado);
            } else if (this.item.formaDivisao === "porcentagem") {
                this.pagamentoSeparado = this.item.pagamento.map((item) => {
                    return (item.divisao * 100) / this.item.valor;
                });
            } else if (this.item.formaDivisao === "numerico") {
                this.pagamentoSeparado = this.item.pagamento.map((item) => {
                    return item.divisao;
                });
            } else {
                this.pagamentoSeparado = this.item.pagamento.map((item) => {
                    return item.divisao;
                });
            }

            this.outrosPagadores = outrosPagadores;
            this.outros = outros;
        },
        fecharEdit() {
            const route = this.$route;
            const query = {
                ...route.query,
                edit: undefined,
            };

            this.$router.push({
                name: route.name,
                params: route.params,
                hash: route.hash,
                query: query,
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
            if (newValue === "igual") {
                this.pagamentoSeparado = this.pagadores.map(() => {
                    return (this.conta.valor / this.pagadores.length).toFixed(
                        2
                    );
                });
            }
        },
    },
    created() {
        this.init();
    },
};
</script>

<style >
.input-right input {
    text-align: right;
}
</style>