import firebase from "firebase/app";
import "firebase/firestore"


const firebasePaths = {
    appcontas: 'appcontas'
}
// ==================================================
// === STORE/LISTA.JS ===
// ==================================================

export default {
    namespaced: true,
    state: {
        listagem: [],
        lista: null,
        ordem: "data",
        direcion: "asc",
        loaded: false,
        loadedItens: false,
        error: [],
    },
    mutations: {

        // LISTAGEM

        LISTAGEM_ADD(state, item) {
            state.listagem.push(item)
        },
        LISTAGEM_RESETAR(state) {
            state.listagem = [];
        },
        LISTAGEM_DELETAR(state, index) {
            state.listagem.splice(index, 1);
        },

        // LISTA
        UPDATE_LISTA(state, novalista) {
            console.log("UPDATE_LISTA", novalista);
            state.lista = novalista
        },
        SET_ORDEM(state, ordem) {
            state.ordem = ordem;
        },
        SET_DIRECION(state, direcion) {
            state.direcion = direcion;
        },
        ORDENAR_ITENS_BY_TEXT(state) {
            const ordem = state.ordem || "conceito"
            const direcion = state.direcion || "asc";

            if (!state.lista.itens) { return }
            state.lista.itens.sort((a, b) => {

                let x = a[ordem].toLowerCase();
                let y = b[ordem].toLowerCase();
                let aName = a.conceito.toLowerCase();
                let bName = b.conceito.toLowerCase();
                if (direcion === "desc") {
                    return y.localeCompare(x) || bName.localeCompare(aName);

                }

                return x.localeCompare(y) || aName.localeCompare(bName);
            })
        },
        ORDENAR_ITENS_BY_NUM(state) {
            const ordem = state.ordem || "valor";
            const direcion = state.direcion || "asc";

            if (!state.lista.itens) { return }
            state.lista.itens.sort((a, b) => {

                let x = a[ordem];
                let y = b[ordem];

                let aName = a.conceito.toLowerCase();
                let bName = b.conceito.toLowerCase();

                if (direcion === "desc") {
                    return y - x || bName.localeCompare(aName);
                }
                return x - y || aName.localeCompare(bName);
            })
        },
        PAGAR_ITEM(state, item) {
            state.lista.itens.forEach((it) => {
                if (it.id === item.id) {
                    it.pagamento = item.pagamento
                    // state.lista[i].pagamento = item.pagamento
                }
                else {
                    return
                }
            })
        },
        UPDATE_ITEM(state, { doc, index }) {
            state.lista.itens[index] = doc
        },
        DELETAR_ITEM(state, { index }) {
            state.lista.itens.splice(index, 1);
        },
        RESETAR_LISTA(state) {
            state.lista = {};
        },
        LIMPAR_LISTA(state) {
            state.lista.itens = [];
        },
        CRIAR_ITENS(state) {
            if (!state.lista.itens) {
                state.lista.itens = [];
            }
        },
        ADD_ITEM(state, item) {
            if (!state.lista) { return }
            if (!state.lista.itens) {
                state.lista.itens = []
            }
            state.lista.itens.push(item);
        },
        INSCREVER(state, func) {
            state.cancelar = func;
        },
        UPDATE_LOAD(state, status) {
            state.loaded = status;
        },
        UPDATE_LOAD_ITENS(state, status) {
            state.loadedItens = status;
        },
        DESTRUIR_LISTA(state) {
            state.lista = null;
        }
    },
    actions: {
        // LISTAGEM

        salvarNovaLista({ commit }, { lista }) {
            return new Promise((resolve) => {
                firebase.firestore()
                    .collection(firebasePaths.appcontas)
                    .add(lista)
                    .then((docRef) => {
                        const id = docRef.id;
                        docRef.update({ id }).then(() => {
                            console.log("lista salva");
                            commit("LISTAGEM_ADD", lista)
                            resolve({
                                result: true,
                                msg: 'Lista salva com ID: ' + id,
                                data: { id }
                            })
                            // this.$router.push({
                            //     name: "contas-id",
                            //     params: { id: id },
                            // });
                            // REDIRECIONAR PARA 'MINHAS LISTAS'
                            // TODO
                        });
                    });

            })
        },
        salvarListaEditada({ state }, { lista }) {
            return new Promise((resolve) => {
                console.log(state.listagem)
                firebase.firestore().collection(firebasePaths.appcontas).doc(lista.id).update(lista).then(() => {
                    console.log("lista editada salva");
                    resolve({
                        result: true,
                        msg: 'Lista editada salva',
                        data: { lista }
                    })
                })
            })
        },
        getListagem({ commit, rootState }) {
            const user = rootState.auth.usuario;
            if (!user) return;
            commit("LISTAGEM_RESETAR")
            const email = user.email;

            return new Promise((resolve, reject) => {
                firebase.firestore()
                    .collection(firebasePaths.appcontas)
                    .where("titulares", "array-contains", email)
                    .get()
                    .then((snapshot) => {
                        snapshot.forEach((doc) => {
                            const lista = doc.data();
                            commit("LISTAGEM_ADD", lista)
                        });
                        resolve();
                    })
                    .catch((e) => {
                        console.log(e);
                        alert(e);
                        reject();
                    });

            })
        },
        deletarLista({ commit }, { item, index }) {
            console.log(item, index)
            return new Promise((resolve, reject) => {
                firebase.firestore().collection(firebasePaths.appcontas).doc(item.id).delete().then(() => {
                    console.log("deletar store", index)
                    commit("LISTAGEM_DELETAR", index);
                    resolve();
                }).catch(e => {
                    reject(e);
                });
            })
        },

        // LISTA

        resetarLista({ commit }) {
            commit("RESETAR_LISTA");
        },
        destruirLista({ commit }) {
            commit("DESTRUIR_LISTA");
        },
        cancelar({ state }) {
            state.cancelar();
        },
        deletarItem({ state }, { item }) {
            const listaId = state.lista.id;
            return new Promise((resolve, reject) => {
                firebase.firestore().collection(firebasePaths.appcontas).doc(listaId).collection("itens").doc(item.id).delete().then(() => {
                    // commit("DELETAR_ITEM", index);
                    resolve();
                }).catch(e => {
                    reject(e);
                });
            })
        },
        setOrdem({ commit }, ordem) {
            return new Promise((resolve) => {
                commit("SET_ORDEM", ordem);
                resolve();
            })
        },
        setDirecion({ commit }, direcion) {
            return new Promise((resolve) => {
                commit("SET_DIRECION", direcion);
                resolve();
            })
        },
        ordenarItens({ state, commit }) {
            if (state.ordem === "valor" || state.ordem === "data") {
                commit("ORDENAR_ITENS_BY_NUM")
            }
            else {
                commit("ORDENAR_ITENS_BY_TEXT")
            }
        },
        pagarItem({ state }, { item }) {
            const pagamento = item.pagamento;

            const color = (pagamento) => {
                const valores = Object.values(pagamento);
                const every = valores.every((valor) => {
                    return valor;
                });
                if (every) {
                    return "success";
                }
                const some = valores.some((valor) => {
                    return valor;
                });
                if (some) {
                    return "warning";
                }
                return "danger";
            };
            const cor = color(pagamento)
            return new Promise((resolve, reject) => {
                firebase.firestore().collection(firebasePaths.appcontas).doc(state.lista.id).collection("itens").doc(item.id).update({ pagamento, cor }).then(() => {
                    resolve()
                }).catch(e => {
                    reject(e)
                })
            })
        },
        color() {
            return (pagamento) => {
                const valores = Object.values(pagamento);
                const every = valores.every((valor) => {
                    return valor;
                });
                if (every) {
                    return "success";
                }
                const some = valores.some((valor) => {
                    return valor;
                });
                if (some) {
                    return "warning";
                }
                return "danger";
            };
        },
        editarItem({ state }, { item }) {
            return new Promise((resolve, reject) => {
                firebase.firestore().collection(firebasePaths.appcontas).doc(state.lista.id).collection("itens").doc(item.id).update(item).then(() => {
                    resolve()
                }).catch(e => {
                    reject(e)
                })
            })
        },
        pagarItens({ dispatch }, { itens, pagador }) {
            return new Promise((resolve) => {
                const promises = [];
                itens.forEach((item) => {
                    item.pagamento[pagador] = true;
                    const promisePagarItem = dispatch("pagarItem", { item });
                    console.log(promisePagarItem);
                    promises.push(promisePagarItem);
                })
                Promise.all(promises).then(() => {
                    resolve();
                }
                );
            })
        },
        pagarTodos({ state, dispatch }) {
            return new Promise((resolve) => {
                if (state.lista && state.lista.itens) {
                    const itens = state.lista.itens;
                    const promises = [];
                    itens.forEach((item) => {
                        Object.keys(item.pagamento).forEach(usuario => {
                            item.pagamento[usuario] = true;
                        })
                        const promisePagarItem = dispatch("pagarItem", { item });
                        console.log(promisePagarItem);
                        promises.push(promisePagarItem);
                    })
                    Promise.all(promises).then(() => {
                        resolve();
                    }
                    );

                }
                else {
                    resolve();
                }
            })
        },
        addItem({ state }, { item }) {
            const id = state.lista.id
            return new Promise((resolve, reject) => {
                firebase.firestore().collection(`${firebasePaths.appcontas}/${id}/itens`).add(item).then(docRef => {
                    const docId = docRef.id;
                    const docItem = item;
                    docItem.id = docId;
                    docRef.update({ id: docId }).then(() => {
                        // commit("ADD_ITEM", docItem);
                        resolve(docItem);
                    }).catch(e => {
                        reject(e)
                    })
                }).catch(e => {
                    reject(e)
                })

            })
        },
        getLista({ commit, state, rootState, dispatch }, { id, mes, ano }) {
            commit("UPDATE_LOAD", false)
            commit("UPDATE_LOAD_ITENS", false)
            return new Promise((resolve) => {
                const user = rootState.auth.usuario;
                if (!user) {
                    // ERROR
                    console.log("none user");
                    commit("UPDATE_LOAD", true)
                    commit("UPDATE_LOAD_ITENS", true)
                    resolve({ msg: "no user", result: false });
                    return
                }
                if (!ano) { ano = new Date().getFullYear(); }
                // commit("RESETAR_LISTA")
                console.log("resetar lista");
                console.log("get lista");

                firebase.firestore()
                    .collection(firebasePaths.appcontas)
                    .doc(id)
                    .get()
                    .then((document) => {
                        console.log("lista then");
                        commit("UPDATE_LOAD", true)

                        if (document.exists) {
                            console.log(" lista exists");

                            const lista = document.data();
                            lista.itens = [];

                            if (!lista.titulares.includes(rootState.auth.usuario.email)) {
                                console.log('not auth');
                                commit("UPDATE_LOAD_ITENS", true)
                                resolve({ msg: "no auth", result: false });
                                return;
                            }
                            commit("RESETAR_LISTA")

                            commit("UPDATE_LISTA", lista)
                            console.log("update  lista", lista);


                            const cancelar = firebase.firestore().collection(firebasePaths.appcontas).doc(id).collection("itens").where('mes', "==", mes).where('ano', "==", ano).onSnapshot(snapshot => {
                                commit("UPDATE_LOAD_ITENS", true)
                                snapshot.docChanges().forEach(change => {

                                    if (change.type === "added") {
                                        const doc = change.doc.data()
                                        if (!doc.id) {
                                            doc.id = change.doc.id;
                                        }
                                        if (state.lista.itens.some((item) => item.id === doc.id)) { return }
                                        commit("ADD_ITEM", doc)
                                        dispatch("ordenarItens");

                                    }
                                    if (change.type === "modified") {
                                        const doc = change.doc.data()
                                        const index = state.lista.itens.findIndex((item) => {
                                            return item.id === doc.id
                                        })
                                        commit("UPDATE_ITEM", { index, doc })
                                        dispatch("ordenarItens");

                                    }
                                    if (change.type === "removed") {
                                        const doc = change.doc.data()
                                        const index = state.lista.itens.findIndex((item) => {
                                            return item.id === doc.id
                                        })
                                        commit("DELETAR_ITEM", { doc, index })
                                        dispatch("ordenarItens");

                                    }

                                })
                            })
                            commit("INSCREVER", cancelar);
                            resolve({ msg: "list found", result: true, data: lista });
                        }
                        else {
                            // ERROR
                            console.log(" lista no existe");
                            commit("UPDATE_LOAD", true)
                            commit("UPDATE_LOAD_ITENS", true)
                            resolve({ msg: "no list", result: false });

                        }
                    }).catch((e) => {
                        console.log(e)
                    })
            })
        },
        getItens({ state, commit, dispatch, rootState }, { mes, ano }) {
            dispatch("cancelar");
            commit("LIMPAR_LISTA");
            commit("UPDATE_LOAD_ITENS", false)
            if (!state.lista.titulares.includes(rootState.auth.usuario.email)) {
                return
            }


            const cancelar = firebase.firestore().collection(firebasePaths.appcontas).doc(state.lista.id).collection("itens").where('mes', "==", mes).where('ano', "==", ano).onSnapshot(snapshot => {
                commit("UPDATE_LOAD_ITENS", true)

                snapshot.docChanges().forEach(change => {
                    if (change.type === "added") {
                        console.log("added")
                        const doc = change.doc.data()
                        if (!doc.id) {
                            doc.id = change.doc.id;
                        }
                        if (state.lista.itens.some((item) => item.id === doc.id)) { return }
                        commit("ADD_ITEM", doc)
                        dispatch("ordenarItens");

                    }
                    if (change.type === "modified") {
                        console.log("modified")
                        const doc = change.doc.data()
                        const index = state.lista.itens.findIndex((item) => {
                            return item.id === doc.id
                        })
                        commit("UPDATE_ITEM", { index, doc })
                        dispatch("ordenarItens");

                    }
                    if (change.type === "removed") {
                        console.log("removed")
                        const doc = change.doc.data()
                        const index = state.lista.itens.findIndex((item) => {
                            return item.id === doc.id
                        })
                        commit("DELETAR_ITEM", { doc, index })
                        dispatch("ordenarItens");

                    }

                })
            })
            commit("INSCREVER", cancelar)

        },
        updateStatus({ commit }, status) {
            commit("UPDATE_STATUS", status);
        },
        getItens2({ commit, state }, id) {
            return new Promise((resolve) => {
                firebase.firestore().collection(firebasePaths.appcontas).doc(id).collection("itens").onSnapshot(snapshot => {
                    if (!state.lista.itens) {
                        commit("CRIAR_ITENS")
                    }
                    snapshot.docChanges().forEach(change => {
                        if (change.type === "added") {
                            console.log("added")
                            const doc = change.doc.data()
                            if (!doc.id) {
                                doc.id = change.doc.id;
                            }
                            commit("ADD_ITEM", doc)
                        }
                        if (change.type === "modified") {
                            console.log("modified")
                            const doc = change.doc.data()
                            const index = state.lista.itens.findIndex((item) => {
                                return item.id === doc.id
                            })
                            commit("UPDATE_ITEM", { index, doc })
                        }
                        if (change.type === "removed") {
                            console.log("removed")
                            const doc = change.doc.data()
                            const index = state.lista.itens.findIndex((item) => {
                                return item.id === doc.id
                            })
                            commit("DELETAR_ITEM", { doc, index })
                        }
                    })
                    commit("ORDENAR_ITENS");
                    resolve();
                })
            })
        },
    },
};
