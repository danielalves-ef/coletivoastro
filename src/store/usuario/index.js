import favoritos from "./favoritos";
import notificacoes from "./notificacoes";
import config from "./config";


import firebase from "firebase/app";
import "firebase/firestore"


export default {
    namespaced: true,
    modules: {
        favoritos,
        config,
        notificacoes
    },
    state: {
        usuario: null,
    },
    mutations: {
        UPDATE_USUARIO(state, usuario) {
            state.usuario = usuario;
        }
    },
    actions: {
        initUsuario({ rootState, commit, dispatch }) {
            return new Promise((resolve) => {
                firebase.firestore().collection('usuarios').doc(rootState.auth.usuario.email).get().then(async (doc) => {
                    if (doc.exists) {
                        const usuario = doc.data();
                        commit("UPDATE_USUARIO", usuario)
                        console.log("antes de init favoritos")
                        const initFavoritos = await dispatch("initFavoritos");
                        console.log({ initFavoritos })

                        await dispatch("initConfig");
                        console.log("depois de init favoritos")

                        resolve();
                    }
                    else {
                        resolve();
                    }
                })
            })
        },
    }
};