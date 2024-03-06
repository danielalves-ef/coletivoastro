<template>
    <v-container>
        <!-- RESUMO -->
        <v-row>
            <v-col cols="5" class="text-center mx-auto">
                <v-card
                    text
                    dark
                    class="darken-2 gradient"
                    :color="minhaDivida.valor < 0 ? 'danger' : 'success'"
                >
                    <v-card-text>
                        <template v-if="minhaDivida.valor < 0">
                            <span class="white--text text-caption"
                                >Você deve</span
                            >
                            <p class="white--text text-h6 mb-0">
                                {{ $helpers.toMoney(minhaDivida.valor, true) }}
                            </p>
                        </template>
                        <template v-else-if="minhaDivida.valor > 0">
                            <span class="white--text text-caption"
                                >Você recebe</span
                            >
                            <p class="white--text text-h6 mb-0">
                                {{ $helpers.toMoney(minhaDivida.valor, true) }}
                            </p>
                        </template>
                        <template v-else>
                            <div class="mb-2">
                                <v-icon x-large
                                    >mdi-check-circle-outline</v-icon
                                >
                            </div>
                            <span class="white--text text-caption"
                                >Tudo quitado</span
                            >
                        </template>
                    </v-card-text>
                </v-card>

                <v-card
                    v-if="minhaDividaOutros > 0"
                    text
                    dark
                    class="darken-2 gradient mt-2"
                    :color="minhaDividaOutros < 0 ? 'danger' : 'success'"
                >
                    <v-card-text>
                        <span class="white--text text-caption">Você deve</span>
                        <p class="white--text text-h4 mb-0">
                            {{ minhaDividaOutros }} €
                        </p>
                        <span class="white--text text-caption">de outros</span>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="7" class="text-center mx-auto">
                <v-alert text color="primary">
                    <!-- <div class="d-flex justify-space-between"></div> -->
                    <span>Resumo:</span>
                    <p
                        :class="
                            valor === 0
                                ? 'primary--text text--darken-1'
                                : valor > 0
                                ? 'success--text text--darken-1'
                                : 'danger--text text--darken-1'
                        "
                        class="mb-1 d-flex justify-space-between"
                        :style="{ borderBottom: '1px solid lightgrey' }"
                        v-for="{ user, valor } in diferenca"
                        :key="user"
                    >
                        <strong>{{ $helpers.capitalize(user) }}:</strong>
                        <span> {{ $helpers.toMoney(valor, true) }} </span>
                    </p>
                </v-alert>
                <!-- <v-btn
                    dark
                  
                    :color="valor > 0 ? 'success' : 'danger'"
                >
                    <span class="white--text text-caption">
                        {{ user }}
                    </span>
                    <span class="white--text">{{ valor.toFixed(2) }}€</span>
                </v-btn> -->
            </v-col>
        </v-row>
        <!-- BALANCO GERAL -->
        <v-row>
            <v-col>
                <astro-divider color="primary">
                    <span> Balanço geral </span>
                </astro-divider>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-alert
                    color="primary"
                    text
                    v-for="(divida, index) in dividas"
                    :key="divida.slug"
                    class="pa-0"
                >
                    <v-list-item three-line>
                        <v-list-item-avatar size="60" color="primary gradient">
                            <div class="d-flex flex-column">
                                <v-icon small dark>mdi-account-cash</v-icon>
                                <span class="white--text">{{
                                    $helpers.capitalize(divida.slug)
                                }}</span>
                            </div>
                        </v-list-item-avatar>
                        <v-list-item-content class="mr-4">
                            <v-list-item-title>
                                <div
                                    class="d-flex justify-space-between mb-1"
                                    :style="{
                                        borderBottom:
                                            '1px solid rgba(222,222,222,0.25)',
                                    }"
                                    v-for="(deve, user) of divida.deve"
                                    :key="user"
                                >
                                    <p
                                        class="mb-0"
                                        :class="[
                                            deve > 0 ? 'primary--text' : '',
                                        ]"
                                    >
                                        <strong
                                            >{{ user | capitalize }}:</strong
                                        >
                                    </p>
                                    <p
                                        class="ml-2 mb-0"
                                        :class="[
                                            deve > 0 ? 'primary--text' : '',
                                        ]"
                                    >
                                        {{ deve.toFixed(2) }} €
                                    </p>
                                </div>
                            </v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action class="text-center align-center">
                            <v-chip
                                class="mb-1"
                                label
                                dark
                                color="success darken-2 gradient"
                            >
                                {{
                                    $helpers.toMoney(receber[index].valor)
                                }}</v-chip
                            >
                            <v-chip label dark color="danger darken-2 gradient">
                                {{ $helpers.toMoney(pagar[index].valor) }}
                            </v-chip>
                        </v-list-item-action>
                    </v-list-item>
                </v-alert>
            </v-col>
        </v-row>
        <!-- TOTAL -->
        <v-row>
            <v-col>
                <astro-divider color="primary">
                    <span> Total </span>
                </astro-divider>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="6">
                <v-alert color="primary" text>
                    <div class="d-flex flex-column justify-center align-center">
                        <span class="text-overline">Total</span>
                        <span class="text-h6 font-weight-medium">
                            {{ totalGasto | euros }}
                        </span>
                        <span class="gray-text text-caption">
                            {{ lista.itens.length }} itens
                        </span>
                    </div>
                    <!-- <p class="white--text text-h6 mb-0">
                            {{ totalGasto | euros }}
                        </p> -->
                </v-alert>
            </v-col>
            <v-col cols="6">
                <v-alert color="primary" text>
                    <template v-for="(total, usuario) of totalGastoPorUsuario">
                        <div
                            class="d-flex justify-space-between"
                            :key="usuario"
                        >
                            <p class="mb-0">{{ usuario | capitalize }}:</p>
                            <p class="mb-0 ml-2">
                                {{ total | euros }}
                            </p>
                        </div>
                        <v-divider :key="usuario + 'divider'"></v-divider>
                    </template>
                </v-alert>
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
            panels: [],
        };
    },
    computed: {
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
        usuarioLogadoIndex() {
            const usuarioAuthEmail = this.$auth.currentUser.email;
            if (!usuarioAuthEmail) {
                return 0;
            }
            const usuarioMatch = Object.values(this.lista.usuarios).findIndex(
                (usuario) => {
                    return usuario.email === usuarioAuthEmail;
                }
            );
            return usuarioMatch.slug || 0;
        },
        minhaDivida() {
            return this.diferenca.find((u) => u.user === this.usuarioLogado);
        },
        minhaDividaOutros() {
            const dividasUsuario = this.lista.itens.filter(
                (i) => i.quemPagou === this.usuarioLogado
            );

            return dividasUsuario.reduce((total, item) => {
                const itensOutros = item.pagamento.filter((pag) => {
                    return !item.pagadores.includes(pag.slug);
                });
                const totalOutros = itensOutros.reduce((total2, pag) => {
                    if (pag.pagamento) {
                        return total2;
                    }
                    return (total2 += pag.divisao);
                }, 0);
                return (total += totalOutros);
            }, 0);
        },
        dividas() {
            const dividas = this.lista.usuarios.map((usuarioA) => {
                // const usuarioA = JSON.parse(JSON.stringify(usuarioAO));
                usuarioA.deve = {};
                this.lista.usuarios.forEach((usuarioB) => {
                    if (usuarioA.slug === usuarioB.slug) {
                        return;
                    }
                    usuarioA.deve[usuarioB.slug] = 0;
                });

                this.lista.itens.forEach((item) => {
                    if (item.quemPagou === usuarioA.slug) {
                        return;
                    }
                    const pagador = item.pagamento.find(
                        (pag) => pag.slug === usuarioA.slug
                    );
                    if (pagador && !pagador.pagamento) {
                        usuarioA.deve[item.quemPagou] += pagador.divisao;
                    }
                });
                return usuarioA;
            });

            dividas.forEach((usuarioA) => {
                dividas.forEach((usuarioB) => {
                    if (usuarioA.slug === usuarioB.slug) {
                        return;
                    }

                    const diff =
                        usuarioA.deve[usuarioB.slug] >=
                        usuarioB.deve[usuarioA.slug]
                            ? usuarioB.deve[usuarioA.slug]
                            : usuarioA.deve[usuarioB.slug];

                    usuarioA.deve[usuarioB.slug] -= diff;
                    usuarioB.deve[usuarioA.slug] -= diff;
                });
            });

            return dividas;
        },
        dividaUsuarioLogado() {
            const divida = this.dividas.find(
                (d) => d.slug === this.usuarioLogado
            );

            return divida;
        },
        receber() {
            return this.dividas.map(({ slug }) => {
                let total = {};
                total.user = slug;
                total.valor = 0;

                return this.dividas.reduce((t, i) => {
                    t.valor = t.valor + (i.deve[slug] ? i.deve[slug] : 0);
                    // t.valor += i.deve[slug] | 0;
                    return t;
                }, total);
            });
        },
        pagar() {
            return this.dividas.map(({ slug, deve }) => {
                let total = {};
                total.user = slug;
                total.valor = 0;

                return Object.values(deve).reduce((t, i) => {
                    t.valor = t.valor + i;
                    return t;
                }, total);
            });
        },
        diferenca() {
            return this.dividas.map(({ slug }, index) => {
                const total =
                    this.receber[index].valor - this.pagar[index].valor;

                return { user: slug, valor: total };
            });
        },
        textoResumo() {
            if (!this.dividaUsuarioLogado) {
                return "";
            }
            const arrayValores = Object.entries(this.dividaUsuarioLogado.deve);
            let texto = "";
            arrayValores.forEach((valor) => {
                if (valor[1] > 0) {
                    texto += `, ${this.$helpers.toMoney(
                        valor[1]
                    )} para ${this.$helpers.capitalize(valor[0])}`;
                }
            });
            return texto.substr(1);
        },
        totalGasto() {
            if (!this.lista || !this.lista.itens) {
                return 0;
            }

            return this.lista.itens.reduce((total, item) => {
                return total + item.valor;
            }, 0);
        },
        totalGastoPorUsuario() {
            if (!this.lista || !this.lista.itens || !this.lista.usuarios) {
                return null;
            }
            const gastos = {};
            this.lista.usuarios.forEach((usuario) => {
                const gastoPorUsuario = this.lista.itens.reduce(
                    (total, item) => {
                        const pagou = item.pagamento.find(
                            (pag) => pag.slug === usuario.slug
                        );
                        const valor = pagou ? pagou.divisao : 0;
                        return total + valor;
                    },
                    0
                );
                gastos[usuario.slug] = gastoPorUsuario;
            });
            return gastos;
        },
    },
    mounted() {
        window.scrollTo(0, 0);
        this.panels = this.lista.usuarios.map((u, i) => i);
    },
};
</script>

<style>
</style>