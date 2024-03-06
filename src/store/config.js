
import firebase from "firebase/app";
import "firebase/firestore"

export default {
    namespaced: true,

    state: {
        favoritos: [],
        config: null
    },
    mutations: {
        ADD_FAVORITO(state, favorito) {
            state.favoritos.push(favorito);
        },
        UPDATE_FAVORITOS(state, favorito) {
            state.favoritos = favorito;
        },
        UPDATE_CONFIG(state, config) {
            state.config = config;
        },
        UPDATE_TEMA_DARK(state, dark) {
            state.config.tema.dark = dark;
        },
        UPDATE_TEMA_COR(state, cor) {
            state.config.tema.primary = cor;
        },
    },
    actions: {
        initConfig({ rootState, commit }) {
            console.log('initConfig', rootState.auth.usuario.email);
            return new Promise((resolve) => {
                firebase.firestore().collection('usuarios').doc(rootState.auth.usuario.email).get().then((doc) => {
                    if (doc.exists) {
                        const data = doc.data();
                        const favoritos = data.favoritos;
                        const config = data.config;
                        localStorage.setItem('favoritos', JSON.stringify(favoritos));
                        localStorage.setItem('config', JSON.stringify(config));
                        commit("UPDATE_FAVORITOS", favoritos);
                        commit("UPDATE_CONFIG", config);
                        resolve();
                    }
                    else {
                        resolve();
                    }
                })
            })
        },

        // FAVORITOS
        addFavoritos({ commit, state, dispatch }, favorito) {
            console.log("addFavoritos", favorito);
            const favoritos = state.favoritos;
            favoritos.push(favorito);
            localStorage.setItem('favoritos', JSON.stringify(favoritos));
            dispatch('updateFavoritos', favoritos);
            commit("UPDATE_FAVORITOS", favoritos);
        },
        removeFavoritos({ state, commit, dispatch }, favorito) {
            console.log("removeFavoritosStore");
            const favoritos = state.favoritos;
            const index = favoritos.findIndex((fav) => {
                return fav.path === favorito.path
            })
            if (index !== -1) {
                console.log("removeFavoritosStore index");

                favoritos.splice(index, 1);
                commit("UPDATE_FAVORITOS", favoritos);
                dispatch("updateFavoritos", favoritos);
            }
        },
        updateFavoritos({ rootState }, favoritos) {
            return new Promise((resolve) => {
                firebase.firestore().collection('usuarios').doc(rootState.auth.usuario.email).update({ favoritos: favoritos }).then(() => {
                    resolve();
                })
            })
        },
        // TEMA
        salvarTemaDark({ state, commit, rootState }, dark) {
            if (state.config) {
                firebase.firestore().collection("usuarios").doc(rootState.auth.usuario.email).update({ 'config.tema.dark': dark })
                commit("UPDATE_TEMA_DARK", dark)
            }
        },
        salvarTemaCor({ state, commit, rootState }, cor) {
            if (state.config) {
                firebase.firestore().collection("usuarios").doc(rootState.auth.usuario.email).update({ 'config.tema.primary': cor })
                commit("UPDATE_TEMA_COR", cor)
            }
        }

    },
}
