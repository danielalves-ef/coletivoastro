<template>
    <v-list-item
        v-if="notificacao"
        :key="notificacao.id"
        dense
        three-line
        link
        :style="{ transform: `translateX(${atual}px)` }"
        v-hammer:panstart="panStart"
        v-hammer:pan.horizontal="panItem"
        v-hammer:panend="panEnd"
        v-hammer:pancancel="panEnd"
        v-hammer:panmove="panMove"
        class="primary darken-4 touch"
        :class="[atual === 0 ? 'animate' : '']"
    >
        <v-list-item-avatar :size="40" color="primary">
            <v-icon dark :size="25">$appcontas</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
            <v-list-item-subtitle class="grey--text"
                ><small>{{ notificacao.app }} </small></v-list-item-subtitle
            >
            <v-list-item-subtitle v-text="notificacao.texto">
                <!-- <strong> Mercadona 15-02 </strong>
                                    foi adicionado a lista
                                    <strong> "Mercado" </strong> -->
            </v-list-item-subtitle>
            <v-list-item-subtitle class="grey--text">
                <small>
                    {{ $helpers.momento(notificacao.criadaEm) }}
                </small>
            </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action v-if="false">
            <v-btn color="primary" icon>
                <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
        </v-list-item-action>
    </v-list-item>
</template>

<script>
export default {
    data() {
        return {
            inicio: null,
            atual: 0,
        };
    },
    props: {
        notificacao: {
            type: Object,
            required: true,
        },
    },
    methods: {
        panItem(event) {
            console.log({ pan: event });
            event.preventDefault();
            // const delta = event.center.x - this.inicio;
            // this.atual = delta;
        },
        panMove(event) {
            console.log({ move: event });
            event.preventDefault();
            const delta = event.center.x - this.inicio;
            this.atual = delta;
        },
        panStart(event) {
            event.preventDefault();
            console.log({ start: event });
            this.inicio = event.center.x;
        },
        panEnd(event) {
            event.preventDefault();
            console.log({ end: event });
            this.atual = 0;
        },
    },
};
</script>

<style>
.touch {
    touch-action: pan-y !important;
}
</style>