<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h1>Perfil</h1>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-title class="primary gradient white--text">
                        <v-icon dark class="mr-2"
                            >mdi-card-account-details-outline</v-icon
                        >
                        Dados Pessoais
                    </v-card-title>
                    <v-card-text>
                        <v-list>
                            <v-list-item>
                                <v-list-item-icon>
                                    <v-icon> mdi-account </v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-subtitle>
                                        Nome:
                                    </v-list-item-subtitle>
                                    <v-list-item-title>
                                        {{ usuario.displayName }}
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-icon>
                                    <v-icon> mdi-email-outline </v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-subtitle>
                                        Email:
                                    </v-list-item-subtitle>
                                    <v-list-item-title>
                                        {{ usuario.email }}
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    computed: {
        usuario() {
            return this.$store.state.auth.usuario;
        },
    },
};
</script>

<style>
</style>