<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h2>Criar lista</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-title class="primary gradient">
                        Detalhes da lista
                    </v-card-title>
                    <v-card-text>
                        <v-text-field label="Nome"> </v-text-field>
                        <v-textarea
                            label="Descrição"
                            rows="1"
                            auto-grow
                        ></v-textarea>
                        <v-subheader> Convidar pessoas: </v-subheader>
                        <v-text-field
                            outlined
                            append-outer-icon="mdi-plus-circle"
                            label="email"
                        ></v-text-field>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <div v-for="user in users" :key="user.email">
            {{ user.email }}
        </div>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            users: [],
        };
    },
    methods: {
        getUsers() {
            this.users = [];
            this.$firestore
                .collection("usuarios")
                .get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        this.users.push(doc.data());
                    });
                });
        },
    },
    mounted() {
        this.getUsers();
    },
};
</script>

<style>
</style>