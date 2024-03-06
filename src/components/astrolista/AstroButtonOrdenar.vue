<template>
    <div>
        <slot>
            <div class="d-flex justify-center">
                <span v-if="label" class="text-caption d-flex align-center"
                    >Ordenado por <i class="ml-1">{{ ordemText }}</i></span
                >
                <v-spacer></v-spacer>
                <v-btn class="pr-0" small text :id="activator">
                    ordenar por <v-icon small>mdi-chevron-down</v-icon>
                </v-btn>
            </div>
        </slot>
        <v-bottom-sheet ref="seletor" :activator="'#' + activator">
            <!-- <template v-slot:activator="{ on, attrs }">
            
        </template> -->
            <v-list class="text-center pb-10">
                <v-subheader dark class="justify-center primary gradient">
                    Ordenar por:
                    <v-spacer></v-spacer>
                    <v-btn icon @click="changeDirecion">
                        <v-icon>
                            {{
                                direcion === "asc"
                                    ? "mdi-sort-ascending"
                                    : "mdi-sort-descending"
                            }}
                        </v-icon>
                    </v-btn>
                </v-subheader>
                <v-list-item
                    v-for="item in itens"
                    :key="item.titulo"
                    link
                    @click="ordenarItens(item.ordem)"
                >
                    <v-list-item-title class="ml-n16">
                        <v-list-item-icon>
                            <v-icon>{{ item.icone }}</v-icon>
                        </v-list-item-icon>

                        {{ item.titulo }}
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-bottom-sheet>
    </div>
</template>

<script>
export default {
    name: "astro-button-ordenar",
    props: {
        label: {
            type: Boolean,
            default: false,
        },
        activator: {
            type: String,
            default: "ordenarButton",
        },
    },
    data() {
        return {
            itens: [
                {
                    ordem: "conceito",
                    titulo: "Nome",
                    icone: "mdi-clipboard-list-outline",
                },
                { ordem: "valor", titulo: "Valor", icone: "mdi-cash" },
                { ordem: "now", titulo: "Data", icone: "mdi-calendar" },
                {
                    ordem: "icone",
                    titulo: "Icone",
                    icone: "mdi-emoticon-outline",
                },
                {
                    ordem: "quemPagou",
                    titulo: "Quem pagou",
                    icone: "mdi-account",
                },
            ],
            bottomSheet: false,
            // ordem: "asc",
        };
    },
    computed: {
        direcion: {
            get() {
                return this.$store.state.appcontas.lista.direcion;
            },
            set(val) {
                this.$store
                    .dispatch("appcontas/lista/setDirecion", val)
                    .then(() => {
                        this.$store.dispatch("appcontas/lista/ordenarItens");
                    });
            },
        },
        ordem() {
            return this.$store.state.appcontas.lista.ordem;
        },
        ordemText() {
            return this.itens.find((item) => {
                return item.ordem === this.ordem;
            }).titulo;
        },
    },
    methods: {
        changeDirecion() {
            if (this.direcion === "asc") {
                this.direcion = "desc";
                // this.setDirecion("desc");
            } else {
                this.direcion = "asc";
                // this.setDirecion("asc");
            }
        },
        fecharMenu() {
            this.$refs.seletor.save();
        },
        setDirecion(direcion) {
            this.$store
                .dispatch("appcontas/lista/setDirecion", direcion)
                .then(() => {
                    this.$store.dispatch("appcontas/lista/ordenarItens");
                });
        },
        ordenarItens(ordem) {
            this.$store.dispatch("appcontas/lista/setOrdem", ordem).then(() => {
                this.$store.dispatch("appcontas/lista/ordenarItens");
            });
            // this.$emit("lista:ordenar", ordem);
            this.fecharMenu();
        },
    },
};
</script>

<style>
</style>