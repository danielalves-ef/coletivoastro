<template>
    <div class="touch" v-if="item" v-hammer:swipe.right="fecharItem">
        <v-toolbar color="transparent" dense flat>
            <v-btn icon @click="fecharItem">
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>

            <v-toolbar-title class="text-h5">
                {{ $helpers.capitalize(item.conceito) }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn @click="abrirEdit" icon>
                <v-icon>mdi-pencil</v-icon>
            </v-btn>
        </v-toolbar>

        <v-container class="px-0">
            <v-row>
                <v-col cols="12">
                    <v-list-item three-line>
                        <v-list-item-action class="align-center">
                            <v-avatar
                                dark
                                color="primary"
                                class="rounded"
                                size="35"
                            >
                                <v-icon dark>{{ item.icone }}</v-icon>
                            </v-avatar>
                            <v-list-item-action-text class="mt-2">
                                <span class="text-h6">{{
                                    item.mesText.substr(0, 3)
                                }}</span>
                            </v-list-item-action-text>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title class="text-h5 mb-1">
                                {{ $helpers.toMoney(item.valor) }}
                            </v-list-item-title>
                            <v-list-item-subtitle
                                >{{ item.dataText }} <br />
                                pago por
                                <strong>
                                    {{ $helpers.capitalize(item.quemPagou) }}
                                </strong>
                            </v-list-item-subtitle>
                        </v-list-item-content>

                        <v-list-item-avatar
                            tile
                            size="80"
                            color="primary"
                            :style="{ opacity: '0.7' }"
                        >
                            <v-img
                                v-if="item.fotoURL"
                                :src="item.fotoURL"
                                @click="abrirFoto(item.fotoURL)"
                            />
                            <v-icon v-else>mdi-camera-off</v-icon>
                        </v-list-item-avatar>
                    </v-list-item>
                </v-col>
            </v-row>

            <v-row v-if="item.nota && item.nota !== ''">
                <v-col cols="12" class="pt-0">
                    <v-subheader>Nota</v-subheader>
                    <v-textarea
                        :value="item.nota"
                        filled
                        readonly
                        class="px-3"
                        auto-grow
                        rows="1"
                        dense
                        hide-details="auto"
                    ></v-textarea>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" class="pt-0">
                    <v-subheader>Divisão</v-subheader>
                    <v-list-item
                        v-for="pagador in item.pagamento"
                        :key="pagador.slug"
                    >
                        <v-list-item-avatar>
                            <v-avatar dark color="primary" size="30">
                                <strong class="white--text">
                                    {{ pagador.slug.charAt(0).toUpperCase() }}
                                </strong>
                            </v-avatar>
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-title>
                                {{ $helpers.capitalize(pagador.slug) }}
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                {{ $helpers.toMoney(pagador.divisao) }}
                            </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-icon color="success" v-if="pagador.pagamento"
                                >mdi-check-circle</v-icon
                            >
                            <v-icon dark color="danger" v-else
                                >mdi-close-circle</v-icon
                            >
                        </v-list-item-action>
                    </v-list-item>
                </v-col>
            </v-row>
            <v-row v-if="item.fotoURL">
                <v-col cols="12">
                    <v-subheader>Recibo</v-subheader>
                    <v-card flat max-width="500">
                        <v-card-text>
                            <img
                                ref="itemRecibo"
                                class="item-recibo"
                                :src="item.fotoURL"
                            />
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" class="pt-0">
                    <v-subheader>Ações</v-subheader>
                </v-col>
                <v-col
                    cols="12"
                    class="px-6 pt-0 d-flex justify-center flex-wrap"
                >
                    <v-btn
                        @click="pagarItem"
                        class="mr-2"
                        dark
                        color="success darken-1 gradient"
                    >
                        <v-icon left>mdi-credit-card-check-outline</v-icon>
                        Pagar
                    </v-btn>
                    <v-btn
                        @click="abrirEdit"
                        class="mr-2"
                        dark
                        color="warning darken-1 gradient"
                    >
                        <v-icon left>mdi-pencil</v-icon>

                        Editar
                    </v-btn>
                    <v-btn
                        @click="confirmarDeletar"
                        dark
                        color="danger darken-1 gradient"
                    >
                        <v-icon left>mdi-delete</v-icon>

                        Deletar
                    </v-btn>
                </v-col>
                <v-col cols="12" class="px-6 text-center">
                    <v-btn
                        @click.native="programarConta"
                        class="mb-4"
                        dark
                        color="primary darken-1 gradient"
                        :loading="loading"
                    >
                        <v-icon left>mdi-star-outline</v-icon>

                        Tornar conta recorrente
                    </v-btn>
                </v-col>
            </v-row>
            <contas-lista-itens-pagar
                ref="pagarconta"
                :key="$route.fullPath"
            ></contas-lista-itens-pagar>
        </v-container>
    </div>
</template>

<script>
import ContasListaItensPagar from "../../itens/ContasListaItensPagar.vue";
export default {
    components: { ContasListaItensPagar },
    name: "contas-show-item",
    props: {
        item: {
            type: Object,
            required: true,
        },
        lista: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            loading: false,
        };
    },
    methods: {
        fecharItem() {
            const query = { ...this.$route.query };
            delete query.item;
            console.log({ query });
            const push = {
                name: this.$route.name,
                params: this.$route.params,
                query: query,
            };
            console.log({ push });
            this.$router.push(push);
            // this.$router.push({ name: "contas-lista" });
        },
        abrirEdit() {
            const push = {
                name: this.$route.name,
                params: this.$route.params,
                query: { ...this.$route.query, edit: true },
            };
            console.log({ push });
            this.$router.push(push);
        },
        async confirmarDeletar() {
            const result = await this.$swal({
                title: "Deletar item",
                text: "Deseja deletar esse item?!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Deletar",
                cancelButtonText: "Cancelar",
            });
            if (result.isConfirmed) {
                this.deletarItem();
            }
        },
        deletarItem() {
            this.$store
                .dispatch("appcontas/lista/deletarItem", {
                    item: this.item,
                })
                .then(() => {
                    this.$swal({
                        title: "Item Deletado",
                        icon: "success",
                        iconColor: "#B71C1C",
                        position: "center",
                    });
                    this.$router.push({ name: "contas-lista" });
                })
                .catch((e) => {
                    this.$swal({
                        title: "Algo deu errado",
                        text: e,
                        icon: "error",
                        position: "center",
                    });
                });
        },
        abrirFoto() {
            this.$refs.itemRecibo.scrollIntoView();
        },
        programarConta() {
            this.loading = true;
            this.$store
                .dispatch("appcontas/lista/programarItem", {
                    item: this.item,
                    lista: this.lista.id,
                })
                .then(() => {
                    this.$swal({
                        title: "Tarefa criada",
                        text: `"${this.item.conceito}" foi adicionado a lista de contas programadas`,
                        icon: "success",
                    });
                })
                .catch((e) => {
                    this.$swal({
                        title: "Algo deu errado",
                        text: e,
                        icon: "error",
                    });
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        pagarItem() {
            this.$refs.pagarconta.open({ item: this.item });
        },
    },
};
</script>

<style scoped>
.item-recibo {
    max-width: 100%;
    object-fit: contain;
}

.touch {
    touch-action: pan-y !important;
}
</style>