<template>
    <v-app v-resize="onResize" :style="cssVars">
        <template v-show="pageLoaded">
            <astro-appbar v-show="pageLoaded"></astro-appbar>
            <astro-sidebar v-show="pageLoaded"></astro-sidebar>
            <v-main class="pb-16">
                <v-fade-transition mode="out-in">
                    <router-view />
                </v-fade-transition>

                <!-- <router-view /> -->
            </v-main>
            <!-- <astro-footer v-show="pageLoaded"></astro-footer> -->
        </template>
        <template v-if="!pageLoaded">
            <v-overlay :value="!pageLoaded">
                <v-progress-circular
                    indeterminate
                    size="64"
                ></v-progress-circular>
            </v-overlay>
        </template>
    </v-app>
</template>

<script>
import AstroSidebar from "./components/layout/AstroSidebar.vue";
import AstroAppbar from "./components/layout/AstroAppbar.vue";
// import AstroFooter from "./components/layout/AstroFooter.vue";
export default {
    name: "App",
    components: {
        AstroSidebar,
        AstroAppbar,
        //   AstroFooter
    },

    methods: {
        hexToRGB(hex, alpha) {
            var r = parseInt(hex.slice(1, 3), 16),
                g = parseInt(hex.slice(3, 5), 16),
                b = parseInt(hex.slice(5, 7), 16);

            if (alpha) {
                return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
            } else {
                return "rgb(" + r + ", " + g + ", " + b + ")";
            }
        },
        shadeColor(color, percent) {
            var R = parseInt(color.substring(1, 3), 16);
            var G = parseInt(color.substring(3, 5), 16);
            var B = parseInt(color.substring(5, 7), 16);

            R = parseInt((R * (100 + percent)) / 100);
            G = parseInt((G * (100 + percent)) / 100);
            B = parseInt((B * (100 + percent)) / 100);

            R = R < 255 ? R : 255;
            G = G < 255 ? G : 255;
            B = B < 255 ? B : 255;

            var RR =
                R.toString(16).length == 1
                    ? "0" + R.toString(16)
                    : R.toString(16);
            var GG =
                G.toString(16).length == 1
                    ? "0" + G.toString(16)
                    : G.toString(16);
            var BB =
                B.toString(16).length == 1
                    ? "0" + B.toString(16)
                    : B.toString(16);

            return "#" + RR + GG + BB;
        },
        rgbToHex(a) {
            if (~a.indexOf("#")) return a;
            a = a.replace(/[^\d,]/g, "").split(",");
            return (
                "#" +
                ((1 << 24) + (+a[0] << 16) + (+a[1] << 8) + +a[2])
                    .toString(16)
                    .slice(1)
            );
        },
        createVars(color, name = color) {
            let vars = {};
            let primary;
            if (color.indexOf("#") === -1) {
                primary = this.$vuetify.theme.themes.dark[color];
            } else {
                primary = color;
            }
            let primaryDark = this.shadeColor(primary, -60);
            let primaryDarkRgba = this.hexToRGB(primaryDark, 0.2);
            // let primaryLight = this.shadeColor(primary, 50);
            // let primaryLightRgba = this.hexToRGB(primaryLight, 0.5);
            vars["--astro-" + name] = primary;
            vars["--astro-" + name + "-dark"] = primaryDark;
            vars["--astro-" + name + "-dark-rgba"] = primaryDarkRgba;
            // vars["--astro-" + name + "-light"] = primaryLight;
            // vars["--astro-" + name + "-light-rgba"] = primaryLightRgba;
            return vars;
        },
        splitColor(string) {
            let reg = /[A-Z]/;
            let result = reg.exec(string);
            if (!result) {
                return string;
            }
            return (
                result.input.split(result[0])[0] +
                "-" +
                result[0].toLowerCase() +
                result.input.split(result[0])[1]
            );
        },
        createClassTheme() {
            const themeColors = Object.keys(this.$vuetify.theme.themes.dark);
            let html = "";
            themeColors.forEach((color) => {
                const name = this.splitColor(color);
                const classe = `
        .gradient.${name} {
          background-color: var(--astro-${name}) !important;
          background-image: linear-gradient(
            30deg,
            var(--astro-${name}-dark),
            var(--astro-${name}-dark-rgba)
          ) !important;
        }
      `;
                html += classe;
            });
            const style = `<style> ${html}  </style> `;
            document.head.innerHTML += style;
        },
        createClass() {
            const vColors = Object.entries(this.$helpers.colors);
            vColors.pop();
            const colors = vColors.map((color) => {
                return [color[0], color[1].base];
            });
            let html = "";
            colors.forEach((color) => {
                const cor = color[1];
                const name = this.splitColor(color[0]);
                const corDark = this.shadeColor(cor, -60);
                const corDarkRgba = this.hexToRGB(cor, 0.2);
                const classe = `
                    .gradient.${name} {
                    background-color: ${cor} !important;
                    background-image: linear-gradient(
                        30deg,
                        ${corDark},
                        ${corDarkRgba}
                    ) !important;
                    }
                `;
                html += classe;
            });
            const style = `<style> ${html}  </style> `;
            document.head.innerHTML += style;
        },
        onResize() {
            this.$store.dispatch("controles/getMobile");
        },
        setConfig() {
            this.$vuetify.theme.dark = this.tema.dark;
            this.$vuetify.theme.themes.dark.primary = this.tema.primary;
            this.$vuetify.theme.themes.light.primary = this.tema.primary;
        },
    },
    computed: {
        cssVars() {
            const theme = Object.keys(this.$vuetify.theme.themes.dark);
            let coresArray = [];
            theme.forEach((cor) => {
                coresArray.push(this.createVars(cor));
            });
            let cores = Object.assign(...coresArray);
            return {
                ...cores,
            };
        },
        tema() {
            return this.$store.state.usuario.config.tema;
        },
        pageLoaded() {
            return this.$store.state.controles.pageLoaded;
        },
    },
    watch: {
        "tema.primary"() {
            console.log("mudei primary");
            this.setConfig();
        },
        "tema.dark"() {
            console.log("mudei dark");
            this.setConfig();
        },
    },
    created() {
        console.log("created app");
        console.log(
            "created, pagina load:",
            this.$store.state.controles.pageLoaded
        );
    },
    mounted() {
        console.log("mounted", this);
        window.$app = this;
        // this.createClass();
        // this.createClassTheme();
        this.onResize();
        this.setConfig();
        console.log(
            "mounted, pagina load:",
            this.$store.state.controles.pageLoaded
        );
    },
};
</script>

<style lang="scss">
// .gradient.primary {
//   background-color: var(--astro-primary) !important;
//   background-image: linear-gradient(
//     30deg,
//     var(--astro-primary-dark),
//     var(--astro-primary-dark-rgba)
//   ) !important;
// }

// .gradient.error,
// .gradient.danger {
//   background-color: var(--astro-error) !important;
//   background-image: linear-gradient(
//     30deg,
//     var(--astro-error-dark),
//     var(--astro-error-dark-rgba)
//   ) !important;
// }

// .gradient.success {
//   background-color: var(--astro-success) !important;
//   background-image: linear-gradient(
//     30deg,
//     var(--astro-success-dark),
//     var(--astro-success-dark-rgba)
//   ) !important;
// }

// .gradient.warning {
//   background-color: var(--astro-warning) !important;
//   background-image: linear-gradient(
//     30deg,
//     var(--astro-warning-dark),
//     var(--astro-warning-dark-rgba)
//   ) !important;
// }

// .gradient.info {
//   background-color: var(--astro-info) !important;
//   background-image: linear-gradient(
//     30deg,
//     var(--astro-info-dark),
//     var(--astro-info-dark-rgba)
//   ) !important;
// }

html,
body {
    scroll-behavior: smooth;
}

.gradient.salgadones {
    background-color: #8f3d4b !important;
    background-image: linear-gradient(
        30deg,
        #2b1d42,
        rgba(43, 29, 66, 0.5)
    ) !important;
}
</style>
