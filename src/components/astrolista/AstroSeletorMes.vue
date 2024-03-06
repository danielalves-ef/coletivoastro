<template>
    <v-toolbar color="transparent" dense flat>
        <v-btn @click="mesAnterior" icon>
            <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-spacer></v-spacer>

        <v-toolbar-title>
            <b> {{ meses[mes].nome }} - {{ ano }}</b>
        </v-toolbar-title>

        <v-spacer></v-spacer>
        <v-btn @click="mesSeguinte" icon>
            <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
    </v-toolbar>
</template>

<script>
import { meses } from "@/assets/variables/variables.js";

export default {
    name: "astro-seletor-mes",
    data() {
        return {
            meses: meses,
        };
    },
    computed: {
        mes() {
            return this.$route.query.mes !== undefined &&
                this.$route.query.mes !== null &&
                this.$route.query.mes !== ""
                ? +this.$route.query.mes
                : new Date().getMonth();
        },
        ano() {
            return this.$route.query.ano !== undefined &&
                this.$route.query.ano !== null &&
                this.$route.query.ano !== ""
                ? +this.$route.query.ano
                : new Date().getFullYear();
        },
    },
    methods: {
        mesSeguinte() {
            let mesSeguinte = this.mes + 1;
            let ano = this.ano;
            if (mesSeguinte > 11) {
                mesSeguinte = 0;
                ano++;
            }
            this.$router.push({
                query: { mes: mesSeguinte, ano: ano },
            });
        },
        mesAnterior() {
            let mesAnterior = this.mes - 1;
            let ano = this.ano;
            if (mesAnterior < 0) {
                mesAnterior = 11;
                ano--;
            }
            this.$router.push({
                query: { mes: mesAnterior, ano: ano },
            });
        },
    },
};
</script>

<style>
</style>