import Vue from 'vue';
import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader

import Vuetify from 'vuetify/lib/framework';
import colors from 'vuetify/lib/util/colors'

import ES from '@/components/flags/es.vue'
import PT from '@/components/flags/pt.vue'
import EN from '@/components/flags/en.vue'
import AstroLogo from '@/components/AstroLogo.vue'
import AppContas from '@/components/icones/AppContas.vue'

Vue.use(Vuetify);

export default new Vuetify({
    breakpoint: {
        thresholds: {
            xs: 340,
            sm: 540,
            md: 800,
            lg: 1280,
        },
        mobileBreakpoint: 'sm',
    },
    icons: {

        iconfont: 'md',
        values: {
            es: {
                component: ES
            },
            pt: {
                component: PT
            },
            en: {
                component: EN
            },
            astrologo: {
                component: AstroLogo
            },
            appcontas: {
                component: AppContas,
                props: {
                    tipo: 'line'
                }
            },
            appcontasdual: {
                component: AppContas,
                props: {
                    tipo: 'dual'
                }
            },
            appcontasfull: {
                component: AppContas,
                props: {
                    tipo: 'full'
                }
            },



        }
    },
    theme: {
        dark: true,
        options: {
            customProperties: true
        },
        themes: {
            light: {
                primary: colors.deepPurple.base,
                secondary: colors.grey.darken1,
                accent: colors.shades.black,
                error: colors.red.base,
                danger: colors.red.accent3,
                warning: colors.amber.accent2,
                info: colors.blue.base,
                success: colors.green.base,
                light: colors.grey.lighten5,
                dark: colors.grey.darken4,
                salgadones: "#8f3d4b",

            },
            dark: {
                primary: colors.deepPurple.base,
                secondary: colors.grey.darken1,
                accent: colors.shades.black,
                error: colors.red.base,
                danger: colors.red.accent3,
                warning: colors.amber.accent3,
                info: colors.blue.base,
                success: colors.green.base,
                light: colors.grey.lighten5,
                dark: colors.grey.darken4,
                salgadones: "#8f3d4b",
            },
        },
    },

});
