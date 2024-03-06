<template>
    <div>
        <v-list
            class="astro-lista pa-0"
            v-click-outside="resetarAtivo"
            color="transparent"
        >
            <!-- ITENS -->
            <template v-if="itens.length > 0">
                <transition-group name="list" tag="div" mode="out-in">
                    <div
                        class="astro-item-container list-item list-type-card"
                        v-hammer:swipe.horizontal="
                            (e) => {
                                onSwipe(e, index);
                            }
                        "
                        v-for="(item, index) in itens"
                        :key="item.id || index"
                    >
                        <div class="astro-item-back gradient primary">
                            <div class="astro-back-btn">
                                <v-btn
                                    v-if="btnCheck"
                                    class="list-action gradient"
                                    size="large"
                                    :color="buttonConfig.check.color"
                                    tile
                                    type="gradient"
                                    height="100%"
                                    @click="checkItem({ item, index })"
                                >
                                    <div class="d-flex flex-column">
                                        <v-icon icon="check">{{
                                            buttonConfig.check.icon
                                        }}</v-icon>
                                        <small>{{
                                            buttonConfig.check.text
                                        }}</small>
                                    </div>
                                </v-btn>
                                <v-btn
                                    v-if="btnInfo"
                                    type="gradient"
                                    class="list-action gradient"
                                    size="large"
                                    height="100%"
                                    tile
                                    :color="buttonConfig.info.color"
                                    @click="infoItem({ item, index })"
                                >
                                    <div class="d-flex flex-column">
                                        <v-icon icon="public">{{
                                            buttonConfig.info.icon
                                        }}</v-icon>
                                        <small>{{
                                            buttonConfig.info.text
                                        }}</small>
                                    </div>
                                </v-btn>
                            </div>
                            <div class="astro-back-btn">
                                <v-btn
                                    v-if="btnEditar"
                                    class="list-action gradient"
                                    :color="buttonConfig.editar.color"
                                    size="large"
                                    type="gradient"
                                    tile
                                    height="100%"
                                    @click="editarItem({ item, index })"
                                >
                                    <div class="d-flex flex-column">
                                        <v-icon icon="edit">{{
                                            buttonConfig.editar.icon
                                        }}</v-icon>
                                        <small>{{
                                            buttonConfig.editar.text
                                        }}</small>
                                    </div>
                                </v-btn>
                                <v-btn
                                    v-if="btnDeletar"
                                    :color="buttonConfig.deletar.color"
                                    size="large"
                                    class="list-action gradient"
                                    type="gradient"
                                    tile
                                    height="100%"
                                    @click="confirmarDeletar({ item, index })"
                                >
                                    <div class="d-flex flex-column">
                                        <v-icon icon="delete">{{
                                            buttonConfig.deletar.icon
                                        }}</v-icon>
                                        <small>{{
                                            buttonConfig.deletar.text
                                        }}</small>
                                    </div>
                                </v-btn>
                            </div>
                        </div>
                        <v-list-item
                            dark
                            v-hammer:tap="
                                () => {
                                    onTap({ item, index });
                                }
                            "
                            v-hammer:press="
                                () => {
                                    onPress({ item, index });
                                }
                            "
                            class="astro-item-front primary gradient px-3"
                            :style="{
                                transform:
                                    ativo.index === index
                                        ? `translateX(${ativo.x}px)`
                                        : '',
                            }"
                            :key="item.id"
                            link
                        >
                            <template v-if="$scopedSlots.itemAvatar">
                                <slot name="itemAvatar" :item="item"> </slot>
                            </template>
                            <template v-else>
                                <v-list-item-avatar
                                    class="mr-3 gradient"
                                    size="35"
                                    :color="item.cor || 'primary'"
                                >
                                    <v-icon>
                                        {{
                                            icon === "auto" ? item.icone : icon
                                        }}</v-icon
                                    >
                                </v-list-item-avatar>
                            </template>

                            <v-list-item-content>
                                <!-- ITEM TITULO -->
                                <template
                                    v-if="
                                        item[itemTitulo] ||
                                        $scopedSlots.itemTitulo
                                    "
                                >
                                    <v-list-item-title class="mb-1">
                                        <slot name="itemTitulo" :item="item">
                                            <template
                                                v-if="!$scopedSlots.itemTitulo"
                                            >
                                                {{ item[itemTitulo] }}
                                            </template>
                                        </slot>
                                    </v-list-item-title>
                                </template>
                                <!-- ITEM SUBTITULO -->
                                <template
                                    v-if="
                                        itemSubtitulo ||
                                        $scopedSlots.itemSubtitulo
                                    "
                                >
                                    <template
                                        v-if="!$scopedSlots.itemSubtitulo"
                                    >
                                        <v-list-item-subtitle
                                            v-html="
                                                typeof itemSubtitulo ===
                                                'string'
                                                    ? item[itemSubtitulo]
                                                    : itemSubtitulo(item)
                                            "
                                        >
                                        </v-list-item-subtitle>
                                    </template>
                                    <template v-else>
                                        <v-list-item-subtitle>
                                            <slot
                                                name="itemSubtitulo"
                                                :item="item"
                                            >
                                            </slot>
                                        </v-list-item-subtitle>
                                    </template>
                                </template>
                            </v-list-item-content>
                            <v-list-item-action class="mr-1">
                                <v-btn
                                    v-if="false"
                                    @click="actionItem({ item, index })"
                                    icon
                                >
                                    <v-icon color="white lighten-1"
                                        >mdi-chevron-right</v-icon
                                    >
                                </v-btn>
                                <v-list-item-action-text class="text-center">
                                    <span class="text-caption">
                                        {{
                                            item.mesText.substr(0, 3)
                                                | capitalize
                                        }}
                                    </span>
                                    <v-divider></v-divider>
                                    <!-- <br /> -->
                                    <span :style="{ fontSize: '20px' }">
                                        {{ item.dataText.split("/")[0] }}
                                    </span>
                                </v-list-item-action-text>
                            </v-list-item-action>
                        </v-list-item>
                    </div>
                </transition-group>
            </template>
            <!-- LOADING -->
            <template v-else-if="itens.length === 0 && !itensLoaded">
                <div key="itensLoading">
                    <h3 class="text-black text-lg text-center pt-3">
                        <v-progress-circular
                            indeterminate
                            color="primary"
                        ></v-progress-circular>
                    </h3>
                </div>
            </template>
            <!-- NO ITENS -->
            <template v-else-if="itens.length === 0 && itensLoaded">
                <div key="ifzero">
                    <h3 class="text-black text-lg text-center pt-3">
                        <slot name="noItem">
                            {{ noItem ? noItem : "Não há itens" }}
                        </slot>
                    </h3>
                </div>
            </template>
        </v-list>
    </div>
</template>

<script>
export default {
    name: "astro-lista-itens",
    directives: {},
    props: {
        itensLoaded: {
            type: Boolean,
            default: false,
        },
        itens: {
            type: Array,
            default: () => {
                return [];
            },
        },
        icon: {
            type: String,
            default: "auto",
        },
        noItem: {
            type: String,
            default: null,
        },
        btnDeletar: {
            type: Boolean,
            default: true,
        },
        btnEditar: {
            type: Boolean,
            default: true,
        },
        btnInfo: {
            type: Boolean,
            default: true,
        },
        btnCheck: {
            type: Boolean,
            default: true,
        },
        btnConfig: {
            type: Object,
            default: () => ({}),
        },
        itemTitulo: {
            type: String,
            default: "titulo",
        },
        itemSubtitulo: {
            type: [Function, String],
            default: null,
        },
        link: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            ativo: {
                inicio: 0,
                x: 0,
                aberto: false,
                left: true,
                index: -1,
            },
        };
    },
    computed: {
        defaultBtnConfig() {
            return {
                deletar: {
                    icon: "mdi-delete-forever",
                    text: this.$t("btn.acoes.deletar"),
                    color: "error",
                },
                check: {
                    icon: "mdi-check",
                    text: this.$t("btn.acoes.pagar"),
                    color: "success",
                },
                editar: {
                    icon: "mdi-pencil",
                    text: this.$t("btn.acoes.editar"),
                    color: "warning",
                },
                info: {
                    icon: "mdi-information-outline",
                    text: this.$t("btn.acoes.info"),
                    color: "info",
                },
            };
        },

        buttonConfig() {
            const defaultBtnConfig = { ...this.defaultBtnConfig };
            const btnConfig = { ...this.btnConfig };

            const btns = Object.keys(btnConfig);
            btns.forEach((btn) => {
                const keys = Object.keys(btnConfig[btn]);

                keys.forEach((key) => {
                    defaultBtnConfig[btn][key] = btnConfig[btn][key];
                });
            });

            return {
                ...defaultBtnConfig,
            };
        },
        color() {
            return (pagamento) => {
                const valores = Object.values(pagamento);
                const every = valores.every((valor) => {
                    return valor;
                });
                if (every) {
                    return "success";
                }
                const some = valores.some((valor) => {
                    return valor;
                });
                if (some) {
                    return "warning";
                }
                return "danger";
            };
        },
        // contaSubtitulo() {
        //   return (item) => {
        //     return `${this.$helpers.toMoney(item.valor)} pago por ${
        //       item.quemPagou
        //     }`;
        //   };
        // },
    },
    updated() {
        console.log("Astrolista.vue updated");
        this.$emit("update");
    },
    methods: {
        // ******************************
        // METODOS DE TOUCH (SWIPE E TAP)
        // ******************************
        onTap({ item, index }) {
            this.ativo.lock = false;
            if (this.ativo.aberto) {
                this.resetarAtivo();
                return;
            }
            this.$emit("item:tap", { item, index });
        },
        onPress({ item, index }) {
            this.$emit("item:press", { item, index });
        },
        swipeLeft(index) {
            if (!this.btnEditar && !this.btnDeletar) {
                return;
            }
            this.ativo.index = index;
            this.ativo.aberto = true;
            this.ativo.left = false;
            // this.ativo.x = -140;
            this.ativo.x =
                this.btnEditar && this.btnDeletar
                    ? -140
                    : this.btnEditar || this.btnDeletar
                    ? -70
                    : 0;
        },
        swipeRight(index) {
            if (!this.btnInfo && !this.btnCheck) {
                return;
            }
            this.ativo.index = index;
            this.ativo.aberto = true;
            this.ativo.left = true;
            // this.ativo.x = 140;
            this.ativo.x =
                this.btnInfo && this.btnCheck
                    ? 140
                    : this.btnInfo || this.btnCheck
                    ? 70
                    : 0;
        },
        onSwipe(direccion, index) {
            console.log("onSwipe", direccion);

            this.ativo.lock = false;
            if (this.ativo.aberto) {
                if (index === this.ativo.index) {
                    this.resetarAtivo();
                    return;
                }
            }
            if (direccion === "left" || direccion.type === "swipeleft") {
                this.swipeLeft(index);
            } else if (
                direccion === "right" ||
                direccion.type === "swiperight"
            ) {
                this.swipeRight(index);
            }
        },

        // ******************************
        // MANIPULAÇÃO DO ATIVO
        // ******************************
        resetarAtivo() {
            if (this.ativo.lock) return;
            this.ativo.inicio = 0;
            this.ativo.x = 0;
            this.ativo.index = -1;
            this.ativo.aberto = false;
        },
        resetarLista() {
            this.ativo.inicio = 0;
            this.ativo.x = 0;
            this.ativo.index = -1;
            this.ativo.aberto = false;
            this.ativo.lock = false;
        },

        // ******************************
        // MANIPULAÇÃO DOS ITEnS
        // ******************************
        editarItem({ item, index }) {
            this.$emit("item:editar", { item, index });
        },
        infoItem({ item, index }) {
            this.$emit("item:info", { item, index });
        },
        checkItem({ item, index }) {
            this.ativo.lock = true;
            this.$emit("item:check", { item, index });
        },
        showItem({ item, index }) {
            this.$emit("item:show", { item, index });
        },
        actionItem({ item, index }) {
            this.$emit("item:action", { item, index });
        },
        async confirmarDeletar(index) {
            this.ativo.lock = true;
            const result = await this.$swal({
                title: "Deletar item",
                text: "Deseja deletar esse item?!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Deletar",
                cancelButtonText: "Cancelar",
            });
            if (result.isConfirmed) {
                this.deletarItem(index);
            } else {
                this.ativo.lock = false;
                this.resetarAtivo();
            }
        },
        deletarItem({ item, index }) {
            this.ativo.lock = false;
            this.resetarAtivo();
            this.$emit("item:deletar", { item, index });
        },
    },
    mounted() {
        console.log(this);
    },
    // destroyed() {
    //     this.$store.dispatch("appcontas/destruirLista");
    // },
};
</script>

<style lang="scss">
@import "@/scss/astrolista.scss";
</style>
