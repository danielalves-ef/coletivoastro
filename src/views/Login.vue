<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" lg="8">
                <v-fade-transition mode="out-in">
                    <v-alert
                        v-if="usuario"
                        class="text-center mt-5"
                        text
                        prominent
                        color="primary"
                        border="top"
                        key="alert-login"
                    >
                        <h2
                            class="mb-4"
                            :class="[
                                $vuetify.theme.isDark
                                    ? 'grey--text text--lighten-2'
                                    : 'black--text',
                            ]"
                        >
                            Sessão Iniciada
                        </h2>
                        <p
                            class="body-1 mb-2"
                            :class="[
                                $vuetify.theme.isDark
                                    ? 'grey--text text--lighten-2'
                                    : 'black--text',
                            ]"
                        >
                            Voce ja esta conectado com:
                        </p>
                        <p
                            class="body-1 mb-2"
                            :class="[
                                $vuetify.theme.isDark
                                    ? 'grey--text text--lighten-2'
                                    : 'black--text',
                            ]"
                        >
                            <i> {{ usuario.email }}</i>
                        </p>

                        <div class="flex justify-center mt-4">
                            <v-btn
                                class="gradient"
                                color="primary"
                                @click="logout"
                            >
                                <v-icon class="mr-2" small> mdi-logout </v-icon>
                                Finalizar sessão</v-btn
                            >
                        </div>
                        <div class="flex justify-center mt-4">
                            <v-btn
                                color="warning"
                                class="gradient"
                                :to="{ name: 'home' }"
                            >
                                <v-icon class="mr-2" small> mdi-home </v-icon>
                                Pagina inicial</v-btn
                            >
                        </div>
                    </v-alert>

                    <v-alert
                        v-else
                        class="text-center mt-5"
                        text
                        key="alert-logout"
                        prominent
                        color="primary"
                        border="top"
                    >
                        <h2
                            :class="[
                                $vuetify.theme.isDark
                                    ? 'grey--text text--lighten-2'
                                    : 'black--text',
                            ]"
                        >
                            Iniciar sessão
                        </h2>
                        <p
                            class="body-1"
                            :class="[
                                $vuetify.theme.isDark
                                    ? 'grey--text text--lighten-2'
                                    : 'black--text',
                            ]"
                        >
                            Inicie uma sessão para poder usar de todos os
                            recursos que o site oferece
                        </p>
                        <v-btn
                            color="primary"
                            dark
                            large
                            :style="{ textTransform: 'unset' }"
                            @click="loginWithGoogle"
                        >
                            {{ $t("login.entrarCom") }} Google
                            <v-icon class="ml-2" small> mdi-google </v-icon>
                        </v-btn>
                    </v-alert>
                </v-fade-transition>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: "login",
    data() {
        return {};
    },
    computed: {
        usuario() {
            return this.$store.state.auth.usuario;
        },
    },
    methods: {
        logout() {
            this.$auth.signOut();
        },
        loginWithGoogle() {
            const provider = new this.$firebase.auth.GoogleAuthProvider();
            // provider.addScope(
            //     "https://www.googleapis.com/auth/contacts.readonly"
            // );

            this.$auth
                .signInWithPopup(provider)
                .then((result) => {
                    console.log(result);
                    const user = result.user;
                    const newUser = result.additionalUserInfo.isNewUser;

                    this.$store
                        .dispatch("auth/loginIntoStore", user)
                        .then((usuario) => {
                            if (newUser) {
                                usuario.config = {
                                    tema: {
                                        dark: true,
                                        primary: "#673ab7",
                                    },
                                };
                                usuario.favoritos = [];
                                this.$firestore
                                    .collection("usuarios")
                                    .doc(usuario.email)
                                    .set(usuario);
                            } else {
                                this.$store.dispatch("config/initConfig");
                            }
                            setTimeout(() => {
                                // VERIFICAR SE TEM 'ROUTER FROM' SETADO
                                const routeTo =
                                    this.$store.state.controles.routeTo;
                                if (routeTo) {
                                    this.$router.push(routeTo);
                                } else {
                                    this.$router.push({ name: "home" });
                                }
                            }, 1000);
                        });
                })
                .catch((error) => {
                    // const errorCode = error.code;
                    const errorMessage = error.message;
                    // const email = error.email;
                    // const credential = error.credential;
                    alert(errorMessage);
                    console.log(error);
                });
        },
    },
};
</script>

<style>
</style>