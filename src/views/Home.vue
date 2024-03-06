<template>
    <v-container>
        <div class="home">
            <v-row>
                <v-col>
                    <h1 class="text-center">{{ saudacao }}</h1>
                </v-col>
            </v-row>

            <v-row justify="center" class="text-center">
                <v-col cols="12">
                    <astro-divider>Apps</astro-divider>
                </v-col>
                <v-col cols="auto">
                    <v-btn
                        height="90"
                        width="90"
                        color="primary"
                        class="gradient rounded-xl"
                        :to="{ name: 'contas' }"
                    >
                        <v-icon color="#ffffff" size="70">
                            $appcontasdual
                        </v-icon>
                    </v-btn>
                    <p class="text-h6">Contas</p>
                </v-col>
                <v-col cols="auto" align-self="center">
                    <v-btn
                        height="90"
                        width="90"
                        color="primary"
                        class="gradient rounded-xl"
                        :to="{ name: 'mercado' }"
                    >
                        <v-icon color="#ffffff" size="70">
                            mdi-cart-outline
                        </v-icon>
                    </v-btn>
                    <p class="text-h6">Mercado</p>
                </v-col>
                <v-col cols="auto" align-self="center">
                    <v-btn
                        height="90"
                        width="90"
                        color="primary"
                        class="gradient rounded-xl"
                        :to="{ name: 'dividas-item' }"
                    >
                        <v-icon color="#ffffff" size="70"> mdi-store </v-icon>
                    </v-btn>
                    <p class="text-h6">Dividas</p>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12">
                    <astro-divider>
                        <div class="d-flex">
                            <v-icon> mdi-star </v-icon>
                        </div>
                    </astro-divider>
                </v-col>
                <v-col
                    v-for="favorito in favoritos"
                    :key="favorito.id"
                    cols="12"
                    class="pt-0"
                >
                    <v-card class="mx-auto" outlined>
                        <v-list-item link :to="favorito.route">
                            <v-list-item-avatar
                                dark
                                tile
                                size="45"
                                color="primary"
                            >
                                <v-icon dark size="35"
                                    >$app{{ favorito.app }}</v-icon
                                >
                            </v-list-item-avatar>
                            <v-list-item-content class="py-0">
                                <v-list-item-subtitle
                                    class="grey--text text-body-2"
                                >
                                    App {{ favorito.app | capitalize }}
                                </v-list-item-subtitle>
                                <v-list-item-title class="text-h6">
                                    {{ favorito.titulo }}
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-card>
                </v-col>
            </v-row>
        </div>
    </v-container>
</template>

<script>
import AstroDivider from "@/components/layout/AstroDivider.vue";
// @ is an alias to /src

export default {
    name: "Home",
    components: { AstroDivider },
    computed: {
        saudacao() {
            if (!this.$auth.currentUser) {
                return "Home";
            }
            const nome = this.$auth.currentUser.displayName.split(" ")[0];
            const hora = new Date().getHours();
            const saludo =
                hora > 6 && hora < 12
                    ? "Bom dia"
                    : hora >= 12 && hora < 18
                    ? "Boa tarde"
                    : "Boa noite";
            return `${saludo} ${nome}`;
        },
        favoritos() {
            return this.$store.state.usuario.favoritos.favoritos;
        },
        link() {
            return (link) => {
                return link.substring(
                    link.indexOf("/") + 1,
                    link.lastIndexOf("/")
                );
            };
        },
        getFavoritoIcon() {
            return (path) => {
                let icon = "mdi-heart";

                const app = this.link(path);

                switch (app) {
                    case "contas":
                        icon = "$appcontas";
                        break;

                    default:
                        icon = "mdi-heart";
                        break;
                }
                console.log(path);
                return icon;
            };
        },
    },
    created() {
        console.log("created home");
    },
    mounted() {
        console.log("mounted home");
    },
};
</script>
