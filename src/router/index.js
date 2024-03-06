import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Teste from '../views/Teste.vue'


import firebase from "firebase/app";
import "firebase/auth";
import store from '@/store/index.js'
import Default from '@/views/Default.vue'


Vue.use(VueRouter)

const routes = [
    // HOME
    {
        path: '/',
        name: 'home',
        component: Home
    },
    // SHARE    
    {
        path: '/share',
        name: 'share',
        component: () => import(/* webpackChunkName: "share" */ '../views/Share.vue')
    },
    // TESTE
    {
        path: '/teste',
        name: 'teste',
        component: Teste
    },
    // LOGIN
    {
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
    },
    // AJUDA
    {
        path: '/ajuda',
        name: 'ajuda',
        component: () => import(/* webpackChunkName: "login" */ '../views/Ajuda.vue')
    },
    // SOBRE
    {
        path: '/sobre',
        name: 'sobre',
        component: () => import(/* webpackChunkName: "login" */ '../views/Sobre.vue')
    },
    // PERFIL
    {
        path: '/perfil',
        component: Default,
        meta: {
            authRequired: true,
        },
        children: [
            {
                path: '',
                name: 'perfil',
                component: () => import(/* webpackChunkName: "perfil" */ '../views/Perfil.vue')
            }
        ]
    },
    // MERCADO
    {
        path: '/mercado',
        component: Default,
        meta: {
            authRequired: true,
        },
        children: [
            {
                path: '',
                name: 'mercado',
                component: () => import(/* webpackChunkName: "mercado" */ '../views/mercado/Mercado.vue')
            }
        ]
    },
    // MERCADONA
    {
        path: '/mercadona',
        component: Default,
        meta: {
            authRequired: true,
        },
        children: [
            {
                path: '',
                name: 'mercadona',
                component: () => import(/* webpackChunkName: "mercado" */ '../views/mercadona/CategoriasMercadona.vue')
            },
            {
                path: ':categoria',
                name: 'mercadona-categoria',
                component: () => import(/* webpackChunkName: "mercado" */ '../views/mercadona/CategoriaMercadona.vue')
            }
        ]
    },
    // DIVIDAS
    {
        path: '/dividas',
        component: Default,
        meta: {
            authRequired: true,
        },
        children: [
            {
                path: '',
                name: 'dividas-item',
                component: () => import(/* webpackChunkName: "dividas-item" */ '../views/dividas/DividasItem.vue')
            },
            {
                path: 'criar',
                name: 'dividas-criar',
                component: () => import(/* webpackChunkName: "dividas-item" */ '../views/dividas/DividasCriar.vue')
            }
        ]
    },
    // AMIGOS
    {
        path: '/amigos',
        component: Default,
        meta: {
            authRequired: true,
        },
        children: [
            {
                path: '',
                name: 'amigos-list',
                component: () => import(/* webpackChunkName: "dividas-item" */ '../views/amigos/AmigosList.vue')
            }
        ]
    },
    // CONTAS
    {
        path: '/contas',
        component: Default,
        meta: {
            authRequired: true,
        },
        children: [
            {
                path: '',
                name: 'contas',
                component: () => import(/* webpackChunkName: "listaid" */ '../views/appcontas/Contas.vue'),
                // meta: {
                //   authRequired: true
                // },
            },
            // CRIAR LISTA DE CONTAS
            {
                path: 'criar',
                name: 'contas-criar',
                component: () => import(/* webpackChunkName: "ContasCriar" */ '../views/appcontas/criar/ContasCriar.vue'),
            },
            // SHOW LISTA ID
            {
                path: ':id',
                component: () => import(/* webpackChunkName: "ContasId" */ '../views/appcontas/id/ContasId.vue'),
                name: 'contas-id',
                redirect: { name: 'contas-lista' },
                props: true,
                children: [
                    // CONTAS-LISTA
                    {
                        path: '',
                        name: 'contas-lista',
                        component: () => import(/* webpackChunkName: "ContasLista" */ '../views/appcontas/id/lista/ContasLista.vue'),
                        props: true,
                    },

                    // CONTAS-DETALHES
                    {
                        path: 'detalhes',
                        name: 'contas-detalhes',
                        component: () => import(/* webpackChunkName: "ContasDetalhes" */ '../views/appcontas/id/detalhes/ContasDetalhesShow.vue'),
                        props: true,
                    },
                    {
                        path: 'detalhes/editar',
                        name: 'contas-detalhes-editar',
                        component: () => import(/* webpackChunkName: "ContasDetalhes" */ '../views/appcontas/id/detalhes/ContasDetalhesEditar.vue'),
                        props: true,
                    },

                    // CONTAS-ADD
                    {
                        path: 'add',
                        name: 'contas-add',
                        component: () => import(/* webpackChunkName: "ContasAdd" */ '../views/appcontas/id/add/ContasAdd.vue'),
                        props: true,
                    },

                    // CONTAS-BALANCO
                    {
                        path: 'balanco',
                        name: 'contas-balanco',
                        component: () => import(/* webpackChunkName: "ContasBalanco" */ '../views/appcontas/id/balanco/ContasBalanco.vue'),
                        props: true,
                    },

                    // CONTAS-PAGAR
                    {
                        path: 'pagar',
                        name: 'contas-pagar',
                        component: () => import(/* webpackChunkName: "ContasPagar" */ '../views/appcontas/id/pagar/ContasPagar.vue'),
                        props: true,
                    },

                    {
                        path: 'item/:item',
                        name: 'contas-item',
                        component: () => import(/* webpackChunkName: "ContasDetalhes" */ '../views/appcontas/id/item/ContasItem.vue'),
                        props: true,
                    },

                ]
            },

        ]
    },
    // COMPRAS
    {
        path: '/compras',
        component: Default,
        meta: {
            authRequired: true,
        },
        children: [
            {
                path: '',
                name: 'compras',
                component: () => import(/* webpackChunkName: "compras" */ '../views/compras/Compras.vue')
            },
            {
                path: 'criar',
                name: 'compras-criar',
                params: true,
                component: () => import(/* webpackChunkName: "compras-criar" */ '../views/compras/ComprasCriar.vue')
            },
            {
                path: ':id',
                name: 'compras-id',
                params: true,
                component: () => import(/* webpackChunkName: "compras-id" */ '../views/compras/ComprasId.vue')
            },


        ]
    },
    // ALL OTHERS
    {
        path: '/:catchAll(.*)',
        component: () => import(/* webpackChunkName: "compras-id" */ '../views/404.vue'),
        name: '404'
    }

]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    firebase.auth().onAuthStateChanged((user) => {
        window.console.log('status changed', user)
        const requiresAuth = to.matched.some(record => record.meta.authRequired);
        const usuario = store.state.auth.usuario;

        if (!user && !usuario) {
            console.log("!user && !usuario")
            if (requiresAuth) {
                // salva destino e envia para pagina de login
                store.dispatch('controles/setRouteTo', to)
                store.dispatch('controles/setPageLoaded', true)
                next({ name: "login" });
            }
            store.dispatch('controles/setPageLoaded', true)

            next();
        }
        else if (usuario && user && user.uid === usuario.uid) {
            console.log("usuario && user && user.uid === usuario.uid")
            store.dispatch('controles/setPageLoaded', true)

            next();
        }
        else if (!usuario && user) {
            console.log("!usuario && user")

            store.dispatch("auth/loginIntoStore", user).then(async () => {
                await store.dispatch("usuario/initUsuario")
                await store.dispatch('controles/setPageLoaded', true)
                next();
            })
        }
        else {
            if (!user) {
                console.log("else !user")

                store.dispatch("auth/loginIntoStore", user).then(() => {
                    if (requiresAuth) {
                        // salva destino e envia para pagina de login
                        store.dispatch('controles/setRouteTo', to)
                        store.dispatch('controles/setPageLoaded', true)

                        next({ name: "login" });
                    }
                    store.dispatch('controles/setPageLoaded', true)

                    next();
                })
            }
            else {
                console.log("else user")

                store.dispatch("auth/loginIntoStore", user).then(() => {
                    store.dispatch("config/initConfig").then(() => {
                        store.dispatch('controles/setPageLoaded', true)

                        next();
                    });
                })
            }
        }
    })
})

// router.beforeEach((to, from, next) => {
//     firebase.auth().onAuthStateChanged((user) => {
//         window.console.log('status changed', user)

//         const loggedUser = store.state.auth.usuario
//         console.log(loggedUser);

//         const requiresAuth = to.matched.some(record => record.meta.authRequired);
//         store.dispatch("auth/loginIntoStore", user).then(() => {
//             // TEM USUARIO CONECTADO
//             if (user) {
//                 store.dispatch("config/initConfig");
//                 next();
//             }
//             // NAO HA USUARIO CONECTADO
//             else {
//                 if (requiresAuth) {
//                     store.dispatch('controles/setRouteTo', to)
//                     next({ name: "login" });
//                 }
//                 else {
//                     next();
//                 }
//             }

//         })
//     })
// })


// router.beforeEach((to, from, next) => {
//     firebase.auth().onAuthStateChanged((user) => {
//         window.console.log('status changed', user)

//         const loggedUser = store.state.auth.usuario
//         console.log(loggedUser);

//         const requiresAuth = to.matched.some(record => record.meta.authRequired);
//         store.dispatch("auth/loginIntoStore", user).then(() => {
//             // TEM USUARIO CONECTADO
//             if (user) {
//                 store.dispatch("config/initConfig");
//                 next();
//             }
//             // NAO HA USUARIO CONECTADO
//             else {
//                 if (requiresAuth) {
//                     store.dispatch('controles/setRouteTo', to)
//                     next({ name: "login" });
//                 }
//                 else {
//                     next();
//                 }
//             }

//         })
//     })
// })

export default router
