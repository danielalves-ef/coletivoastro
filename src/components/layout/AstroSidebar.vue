<template>
    <v-navigation-drawer v-model="menuAtivo" app temporary height="100%">
        <template v-slot:prepend>
            <div class="primary py-3 px-3 d-flex align-center gradient">
                <v-icon class="white--text" size="50">$astrologo</v-icon>
                <div class="white--text ml-3 notoserif">
                    <span>Coletivo Astro</span>
                </div>
            </div>
            <v-list :key="'itemlogin-' + $vuetify.theme.dark" nav>
                <v-list-item
                    v-if="!usuario"
                    class="v-list-item--active"
                    two-line
                    color="primary"
                    @click="
                        () => {
                            if ($route.name !== 'login') {
                                $router.push({ name: 'login' });
                            } else {
                                menuAtivo = false;
                            }
                        }
                    "
                >
                    <v-list-item-avatar>
                        <v-icon
                            :color="$vuetify.theme.isDark ? '#fff' : 'primary'"
                            large
                            >mdi-incognito-circle-off</v-icon
                        >
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title
                            :class="{ 'white--text': $vuetify.theme.isDark }"
                            >Iniciar sessão</v-list-item-title
                        >
                        <v-list-item-subtitle>
                            desconectado
                            <v-icon size="10" color="error"
                                >mdi-checkbox-blank-circle</v-icon
                            >
                        </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-btn
                            small
                            :color="$vuetify.theme.isDark ? '#fff' : 'primary'"
                            plain
                            fab
                        >
                            <div
                                class="
                                    d-flex
                                    flex-column
                                    justify-center
                                    align-center
                                "
                            >
                                <v-icon class="mb-0">mdi-login</v-icon>
                            </div>
                        </v-btn>
                    </v-list-item-action>
                </v-list-item>

                <v-list-item
                    v-else
                    class="v-list-item--active"
                    two-line
                    color="primary"
                    link
                    :to="{ name: 'perfil' }"
                >
                    <v-list-item-avatar>
                        <img :src="usuario.photoURL" alt="John" />
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title
                            :class="{ 'white--text': $vuetify.theme.isDark }"
                            >{{ usuario.displayName }}</v-list-item-title
                        >
                        <v-list-item-subtitle>
                            conectado
                            <v-icon size="10" color="success"
                                >mdi-checkbox-blank-circle</v-icon
                            >
                        </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-btn
                            small
                            :color="$vuetify.theme.isDark ? '#fff' : 'primary'"
                            plain
                            fab
                        >
                            <v-icon class="mb-0">mdi-account-cog</v-icon>
                        </v-btn>
                    </v-list-item-action>
                </v-list-item>
            </v-list>
        </template>

        <v-list :key="'1' + $vuetify.theme.dark" nav dense>
            <v-list-item-group
                :active-class="$vuetify.theme.dark ? 'my-brightness' : ''"
                color="primary"
            >
                <template v-for="item in itensMenu">
                    <!-- LINK SEM CHILDREN -->
                    <v-list-item
                        :exact="item.router.name === 'home'"
                        v-if="!item.children || item.children.length === 0"
                        :key="'item-menu-' + item.name"
                        :to="item.router"
                    >
                        <v-list-item-icon>
                            <v-icon
                                :color="
                                    $vuetify.theme.isDark
                                        ? 'grey lighten-2'
                                        : ''
                                "
                                >{{ item.icon }}</v-icon
                            >
                        </v-list-item-icon>
                        <v-list-item-title
                            :class="[
                                $vuetify.theme.isDark
                                    ? 'grey--text text--lighten-2'
                                    : '',
                            ]"
                            >{{ item.name }}</v-list-item-title
                        >
                    </v-list-item>

                    <!-- LINK COM CHILDREN -->
                    <v-list-group
                        v-else
                        :key="'item-submenu-' + item.name"
                        :value="item.opened || false"
                        :prepend-icon="item.icon"
                    >
                        <template v-slot:activator>
                            <v-list-item-content>
                                <v-list-item-title>{{
                                    item.name
                                }}</v-list-item-title>
                            </v-list-item-content>
                        </template>
                        <v-list-item
                            v-for="child in item.children"
                            :key="'item-menu-' + child.name"
                            :to="child.router"
                            class="ml-5"
                        >
                            <v-list-item-icon
                                ><v-icon
                                    :color="
                                        $vuetify.theme.isDark
                                            ? 'grey lighten-2'
                                            : ''
                                    "
                                    class="my-stroke"
                                    >{{ child.icon }}</v-icon
                                ></v-list-item-icon
                            >
                            <v-list-item-title
                                :class="[
                                    $vuetify.theme.isDark
                                        ? 'grey--text text--lighten-2'
                                        : '',
                                ]"
                                >{{ child.name }}</v-list-item-title
                            >
                        </v-list-item>
                    </v-list-group>
                </template>
            </v-list-item-group>
        </v-list>

        <v-divider></v-divider>
        <v-subheader> Configurações</v-subheader>
        <div>
            <ajustes-personalizar></ajustes-personalizar>
            <astro-select-locale></astro-select-locale>
        </div>

        <!-- BOTAO LOGOUT -->
        <div class="pa-5">
            <v-btn @click="$auth.signOut()" block plain color="error">
                <v-icon class="mr-1">mdi-logout</v-icon> {{ $t("login.sair") }}
            </v-btn>
        </div>
        <!-- <v-container class="d-flex flex-wrap justify-center">
            <v-btn dark @click="toggleTema"> Trocar tema</v-btn>
        </v-container>
        <v-container class="d-flex flex-wrap justify-center">
            <v-btn
                v-for="(color, name) in colors"
                :key="name"
                :color="color.base"
                @click="changeColor(name)"
                height="40"
                width="40"
                fab
            >
            </v-btn>
        </v-container> -->
        <v-subheader class="justify-center">Version 1.0.4</v-subheader>
    </v-navigation-drawer>
</template>

<script>
import colors from "vuetify/lib/util/colors";
import AstroSelectLocale from "@/components/layout/AstroSelectLocale.vue";
import AjustesPersonalizar from "@/components/ajustes/AjustesPersonalizar.vue";

export default {
    components: { AstroSelectLocale, AjustesPersonalizar },
    name: "astro-sidebar",
    data: () => ({
        colors,
        group: 0,
        itensMenuDefault: [
            {
                name: "Home",
                router: { name: "home" },
                icon: "mdi-home",
            },
            {
                name: "Sobre",
                router: { name: "sobre" },
                icon: "mdi-account",
            },
            {
                name: "Ajuda",
                router: { name: "ajuda" },
                icon: "mdi-information",
            },
            {
                name: "Apps",
                opened: false,
                icon: "mdi-widgets",
                children: [
                    {
                        name: "Contas",
                        router: { name: "contas" },
                        icon: "$appcontas",
                    },
                ],
            },
            // {
            //     name: "Favoritos",
            //     opened: false,
            //     icon: "mdi-heart-outline",
            //     children: [
            //         {
            //             name: "Contas",
            //             router: "contas",
            //             icon: "$appcontas",
            //         },
            //     ],
            // },
        ],
        //
    }),
    computed: {
        itensMenu() {
            const itens = [...this.itensMenuDefault];
            if (this.favoritos.length > 0) {
                const favoritos = {
                    name: "Favoritos",
                    opened: this.favoritos.length ? true : false,
                    icon: "mdi-star",
                };
                favoritos.children = [];
                this.favoritos.forEach((favorito) => {
                    favoritos.children.push({
                        name: favorito.titulo,
                        router: favorito.route,
                        icon: "$app" + favorito.app,
                    });
                });
                itens.push(favoritos);
            }
            return itens;
        },
        favoritos() {
            return this.$store.state.usuario.favoritos.favoritos;
        },
        isDark() {
            return this.$vuetify.theme.isDark;
        },
        usuario() {
            return this.$store.state.auth.usuario;
        },
        menuAtivo: {
            get() {
                return this.$store.state.controles.menuAtivo;
            },
            set(val) {
                this.$store.dispatch("controles/setMenu", val);
            },
        },
    },
    methods: {
        toggleTema() {
            const temaActual = this.$vuetify.theme.dark;
            this.$vuetify.theme.dark = !temaActual;
            localStorage.setItem("theme_isDark", this.$vuetify.theme.dark);
        },

        changeColor(color) {
            const srt = color;
            const exp = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
            const isHash = exp.test(srt);
            let cor;
            if (isHash) {
                cor = color;
            } else {
                if (colors[color]) {
                    cor = colors[color].base;
                }
            }
            this.$vuetify.theme.themes.dark.primary = cor;
            this.$vuetify.theme.themes.light.primary = cor;
            localStorage.setItem("theme_primary", cor);
        },
    },
    created() {
        console.log("created sidebar");
    },
    mounted() {
        // this.$store.dispatch("config/getFavoritos");
        console.log("mounted sidebar");
    },
};
</script>

<style>
</style>