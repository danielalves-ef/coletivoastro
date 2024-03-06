<template>
    <v-app-bar app color="primary" dark class="gradient">
        <v-container>
            <v-row>
                <v-col cols="12" class="d-flex align-center">
                    <router-link
                        :to="{ name: 'home' }"
                        class="d-flex align-center justify-center"
                    >
                        <!-- <v-img
                        alt="Astro Logo"
                        class="shrink mr-3 ml-1"
                        contain
                        src="@/assets/logos/astro.svg"
                        transition="scale-transition"
                        width="40"
                    /> -->
                        <img
                            class="shrink mr-3 ml-1"
                            width="40"
                            src="@/assets/logos/astro.png"
                            alt="Astro Logo"
                        />
                    </router-link>
                    <h3
                        class="white--text"
                        :style="{ fontFamily: 'Notoserif bold' }"
                    >
                        Coletivo Astro
                    </h3>

                    <v-spacer></v-spacer>
                    <notificacoes-bar key="notificacoes-bar"></notificacoes-bar>

                    <v-app-bar-nav-icon @click.stop="menuAtivo = !menuAtivo">
                        <menu-bar
                            :style="{ transform: 'scale(0.8)' }"
                        ></menu-bar>
                    </v-app-bar-nav-icon>
                </v-col>
            </v-row>
        </v-container>
    </v-app-bar>
</template>

<script>
import MenuBar from "@/components/MenuBar";
import NotificacoesBar from "@/components/NotificacoesBar";

export default {
    name: "astro-appbar",
    components: {
        MenuBar,
        NotificacoesBar,
    },
    computed: {
        menuAtivo: {
            get() {
                return this.$store.state.controles.menuAtivo;
            },
            set(val) {
                this.$store.dispatch("controles/setMenu", val);
            },
        },
    },
};
</script>

<style lang="scss">
.menu-close {
    position: absolute;
    z-index: 999999;
}
</style>