export default {
    state: {
        notificacoes: []
    },

    mutations: {
        ADD_NOTIFICACAO(state, doc) {
            state.notificacoes.push(doc);
        },
        DELETAR_NOTIFICACAO(state, index) {
            state.notificacoes.splice(index, 1);
        }
    },
    actions: {
        getNotificacoes({ commit, state }) {
            return new Promise((resolve) => {
                const auth = this._vm.$auth

                auth.onAuthStateChanged((usuario) => {
                    console.log("getNotificacoes")
                    const firestore = this._vm.$firestore
                    if (usuario) {
                        console.log("getNotificacoes com usuario")

                        const email = usuario.email;
                        firestore.collection("usuarios").doc(email).collection("notificacoes").limit(20).orderBy("criadaEm", "desc").onSnapshot((snapshot) => {
                            snapshot.docChanges().forEach(change => {
                                if (change.type === "added") {
                                    const doc = change.doc.data();
                                    if (!doc.id) {
                                        doc.id = change.doc.id;
                                    }
                                    if (state.notificacoes.some(notif => notif.id === doc.id)) {
                                        return
                                    }
                                    commit("ADD_NOTIFICACAO", doc)
                                }
                                if (change.type === "removed") {
                                    const doc = change.doc.data();
                                    const index = state.notificacoes.findIndex(notify => notify.id === doc.id);
                                    commit("DELETAR_NOTIFICACAO", index)
                                }
                            });
                        })
                        resolve();
                    }
                    else {
                        console.log("getNotificacoes sem usuario")
                        resolve();
                    }
                })
            })
        }
    }
};