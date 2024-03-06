import Vue from 'vue'
import Vuex from 'vuex'

import auth from "./auth"

import controles from "./controles"
import notificacoes from "./notificacoes"
import usuario from "./usuario"

// import appcontas from "./appcontas"
import appcontas from "./appcontas/index"
import appmercado from "./appmercado"
import appcompras from "./appcompras"

// // appcontas
// import listas from "./appcontas/listas"


Vue.use(Vuex)

export default new Vuex.Store({
    state: {
    },
    mutations: {
    },
    actions: {
    },
    modules: {
        auth,
        controles,
        appcontas,
        appmercado,
        appcompras,
        notificacoes,
        usuario
    }
})
