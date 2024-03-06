import firebase from "firebase/app";
import "firebase/firestore"
import "firebase/storage"


const firebasePaths = {
    appcontas: 'appcontas'
}

export default {
    namespaced: true,
    state: {
        listagem: [],
        loaded: false,

    },
    mutations: {
        LISTAGEM_ADD(state, item) {
            state.listagem.push(item)
        },
        LISTAGEM_RESETAR(state) {
            state.listagem = [];
        },
        LISTAGEM_DELETAR(state, index) {
            state.listagem.splice(index, 1);
        },
        UPDATE_STATUS(state, status) {
            state.loaded = status
        }
    },
    actions: {
        salvarNovaLista({ commit }, { lista, foto }) {

            return new Promise((resolve) => {
                firebase.firestore()
                    .collection(firebasePaths.appcontas)
                    .add(lista)
                    .then((docRef) => {
                        const id = docRef.id;

                        if (foto) {

                            const metadata = {
                                contentType: foto.type
                            };
                            const ext = foto.name.substr(foto.name.lastIndexOf("."));
                            const path = `appcontas/${id}/imagens/perfil${ext}`
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

                                        docRef.update({ id, fotoPath, fotoURL }).then(() => {
                                            console.log("lista salva");
                                            commit("LISTAGEM_ADD", lista)
                                            resolve({
                                                result: true,
                                                msg: 'Lista salva com ID: ' + id,
                                                data: { id }
                                            })
                                        });

                                    });
                                }
                            );

                        }
                        else {
                            docRef.update({ id }).then(() => {
                                console.log("lista salva");
                                commit("LISTAGEM_ADD", lista)
                                resolve({
                                    result: true,
                                    msg: 'Lista salva com ID: ' + id,
                                    data: { id }
                                })
                            });
                        }
                    });
            })
        },
        salvarListaEditada(store, { lista, foto }) {
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
                        resolve({
                            result: true,
                            msg: 'Lista editada salva',
                            data: { lista }
                        })
                    });
                }
            })
        },
        salvarListaEditada2({ state }, { lista }) {
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
            commit("UPDATE_STATUS", false)
            return new Promise((resolve, reject) => {
                const user = rootState.auth.usuario;
                if (!user) { reject() }
                commit("LISTAGEM_RESETAR");
                const email = user.email;
                firebase.firestore()
                    .collection(firebasePaths.appcontas)
                    .where("titulares", "array-contains", email)
                    .where("archivada", "==", false)
                    .get()
                    .then((snapshot) => {
                        snapshot.forEach((doc) => {
                            const lista = doc.data();
                            commit("LISTAGEM_ADD", lista)
                        });
                        commit("UPDATE_STATUS", true)
                        resolve();

                    })
                    .catch((e) => {
                        commit("UPDATE_STATUS", true)
                        reject(e);
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

    }
};