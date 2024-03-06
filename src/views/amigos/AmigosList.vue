<template>
    <div>
        <v-tabs v-model="tab">
            <v-tabs-slider color="yellow"></v-tabs-slider>

            <v-tab> Buscar contato </v-tab>
            <v-tab> Meus contatos </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
            <v-tab-item>
                <contatos-search></contatos-search>
            </v-tab-item>
            <v-tab-item>
                <h3>lista de contatos</h3>
            </v-tab-item>
        </v-tabs-items>
    </div>
</template>

<script>
import ContatosSearch from "@/components/contatos/ContatosSearch.vue";
export default {
    components: { ContatosSearch },
    name: "amigos",
    data() {
        return {
            email: "",
            usuarios: [],
            tab: 0,
        };
    },
    computed: {
        notificacoes() {
            return this.$store.state.notificacoes.notificacoes;
        },
    },
    methods: {
        getAllUsuarios() {
            this.$firestore
                .collection("usuarios")
                .get()
                .then((snapshot) =>
                    snapshot.forEach((doc) => {
                        this.usuarios.push(doc.data());
                    })
                );
        },
        errorPhoto(usuario) {
            usuario.photoURL =
                "https://developer.jboss.org/people/hrishi/avatar/46.png?a=-1";
        },
    },
    mounted() {
        // this.getAllUsuarios();
        this.$store.dispatch("notificacoes/getNotificacoes");
    },
};
</script>

<style>
</style>