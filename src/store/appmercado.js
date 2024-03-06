export default {
    namespaced: true,
    state: {
        tags: [
            "Tomate",
            "Cebola",
            "Cafe",
            "Batata",
            "Agua",
            "Leite",
            "Molho de tomate",
            "Creme de leite",
            "Azeitona",
            "Cenoura",
            "Alho",
            "Alface",
            "Morango",
            "Coca cola",
            "Frango",
            "Macarrão",
            "Feijão",
            "Requeijão",
        ],
        produtos: [
            {
                nome: "Tomate",
                icone: null,
            }
        ]
    },
    getters: {
        value: state => {
            return state.value;
        }
    },
    mutations: {
        updateValue(state, payload) {
            state.value = payload;
        }
    },
    actions: {
        updateValue({ commit }, payload) {
            commit('updateValue', payload);
        }
    }
};