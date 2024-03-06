
export default {
    state: {
        tema: {
            dark: true,
            primary: "#716da6"
        }
    },
    mutations: {
        UPDATE_TEMA(state, tema) {
            state.tema = tema;
        },
        UPDATE_TEMA_DARK({ tema }, dark) {
            tema.dark = dark
        },
        UPDATE_TEMA_COR({ tema }, cor) {
            tema.primary = cor

        },
    },
    actions: {
        // INIT CONFIG
        async initConfig({ dispatch }) {
            console.log("initConfig")
            await dispatch("getTema")
        },

        // TEMA
        getTema({ state, commit, rootState }) {
            console.log("getTema")

            const email = rootState.auth.usuario.email;
            const firestore = this._vm.$firestore
            return new Promise((resolve, reject) => {
                firestore.collection("usuarios").doc(email).collection("config").doc("tema").get().then(doc => {
                    if (!doc.exists) {
                        firestore.collection("usuarios").doc(email).collection("config").doc("tema").set(state.tema).then(() => {
                            resolve();
                        }).catch(e => {
                            reject(e);
                        })
                        return

                    }
                    const tema = doc.data();
                    console.log({ tema })
                    commit("UPDATE_TEMA", tema)
                    resolve()
                }).catch(e => {
                    reject(e)
                })

            })

        },
        salvarTemaDark({ commit, rootState }, dark) {
            const firestore = this._vm.$firestore
            firestore.collection("usuarios").doc(rootState.auth.usuario.email).collection("config").doc("tema").update({ dark: dark })
            commit("UPDATE_TEMA_DARK", dark)
        },
        salvarTemaCor({ commit, rootState }, cor) {
            const firestore = this._vm.$firestore
            firestore.collection("usuarios").doc(rootState.auth.usuario.email).collection("config").doc("tema").update({ primary: cor })
            commit("UPDATE_TEMA_COR", cor)
        }
    }
};