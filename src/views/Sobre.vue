<template>
    <div>
        <v-container>
            <v-row>
                <v-col cols="12"> </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
export default {
    name: "Sobre",
    data() {
        return {
            itens: [],
            // *** CONTAS DE CASA
            novoId: "JpzmybvjMben5hkZeUJ6",
            oldId: "lwazGwDPLLvxLRHxBOmQ",
            // ***  MERCADO
            // novoId: "nRE7V5GLW2xLUeIAohxE",
            // oldId: "chO8Jg0qFXYOQWisZVly",
        };
    },
    computed: {
        itensNovos() {
            return this.itens.map((item) => {
                const {
                    data,
                    dataText,
                    mesText,
                    ano,
                    cor,
                    icone,
                    id,
                    mes,
                    quemPagou,
                    valor,
                    pagamento,
                    pagadores,
                    conceito,
                    divisao,
                } = item;

                const nota = "";
                const date = new Date(data);
                const novadata = date.toISOString().substr(0, 10);
                const now = data;

                let quemPagouOK = quemPagou;

                if (quemPagou === "nat") {
                    quemPagouOK = "nati";
                }

                const novoPagamento = pagadores.map((pagador) => {
                    let pagadorOK = pagador;

                    if (pagador === "nat") {
                        pagadorOK = "nati";
                    }

                    return {
                        slug: pagadorOK,
                        nome: pagadorOK,
                        divisao: divisao[pagador],
                        pagamento:
                            pagamento[pagador] === undefined
                                ? true
                                : pagamento[pagador],
                    };
                });

                const pagadoresOK = pagadores.map((p) => {
                    let pOK = p;
                    if (p === "nat") {
                        pOK = "nati";
                    }
                    return pOK;
                });
                console.log(mesText);
                const novoMesText =
                    typeof mesText === "object"
                        ? mesText.nome.toLowerCase()
                        : mesText.toLowerCase();

                // const cat = conceito.toLowerCase();
                // const categoria =
                //     cat.includes("cap") ||
                //     cat.includes("caprabo") ||
                //     cat.includes("capabro")
                //         ? "Caprabo"
                //         : cat.includes("mercadona")
                //         ? "Mercadona"
                //         : "Outros";
                const categoria = "Moradia";

                return {
                    pagadores: pagadoresOK,
                    conceito,
                    data: novadata,
                    criadoPor: "sistema",
                    categoria: categoria,
                    pagamento: novoPagamento,
                    formaDivisao: "igual",
                    mesText: novoMesText,
                    now,
                    dataText,
                    ano,
                    cor,
                    icone,
                    id,
                    mes,
                    quemPagou: quemPagouOK,
                    valor,
                    nota,
                };
            });
        },
    },
    methods: {
        getAllContas() {
            this.itens = [];
            this.$firestore
                .collection("appcontas")
                .doc(this.oldId)
                .collection("itens")
                .get()
                .then((snapshot) => {
                    snapshot.forEach((snap) => {
                        const doc = snap.data();
                        this.itens.push(doc);
                    });
                });
        },
        salvarTodos() {
            const promises = [];
            this.itensNovos.forEach((item) => {
                const promise = this.$firestore
                    .collection("appcontas")
                    .doc(this.novoId)
                    .collection("itens")
                    .doc(item.id)
                    .set(item);
                promises.push(promise);
            });
            Promise.all(promises)
                .then(() => {
                    this.$swal({
                        title: "sucesso",
                        icon: "success",
                    });
                })
                .catch((e) => {
                    this.$swal({
                        title: "algo deu errado",
                        text: e,
                        icon: "error",
                    });
                });
        },
    },
    mounted() {
        this.getAllContas();
    },
};
</script>

<style>
</style>