<template>
    <div>
        <!-- ITEM TOOLBAR -->
        <v-toolbar>
            <v-toolbar-title>Advogado</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon>
                <v-icon>mdi-plus-circle-outline</v-icon>
            </v-btn>
            <v-btn icon>
                <v-icon>mdi-dots-horizontal</v-icon>
            </v-btn>
        </v-toolbar>

        <v-container>
            <!-- ITEM CABEÇALHO -->
            <v-row>
                <v-col cols="12">
                    <v-card>
                        <v-card-title>
                            Detalhes

                            <v-spacer></v-spacer>
                            <v-btn icon
                                ><v-icon> mdi-dots-horizontal</v-icon></v-btn
                            >
                        </v-card-title>
                        <v-card-text>
                            <div class="d-flex">
                                <v-row>
                                    <v-col cols="8">
                                        <!-- VALOR TOTAL -->
                                        <v-list-item dense>
                                            <v-list-item-icon class="mr-4">
                                                <v-icon
                                                    >mdi-cash-multiple</v-icon
                                                >
                                            </v-list-item-icon>
                                            <v-list-item-content>
                                                <v-list-item-subtitle
                                                    >Valor
                                                    total</v-list-item-subtitle
                                                >
                                                <v-list-item-title>
                                                    {{ dividaTotal | euros }}
                                                </v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>

                                        <!-- VALOR PARA CADA  -->
                                        <v-list-item dense>
                                            <v-list-item-icon class="mr-4">
                                                <v-icon
                                                    >mdi-account-cash</v-icon
                                                >
                                            </v-list-item-icon>
                                            <v-list-item-content>
                                                <v-list-item-subtitle
                                                    >Valor para
                                                    cada:</v-list-item-subtitle
                                                >
                                                <v-list-item-title>
                                                    {{
                                                        (dividaTotal /
                                                            usuarios.length)
                                                            | euros
                                                    }}
                                                </v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-col>
                                    <v-spacer></v-spacer>
                                    <v-col class="text-right" cols="auto">
                                        <v-progress-circular
                                            color="purple"
                                            :value="progressoTotal"
                                            size="80"
                                            width="12"
                                        >
                                            {{ progressoTotal | porcentagem }}
                                        </v-progress-circular>
                                    </v-col>
                                </v-row>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <!-- LISTA USUARIOS -->
            <v-row>
                <v-col>
                    <v-expansion-panels>
                        <v-expansion-panel
                            v-for="usuario in usuariosObj"
                            :key="usuario.nome"
                        >
                            <!-- PANEL HEADER -->
                            <v-expansion-panel-header class="pa-0 pr-2">
                                <template v-slot:default="{ open }">
                                    <v-list-item class="my-1">
                                        <v-list-item-avatar
                                            dark
                                            :color="usuario.cor"
                                        >
                                            <span class="white--text">
                                                {{ usuario.nome | inicial }}
                                            </span>
                                        </v-list-item-avatar>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                <v-badge
                                                    :value="
                                                        progressoUsuario(
                                                            usuario
                                                        ) >= 100
                                                    "
                                                    class="mt-0"
                                                    bordered
                                                    inline
                                                    color="success"
                                                    icon="mdi-check"
                                                >
                                                    {{ usuario.nome }}
                                                </v-badge>
                                            </v-list-item-title>
                                            <v-list-item-subtitle
                                                >pagou
                                                <strong>
                                                    {{
                                                        usuariosObj[
                                                            usuario.nome
                                                        ].totalPago || 0 | euros
                                                    }}
                                                </strong>
                                            </v-list-item-subtitle>
                                        </v-list-item-content>
                                        <v-list-item-action>
                                            <v-progress-circular
                                                v-if="open"
                                                :color="usuario.cor"
                                                :value="
                                                    progressoUsuario(usuario)
                                                "
                                                width="6"
                                                size="40"
                                                key="open"
                                            >
                                                <small
                                                    :style="{
                                                        fontSize: '8px',
                                                    }"
                                                >
                                                    {{
                                                        progressoUsuario(
                                                            usuario
                                                        ) | porcentagem
                                                    }}
                                                </small>
                                            </v-progress-circular>
                                            <v-progress-circular
                                                v-else
                                                :color="usuario.cor"
                                                :value="
                                                    progressoUsuario(usuario)
                                                "
                                                width="10"
                                                size="40"
                                                key="closed"
                                            >
                                            </v-progress-circular>
                                        </v-list-item-action>
                                    </v-list-item>
                                </template>
                            </v-expansion-panel-header>

                            <!-- PANEL CONTENT -->
                            <v-expansion-panel-content>
                                <div>
                                    <v-progress-linear
                                        :value="progressoUsuario(usuario)"
                                        :color="usuario.cor"
                                        height="25"
                                    >
                                        falta
                                        <span class="ml-2">{{
                                            valorQueFalta(usuario) | euros
                                        }}</span>
                                    </v-progress-linear>
                                </div>
                                <v-subheader> Pagamentos </v-subheader>
                                <v-list-item
                                    v-for="(
                                        pagamento, index
                                    ) in usuario.pagamentos"
                                    :key="index"
                                >
                                    <v-list-item-avatar>
                                        <v-avatar
                                            :color="usuario.cor"
                                            size="30"
                                        >
                                            <span class="white--text">
                                                {{ index + 1 }}
                                            </span>
                                        </v-avatar>
                                    </v-list-item-avatar>
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            {{ pagamento.valor | euros }}
                                        </v-list-item-title>
                                        <v-list-item-subtitle>
                                            {{ pagamento.dataPagamento | data }}
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-col>
            </v-row>

            <!-- ADD PAGAMENTO -->

            <v-row>
                <v-col class="text-center" cols="12">
                    <v-btn
                        class="gradient"
                        x-large
                        color="primary"
                        @click="showNovoPagamento"
                    >
                        Adicionar pagamento
                        <v-icon class="ml-2">
                            mdi-credit-card-plus-outline
                        </v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>

        <!-- NOVO PAGAMENTO -->
        <v-dialog eager max-width="500" v-model="novoPagamento.show">
            <v-card>
                <v-toolbar dark class="primary gradient">
                    <v-toolbar-title> Adicionar pagamento </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn @click="novoPagamento.show = false" icon>
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-title class="justify-center"
                    >Dados do pagamento</v-card-title
                >
                <v-card-text class="text-center">
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-select
                                    prepend-icon="mdi-account"
                                    v-model="novoPagamento.username"
                                    :items="usuarios"
                                    item-text="nome"
                                    label="Pagador"
                                    item-value="nome"
                                    filled
                                    dense
                                    hide-details="auto"
                                >
                                </v-select>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field
                                    prepend-icon="mdi-currency-eur"
                                    filled
                                    dense
                                    hide-details="auto"
                                    label="Valor"
                                    v-model.number="novoPagamento.valor"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field
                                    prepend-icon="mdi-calendar"
                                    filled
                                    dense
                                    hide-details="auto"
                                    label="Data do pagamento"
                                    type="date"
                                    maxlength="10"
                                    v-model="novoPagamento.dataPagamento"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-btn
                                    x-large
                                    class="gradient"
                                    color="primary"
                                    @click="addPagamento"
                                >
                                    Enviar pagamento
                                    <v-icon class="ml-2">
                                        mdi-credit-card-check-outline
                                    </v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    name: "dividas-item",
    filters: {
        porcentagem: function (value) {
            const numero = +value > 100 ? 100 : +value;
            return numero.toFixed(1) + "%";
        },
        inicial: function (value) {
            return value.charAt(0);
        },
        euros: function (value) {
            // const number = new Number(value);
            const number = +value;

            return number.toLocaleString("en-ES", {
                style: "currency",
                currency: "EUR",
            });
        },
        data: function (value) {
            const data = new Date(value);
            return data.toLocaleString("pt-BR", { dateStyle: "medium" });
        },
    },
    data() {
        return {
            dividaTotal: 1200,
            novoPagamento: {
                show: false,
                valor: 0,
                username: "Daniel",
                dataPagamento: null,
            },
            usuarios: [
                {
                    nome: "Daniel",
                    cor: "deep-purple",
                },
                {
                    nome: "Natalia",
                    cor: "blue",
                },
                {
                    nome: "Carol",
                    cor: "teal",
                },
            ],
            pagamentos: [
                {
                    username: "Daniel",
                    valor: "100",
                    dataPagamento: "2021-10-18",
                    dataCriacao: "2021-10-18 09:22:22",
                },
                {
                    username: "Carol",
                    valor: "50",
                    dataPagamento: "2021-10-18",
                    dataCriacao: "2021-10-18 09:22:22",
                },
                {
                    username: "Natalia",
                    valor: "300",
                    dataPagamento: "2021-10-18",
                    dataCriacao: "2021-10-18 09:22:22",
                },
            ],
        };
    },
    computed: {
        today() {
            return new Date().toISOString().split("T")[0];
        },
        valorQueFalta() {
            return (usuario) => {
                const usuariosNum = this.usuarios.length;
                const totalParaPagar = +this.dividaTotal / usuariosNum;
                const totalPago = usuario.totalPago;
                const valorQueFalta = totalParaPagar - totalPago;
                return valorQueFalta < 0 ? 0 : valorQueFalta;
            };
        },
        progressoUsuario() {
            return (usuario) => {
                const usuariosNum = this.usuarios.length;
                const totalParaPagar = this.dividaTotal / usuariosNum;
                const totalPago = usuario.totalPago;
                return (totalPago / totalParaPagar) * 100;
            };
        },
        progressoTotal() {
            const total = this.pagamentos.reduce((total, pagamento) => {
                total += +pagamento.valor;
                return total;
            }, 0);
            return (total / this.dividaTotal) * 100;
        },
        valorPagoTotal() {
            return this.pagamentos.reduce((total, pagamento) => {
                total += +pagamento.valor;
                return total;
            }, 0);
        },
        usuariosObj() {
            const usuariosObj = this.usuarios.reduce((total, usuario) => {
                usuario.pagamentos = [];
                usuario.totalPago = 0;
                total[usuario.nome] = usuario;
                return total;
            }, {});

            return this.pagamentos.reduce((usuarios, pagamento) => {
                const { username } = pagamento;

                if (usuarios[username]) {
                    usuarios[username].pagamentos.push(pagamento);
                    usuarios[username].totalPago += +pagamento.valor;
                } else {
                    usuarios[username] = {};
                    usuarios[username].pagamentos = [pagamento];
                    usuarios[username].totalPago = +pagamento.valor;
                }
                return usuarios;
            }, usuariosObj);
        },
    },
    methods: {
        showNovoPagamento() {
            this.novoPagamento.show = true;
        },
        closeNovoPagamento() {
            this.novoPagamento.show = false;
        },
        resetNovoPagemento() {},
        addPagamento() {
            this.closeNovoPagamento();
            setTimeout(() => {
                const now = new Date();
                const { valor, username, dataPagamento } = this.novoPagamento;
                const novoPagamento = {
                    dataCriacao: now,
                    valor,
                    username,
                    dataPagamento,
                };
                this.pagamentos.push(novoPagamento);
                this.novoPagamento.valor = 0;
            }, 500);
        },
    },
    mounted() {
        console.log({ app: this });

        this.novoPagamento.dataPagamento = this.today;
    },
};
</script>

<style>
</style>