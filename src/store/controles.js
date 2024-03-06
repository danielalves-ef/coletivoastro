import Vue from 'vue';
// ==================================================
// === STORE/CONTROLES.JS ===
// ==================================================


export default {
    namespaced: true,
    state: {
        menuAtivo: false,
        isMobile: false,
        routeFrom: null,
        routeTo: null,
        pageLoaded: false,
    },
    actions: {
        toggleMenu({ commit }) {
            commit("TOGGLE_MENU");
        },
        abrirMenu({ commit }) {
            commit("ABRIR_MENU");
        },
        fecharMenu({ commit }) {
            commit("FECHAR_MENU");
        },
        setMenu({ commit }, val) {
            commit("SET_MENU", val);
        },
        setPageLoaded({ commit }, loaded) {
            console.log("loaded", loaded);
            commit("SET_PAGE_LOADED", loaded);
        },
        getMobile({ commit }) {
            const userAgent = navigator.userAgent.toLocaleLowerCase();
            const isMobile = userAgent.includes("mobile");
            Vue.prototype.$isMobile = isMobile;
            commit("SET_MOBILE", isMobile);
        },
        setRouteFrom({ commit }, route) {
            commit("SET_ROUTE_FROM", route);
        },
        setRouteTo({ commit }, route) {
            commit("SET_ROUTE_TO", route);
        }
    },


    mutations: {
        TOGGLE_MENU(state) {
            state.menuAtivo = !state.menuAtivo
        },
        ABRIR_MENU(state) {
            state.menuAtivo = true
        },
        FECHAR_MENU(state) {
            state.menuAtivo = false
        },
        SET_MENU(state, val) {
            state.menuAtivo = val
        },
        SET_MOBILE(state, val) {
            state.isMobile = val
        },
        SET_ROUTE_FROM(state, route) {
            state.routeFrom = route;
        },
        SET_ROUTE_TO(state, route) {
            state.routeTo = route;
        },
        SET_PAGE_LOADED(state, loaded) {
            state.pageLoaded = loaded;
        }
    }
};
