<template>
    <div>
        <slot v-bind:id="activator">
            <v-text-field
                v-model="dateFormatted"
                label="Data"
                append-icon="mdi-calendar"
                readonly
                dense
                outlined
                hide-details="auto"
                :id="activator"
            ></v-text-field>
        </slot>
        <v-bottom-sheet ref="seletor" :activator="'#' + activator">
            <!-- <template v-slot:activator="{ on, attrs }">
            <v-text-field
                v-model="dateFormatted"
                label="Data"
                append-icon="mdi-calendar"
                readonly
                dense
                outlined
                v-bind="attrs"
                hide-details="auto"
                v-on="on"
            ></v-text-field>
        </template> -->
            <v-date-picker
                class="text-center pb-10"
                @input="inputDatapicker"
                v-model="date"
                scrollable
                locale="pt-br"
                color="primary"
                header-color="primary"
            >
            </v-date-picker>
        </v-bottom-sheet>
    </div>
</template>

<script>
export default {
    props: {
        activator: {
            type: String,
            default: "seletor-data",
        },
        data: {
            type: [String, Boolean],
            default: false,
        },
    },
    data(vm) {
        return {
            date: vm.data
                ? new Date(vm.data).toISOString().substr(0, 10)
                : new Date().toISOString().substr(0, 10),
            dateFormatted: vm.data
                ? vm.formatDate(new Date(vm.data).toISOString().substr(0, 10))
                : vm.formatDate(new Date().toISOString().substr(0, 10)),
            menu: false,
        };
    },
    methods: {
        formatDate(date) {
            if (!date) return null;

            // const [year, month, day] = date.split("-");
            // return `${month}/${day}/${year}`;

            return new Date(date).toLocaleString("pt-BR", {
                year: "2-digit",
                month: "numeric",
                day: "numeric",
            });
        },
        inputDatapicker() {
            // this.$emit("selecionar", this.date);
            // this.menu = false;
            this.close();
        },
        close() {
            this.$refs.seletor.save();
        },
    },
    watch: {
        date() {
            this.dateFormatted = this.formatDate(this.date);
            this.$emit("selecionar", this.date);
        },
    },
    created() {
        this.$emit("selecionar", this.date);
    },
};
</script>

<style>
</style>