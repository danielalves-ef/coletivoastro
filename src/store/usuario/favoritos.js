

export default {
    state: {
        favoritos: [],
    },

    mutations: {
        ADD_FAVORITO(state, payload) {
            state.favoritos.push(payload)
        },
        DELETE_FAVORITO(state, id) {
            const index = state.favoritos.findIndex((fav) => {
                return fav.id === id
            })
            state.favoritos.splice(index, 1);
        },
        RESET_FAVORITOS(state) {
            state.favoritos = [];
        }
    },
    actions: {
        async initFavoritos({ dispatch }) {
            await dispatch("getFavoritos");
        },
        getFavoritos({ commit, rootState }) {
            console.log("getFavoritos");
            const firestore = this._vm.$firestore
            return new Promise((resolve, reject) => {
                const email = rootState.auth.usuario.email;
                commit("RESET_FAVORITOS");
                firestore.collection("usuarios").doc(email).collection("favoritos").get().then((snap) => {
                    if (snap.empty) {
                        resolve();
                    }
                    snap.forEach((doc) => {
                        commit("ADD_FAVORITO", doc.data())
                    })
                    resolve();
                }).catch(e => {
                    reject(e)
                })
            })
        },
        addFavorito({ commit, rootState }, payload) {
            const firestore = this._vm.$firestore
            return new Promise((resolve, reject) => {
                const email = rootState.auth.usuario.email;
                firestore.collection("usuarios").doc(email).collection("favoritos").add(payload).then((docRef) => {
                    const id = docRef.id;
                    docRef.update({ id }).then(() => {
                        const favorito = payload;
                        favorito.id = id;
                        commit("ADD_FAVORITO", favorito)
                        resolve();
                    }).catch(e => {
                        reject(e)
                    })
                }).catch(e => {
                    reject(e)
                })
            })
        },
        deleteFavorito({ commit, rootState }, favId) {
            const firestore = this._vm.$firestore
            return new Promise((resolve, reject) => {
                const email = rootState.auth.usuario.email;
                firestore.collection("usuarios").doc(email).collection("favoritos").doc(favId).delete().then(() => {
                    commit("DELETE_FAVORITO", favId);
                    resolve();
                }).catch(e => {
                    reject(e)
                })
            })
        }
    }

};