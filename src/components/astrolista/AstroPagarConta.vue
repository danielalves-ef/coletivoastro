<template>
    <div>
        <v-dialog max-width="500" v-model="active">
            <v-card v-if="item" class="text-center">
                <v-toolbar dense>
                    <v-toolbar-title>
                        Pagar conta:
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
                        Pago por {{ item.quemPagou | capitalize }}
                    </p>

                    <div class="d-flex justify-center">
                        <v-btn
                            class="gradient ma-2"
                            height="75"
                            type="gradient"
                            v-for="(pagador, key) in item.pagamento"
                            :key="key"
                            :color="pagador ? 'success' : 'danger'"
                            dark
                            small
                            @click="item.pagamento[key] = !item.pagamento[key]"
                        >
                            <div class="d-flex flex-column">
                                <v-icon>{{
                                    item.pagamento[key]
                                        ? "mdi-check"
                                        : "mdi-close"
                                }}</v-icon>
                                <span>
                                    {{ key | capitalize }}
                                </span>
                                <span>
                                    {{ item.divisao[key] | euros }}
                                </span>
                            </div>
                        </v-btn>
                    </div>
                </v-card-text>
                <v-card-actions class="d-flex justify-space-between pb-4">
                    <v-btn @click.native="fechar" color="dark" class="gradient">
                        Cancelar
                    </v-btn>
                    <v-btn
                        @click.native="salvar({ item })"
                        class="gradient"
                        color="primary"
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
        salvar({ item }) {
            this.$store
                .dispatch("appcontas/pagarItem", { item })
                .then(() => {
                    this.$emit("item:pagado", this.index);
                    this.fechar();
                })
                .catch((e) => {
                    alert(e);
                    this.fechar();
                });
        },
    },
};
</script>

<style>
</style>