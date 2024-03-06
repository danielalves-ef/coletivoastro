import firebase from "firebase/app";
import "firebase/firestore"


const firebasePaths = {
    appcontas: 'appcontas'
}

export default {
    namespaced: true,

    state: {
        lista: null,
        ordem: "now",
        direcion: "asc",
        loaded: false,
        loadedItens: false,
        error: [],
    },

    mutations: {
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
        },
        UPDATE_LISTA_EDITADA(state, novalista) {
            state.lista = { ...state.lista, ...novalista };
        },
        UPDATE_CONTAS_PROGRAMADAS(state, contas) {
            state.lista.contasProgramadas = contas
        }
    },
    actions: {
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
            if (state.ordem === "valor" || state.ordem === "data" || state.ordem === "now") {
                commit("ORDENAR_ITENS_BY_NUM")
            }
            else {
                commit("ORDENAR_ITENS_BY_TEXT")
            }
        },
        pagarItem({ state }, { item }) {
            const pagamento = item.pagamento;
            const color = (pagamento) => {
                const every = pagamento.every(p => p.pagamento);
                if (every) {
                    return "success";
                }
                const some = pagamento.some(p => p.pagamento);
                if (some) {
                    return "warning";
                }
                return "danger";
            }

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
        editarItem({ state }, { item, foto }) {
            const id = state.lista.id
            return new Promise((resolve, reject) => {
                if (foto) {

                    const metadata = {
                        contentType: foto.type
                    };
                    const ext = foto.name.substr(foto.name.lastIndexOf("."));
                    const path = `appcontas/${id}/itens/${item.id}${ext}`
                    const uploadTask = firebase.storage().ref().child(path).put(foto, metadata);

                    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                        (snapshot) => {
                            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log('Upload is ' + progress + '% done');
                            switch (snapshot.state) {
                                case firebase.storage.TaskState.PAUSED: // or 'paused'
                                    console.log('Upload is paused');
                                    break;
                                case firebase.storage.TaskState.RUNNING: // or 'running'
                                    console.log('Upload is running');
                                    break;
                            }
                        },
                        (error) => {
                            // A full list of error codes is available at
                            // https://firebase.google.com/docs/storage/web/handle-errors
                            switch (error.code) {
                                case 'storage/unauthorized':
                                    // User doesn't have permission to access the object
                                    break;
                                case 'storage/canceled':
                                    // User canceled the upload
                                    break;

                                // ...

                                case 'storage/unknown':
                                    // Unknown error occurred, inspect error.serverResponse
                                    break;
                            }
                        },
                        () => {
                            // Upload completed successfully, now we can get the download URL
                            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                                console.log('File available at', downloadURL);
                                const fotoPath = uploadTask.snapshot.ref.fullPath
                                const fotoURL = downloadURL
                                const itemEditado = { ...item, fotoPath, fotoURL };

                                firebase.firestore().collection(firebasePaths.appcontas).doc(id).collection("itens").doc(item.id).update(itemEditado).then(() => {
                                    resolve()
                                }).catch(e => {
                                    reject(e)
                                })

                            });
                        }
                    );
                }
                else {
                    firebase.firestore().collection(firebasePaths.appcontas).doc(state.lista.id).collection("itens").doc(item.id).update(item).then(() => {
                        resolve()
                    }).catch(e => {
                        reject(e)
                    })

                }
            })
        },
        pagarItens({ dispatch }, { itens, pagador }) {
            return new Promise((resolve) => {
                const promises = [];
                itens.forEach((item) => {
                    item.pagamento[pagador] = true;
                    item.pagamento.forEach(i => {
                        if (i.slug === pagador) {
                            i.pagamento = true
                        }
                    })

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
        // pagarItens({ dispatch }, { itens, pagador }) {
        //     return new Promise((resolve) => {
        //         const promises = [];
        //         itens.forEach((item) => {
        //             item.pagamento[pagador] = true;
        //             const promisePagarItem = dispatch("pagarItem", { item });
        //             console.log(promisePagarItem);
        //             promises.push(promisePagarItem);
        //         })
        //         Promise.all(promises).then(() => {
        //             resolve();
        //         }
        //         );
        //     })
        // },
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
        addItem({ state }, { item, foto }) {
            console.log({ item, foto })
            const id = state.lista.id
            return new Promise((resolve, reject) => {
                firebase.firestore().collection(`${firebasePaths.appcontas}/${id}/itens`).add(item).then(docRef => {
                    const docId = docRef.id;
                    const docItem = item;
                    docItem.id = docId;


                    if (foto) {

                        const metadata = {
                            contentType: foto.type
                        };
                        const ext = foto.name.substr(foto.name.lastIndexOf("."));
                        const path = `appcontas/${id}/itens/${docId}${ext}`
                        const uploadTask = firebase.storage().ref().child(path).put(foto, metadata);

                        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                            (snapshot) => {
                                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                console.log('Upload is ' + progress + '% done');
                                switch (snapshot.state) {
                                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                                        console.log('Upload is paused');
                                        break;
                                    case firebase.storage.TaskState.RUNNING: // or 'running'
                                        console.log('Upload is running');
                                        break;
                                }
                            },
                            (error) => {
                                // A full list of error codes is available at
                                // https://firebase.google.com/docs/storage/web/handle-errors
                                switch (error.code) {
                                    case 'storage/unauthorized':
                                        // User doesn't have permission to access the object
                                        break;
                                    case 'storage/canceled':
                                        // User canceled the upload
                                        break;

                                    // ...

                                    case 'storage/unknown':
                                        // Unknown error occurred, inspect error.serverResponse
                                        break;
                                }
                            },
                            () => {
                                // Upload completed successfully, now we can get the download URL
                                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                                    console.log('File available at', downloadURL);
                                    const fotoPath = uploadTask.snapshot.ref.fullPath
                                    const fotoURL = downloadURL

                                    docRef.update({ id: docId, fotoPath, fotoURL }).then(() => {
                                        resolve(docItem);

                                    }).catch(e => {
                                        reject(e)
                                    });

                                });
                            }
                        );
                    }
                    else {
                        docRef.update({ id: docId }).then(() => {
                            // commit("ADD_ITEM", docItem);
                            resolve(docItem);
                        }).catch(e => {
                            reject(e)
                        })
                    }

                }).catch(e => {
                    reject(e)
                })

            })
        },
        getLista({ commit, state, rootState, dispatch }, { id, mes, ano }) {
            commit("UPDATE_LOAD", false)
            commit("UPDATE_LOAD_ITENS", false)
            return new Promise((resolve, reject) => {
                const user = rootState.auth.usuario;
                if (!user) {
                    // ERROR
                    console.log("none user");
                    commit("UPDATE_LOAD", true)
                    commit("UPDATE_LOAD_ITENS", true)
                    // resolve({ msg: "no user", result: false });
                    reject({ error: "user", msg: "Usuario não encontrado", result: false });
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
                            lista.contasProgramadas = [];

                            if (!lista.titulares.includes(rootState.auth.usuario.email)) {
                                console.log('not auth');
                                commit("UPDATE_LOAD_ITENS", true)
                                // resolve({ msg: "no auth", result: false });
                                reject({ error: "auth", msg: "Não autorizado", result: false });
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
                            // resolve({ msg: "no doc", result: false });
                            reject({ error: "doc", msg: "Não encontrado", result: false });

                        }
                    }).catch((e) => {
                        console.log(e);
                        reject(e);
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

        salvarListaEditada({ commit }, { lista, foto }) {
            return new Promise((resolve) => {
                if (foto) {

                    const metadata = {
                        contentType: foto.type
                    };
                    const ext = foto.name.substr(foto.name.lastIndexOf("."));
                    const id = lista.id
                    const path = `appcontas/${id}/imagens/perfil${ext}`
                    const uploadTask = firebase.storage().ref().child(path).put(foto, metadata);

                    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                        (snapshot) => {

                            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log('Upload is ' + progress + '% done');
                            switch (snapshot.state) {
                                case firebase.storage.TaskState.PAUSED: // or 'paused'
                                    console.log('Upload is paused');
                                    break;
                                case firebase.storage.TaskState.RUNNING: // or 'running'
                                    console.log('Upload is running');
                                    break;
                            }
                        },
                        (error) => {
                            switch (error.code) {
                                case 'storage/unauthorized':
                                    // User doesn't have permission to access the object
                                    break;
                                case 'storage/canceled':
                                    // User canceled the upload
                                    break;

                                // ...

                                case 'storage/unknown':
                                    // Unknown error occurred, inspect error.serverResponse
                                    break;
                            }
                        },
                        () => {
                            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                                console.log('File available at', downloadURL);
                                lista.fotoPath = uploadTask.snapshot.ref.fullPath
                                lista.fotoURL = downloadURL

                                firebase.firestore().collection(firebasePaths.appcontas).doc(lista.id).update(lista).then(() => {
                                    console.log("lista salva");
                                    commit("UPDATE_LISTA_EDITADA", lista)

                                    resolve({
                                        result: true,
                                        msg: 'Lista editada salva',
                                        data: { lista }
                                    })
                                });
                            });
                        }
                    );
                }
                else {
                    firebase.firestore().collection(firebasePaths.appcontas).doc(lista.id).update(lista).then(() => {
                        console.log("lista salva");
                        commit("UPDATE_LISTA_EDITADA", lista)
                        resolve({
                            result: true,
                            msg: 'Lista editada salva',
                            data: { lista }
                        })
                    });
                }
            })
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
        programarItem(store, { item, lista }) {
            return new Promise((resolve, reject) => {
                const novoItem = JSON.parse(JSON.stringify(item))
                delete novoItem.id
                firebase.firestore().collection(firebasePaths.appcontas).doc(lista).collection("tarefas").add({ item: novoItem, lista }).then(((docRef) => {
                    const id = docRef.id;
                    docRef.update({ id }).then(() => {
                        // commit("ADD_ITEM", docItem);
                        resolve();
                    }).catch(e => {
                        reject(e)
                    })
                }))

            })
        },

        deletarTarefa({ state }, id) {
            const listaId = state.lista.id;
            return new Promise((resolve, reject) => {
                firebase.firestore().collection(firebasePaths.appcontas).doc(listaId).collection("tarefas").doc(id).delete().then(() => {
                    // commit("DELETAR_ITEM", index);
                    resolve();
                }).catch(e => {
                    reject(e);
                });
            })
        },
        getContasProgramadas({ state, commit }) {
            const contasProgramadas = [];
            firebase.firestore().collection(firebasePaths.appcontas).doc(state.lista.id).collection("tarefas").get().then((snapshot) => {

                snapshot.forEach((doc) => {
                    const item = doc.data();
                    contasProgramadas.push(item)
                })
                commit("UPDATE_CONTAS_PROGRAMADAS", contasProgramadas)
                console.log(contasProgramadas)
            })
        }
    }
};