<template>
    <div>
        <v-card>
            <v-card-title> Buscar contato </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="12">
                        <v-text-field
                            filled
                            append-icon="mdi-magnify"
                            v-model="emailToSearch"
                            @click:append="buscarUsuario"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-list>
                            <v-list-item
                                link
                                v-for="usuario in usuarios"
                                :key="usuario.email"
                            >
                                <v-list-item-avatar>
                                    <img :src="usuario.photoURL" alt="" />
                                </v-list-item-avatar>
                                <v-list-item-content>
                                    <v-list-item-title>
                                        {{ usuario.displayName }}
                                    </v-list-item-title>
                                    <v-list-item-subtitle>
                                        {{ usuario.email }}
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
export default {
    name: "contatos-search",
    data() {
        return {
            emailToSearch: "",
            usuarios: [],
        };
    },
    methods: {
        buscarUsuario() {
            this.usuarios = [];
            const email = this.emailToSearch;
            this.$firestore
                .collection("usuarios")
                .where("email", "==", email)
                .get()
                .then((snapshot) => {
                    console.log(snapshot);
                    snapshot.forEach((doc) => {
                        this.usuarios.push(doc.data());
                    });
                });
        },
    },
};
</script>

<style>
</style>