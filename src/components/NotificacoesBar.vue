<template >
    <div>
        <slot v-bind:id="activator">
            <v-btn icon :id="activator">
                <v-badge
                    overlap
                    top
                    color="error"
                    :value="notificacoes.length"
                    :content="notificacoes.length"
                >
                    <v-icon :class="[notificacoes.length ? 'animate-bell' : '']"
                        >mdi-bell-outline</v-icon
                    >
                </v-badge>
            </v-btn>
        </slot>
        <v-bottom-sheet scrollable ref="seletor" :activator="'#' + activator">
            <v-card>
                <v-toolbar dark class="primary gradient" flat dense>
                    <v-toolbar-title>Notificações</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn @click.stop="close" icon>
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text class="pa-0">
                    <template v-for="notificacao in notificacoes">
                        <!-- <astro-lista-item
                            :notificacao="notificacao"
                            :key="notificacao.id"
                        ></astro-lista-item> -->

                        <v-list-item
                            v-if="notificacao"
                            :key="notificacao.id"
                            dense
                            three-line
                            link
                            exact
                            :to="notificacao.route"
                        >
                            <v-list-item-avatar :size="40" color="primary">
                                <v-icon dark :size="25">$appcontas</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-subtitle class="grey--text"
                                    ><small
                                        >{{ notificacao.app }}
                                    </small></v-list-item-subtitle
                                >
                                <v-list-item-subtitle
                                    v-html="notificacao.texto"
                                >
                                </v-list-item-subtitle>
                                <v-list-item-subtitle class="grey--text">
                                    <small>
                                        {{
                                            $helpers.momento(
                                                notificacao.criadaEm
                                            )
                                        }}
                                    </small>
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action v-if="false">
                                <v-btn color="primary" icon>
                                    <v-icon>mdi-dots-vertical</v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>

                        <v-divider
                            :key="notificacao.id + '-divider'"
                        ></v-divider>
                    </template>
                </v-card-text>
            </v-card>
        </v-bottom-sheet>
    </div>
</template>

<script>
// import AstroListaItem from "./AstroListaItem.vue";
export default {
    components: {},
    name: "notificacoes",

    props: {
        activator: {
            type: String,
            default: "notificacoes-icone",
        },
    },
    computed: {
        notificacoes() {
            return this.$store.state.usuario.notificacoes.notificacoes;
        },
    },
    data() {
        return {
            inicio: null,
            atual: 0,
        };
    },
    methods: {
        close() {
            this.$refs.seletor.save();
        },
        abrirNotificacao(notificacao) {
            this.$router.push(notificacao.route);
        },
        panItem(event) {
            console.log({ pan: event });
            const delta = event.center.x - this.inicio;
            this.atual = delta;
        },
        panStart(event) {
            console.log({ start: event });
            this.inicio = event.center.x;
        },
        panEnd(event) {
            console.log({ end: event });
            this.atual = 0;
        },
    },
    mounted() {
        console.log("notifcacoesBar");
        this.$store.dispatch("usuario/getNotificacoes");
    },
};
</script>

<style lang="scss">
@keyframes ring {
    0% {
        transform: rotate(0);
    }
    1% {
        transform: rotate(30deg);
    }
    3% {
        transform: rotate(-28deg);
    }
    5% {
        transform: rotate(34deg);
    }
    7% {
        transform: rotate(-32deg);
    }
    9% {
        transform: rotate(30deg);
    }
    11% {
        transform: rotate(-28deg);
    }
    13% {
        transform: rotate(26deg);
    }
    15% {
        transform: rotate(-24deg);
    }
    17% {
        transform: rotate(22deg);
    }
    19% {
        transform: rotate(-20deg);
    }
    21% {
        transform: rotate(18deg);
    }
    23% {
        transform: rotate(-16deg);
    }
    25% {
        transform: rotate(14deg);
    }
    27% {
        transform: rotate(-12deg);
    }
    29% {
        transform: rotate(10deg);
    }
    31% {
        transform: rotate(-8deg);
    }
    33% {
        transform: rotate(6deg);
    }
    35% {
        transform: rotate(-4deg);
    }
    37% {
        transform: rotate(2deg);
    }
    39% {
        transform: rotate(-1deg);
    }
    41% {
        transform: rotate(1deg);
    }
    43% {
        transform: rotate(0);
    }
    100% {
        transform: rotate(0);
    }
}

.animate-bell {
    animation: ring 4s 0.7s ease-in-out 3;
    transform-origin: 50% 4px;
}

.animate {
    transition: transform 0.5s ease;
}
</style>