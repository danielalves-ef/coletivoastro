
// ==================================================
// === STORE/AUTH.JS ===
// ==================================================


export default {
    namespaced: true,
    state: {
        usuario: null
    },
    actions: {
        loginIntoStore({ commit }, user) {
            console.log("loginIntoStore");
            return new Promise((resolve) => {
                if (user) {
                    let usuario = {};
                    usuario.uid = user.uid;
                    usuario.email = user.email;
                    usuario.photoURL = user.photoURL;
                    usuario.displayName = user.displayName;

                    commit("UPDATE_USER_AUTH", usuario);
                    resolve(usuario);
                }
                else {
                    commit('UPDATE_USER_AUTH', null)
                    resolve();
                }
            })
        },
    },


    mutations: {
        UPDATE_USER_AUTH(state, usuario) {
            state.usuario = usuario;
        },

    }
};
