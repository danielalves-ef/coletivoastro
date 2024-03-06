import firebase from "firebase/app";
import "firebase/firestore";


export default {
    namespaced: true,
    state: {
        notificacoes: []
    },
    mutations: {
        ADD_NOTIFICACAO(state, payload) {
            state.notificacoes.push(payload)
        },
        CLEAR_NOTIFICACOES(state) {
            state.notificacoes = [];
        }

    },
    actions: {
        getNotificacoes({ commit, rootState }) {
            firebase.auth().onAuthStateChanged((user) => {
                console.log({ rootState })
                if (user) {
                    firebase.firestore().collection("usuarios").doc(user.email).collection("notificacoes").get().then((snapshot) => {
                        if (!snapshot.empty) {
                            commit("CLEAR_NOTIFICACOES");
                            snapshot.forEach(doc => {
                                commit("ADD_NOTIFICACAO", doc.data())
                            })
                        }
                    })

                }

            })
        }
    }
};