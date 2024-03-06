import firebase from "firebase/app";
import "firebase/firestore"

const firebasePaths = {
    appcompras: 'appcompras'
}


export default {
    namespaced: true,
    state: {
        listagem: [],
        lista: null,
        loaded: false,

    },
    // getters: {
    //     value: state => {
    //         return state.value;
    //     }
    // },
    mutations: {
        LISTAGEM_RESETAR(state) {
            state.listagem = [];
        },
        LISTAGEM_ADD(state, lista) {
            state.listagem.push(lista)
        }
    },
    actions: {
        getListagem({ rootState, commit }) {
            const user = rootState.auth.usuario;
            if (!user) return
            console.log("getlistagem")
            commit("LISTAGEM_RESETAR");
            const email = user.email;

            return new Promise((resolve, reject) => {
                firebase.firestore().collection(firebasePaths.appcompras).where("usuarios", "array-contains", email).get().then((snapshot) => {
                    console.log("getlistagem2")

                    snapshot.forEach((doc) => {
                        const lista = doc.data();
                        commit("LISTAGEM_ADD", lista)
                    });
                    resolve();
                })
                    .catch(e => {
                        console.log(e);
                        alert(e);
                        reject();
                    })
            })
        }
    }
};