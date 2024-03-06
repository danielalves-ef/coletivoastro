<template>
    <div>
        <v-dialog max-width="500" v-model="active">
            <v-card v-if="item" class="text-center">
                <v-toolbar dense>
                    <v-toolbar-title>
                        Pagar
                        <i
                            ><strong>{{ item.conceito }}</strong></i
                        >
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="fechar">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>

                <v-card-title class="justify-center">
                    Quem ja pagou a conta?
                </v-card-title>
                <v-card-text>
                    <p class="mb-0">
                        <strong> {{ item.conceito | capitalize }} - </strong>
                        <i>
                            {{ item.valor | euros }}
                        </i>
                    </p>
                    <p class="mb-0">
                        Pago por
                        <strong>{{ item.quemPagou | capitalize }}</strong>
                    </p>
                    <v-divider class="my-2"></v-divider>
                    <div>
                        <v-btn
                            class="gradient ma-2"
                            v-for="pagador in item.pagamento"
                            :key="pagador.slug"
                            :color="
                                pagador.pagamento
                                    ? 'success'
                                    : 'danger darken-2'
                            "
                            large
                            dark
                            @click="pagador.pagamento = !pagador.pagamento"
                        >
                            <v-icon left>{{
                                pagador.pagamento
                                    ? "mdi-credit-card-check-outline"
                                    : "mdi-credit-card-remove-outline"
                            }}</v-icon>
                            <strong> {{ pagador.slug | capitalize }}: </strong>
                            <span>
                                {{ $helpers.toMoney(pagador.divisao, true) }}
                            </span>
                        </v-btn>
                    </div>
                    <div v-if="false" class="d-flex justify-center">
                        <v-btn
                            class="gradient ma-2"
                            height="75"
                            type="gradient"
                            v-for="pagador in item.pagamento"
                            :key="pagador.slug"
                            :color="pagador.pagamento ? 'success' : 'danger'"
                            dark
                            small
                            @click="pagador.pagamento = !pagador.pagamento"
                        >
                            <div class="d-flex flex-column">
                                <v-icon>{{
                                    pagador.pagamento
                                        ? "mdi-check"
                                        : "mdi-close"
                                }}</v-icon>
                                <span>
                                    {{ pagador.slug | capitalize }}
                                </span>
                                <span>
                                    {{ pagador.divisao | euros }}
                                </span>
                            </div>
                        </v-btn>
                    </div>
                </v-card-text>
                <v-card-actions class="d-flex justify-space-between pb-4">
                    <v-btn
                        dark
                        @click.native="fechar"
                        color="danger darken-2"
                        class="gradient"
                    >
                        Cancelar
                    </v-btn>
                    <v-btn
                        @click.native="salvar({ item })"
                        class="gradient"
                        color="success"
                        :loading="loading"
                    >
                        Salvar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    name: "astro-pagar-conta",
    props: {},
    data() {
        return {
            active: false,
            item: null,
            loading: false,
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
        open({ item }) {
            this.item = JSON.parse(JSON.stringify(item));
            this.active = true;
        },
        fechar() {
            this.active = false;
        },
        salvar2() {
            this.$emit("item:pagado");
            this.fechar();
        },
        salvar({ item }) {
            this.loading = true;
            this.$store
                .dispatch("appcontas/lista/pagarItem", { item })
                .then(() => {
                    this.$emit("item:pagado");
                    this.loading = false;
                    this.fechar();
                })
                .catch((e) => {
                    alert(e);
                    this.loading = false;
                    this.fechar();
                });
        },
    },
};
</script>

<style>
</style>