<template>
    <div class="mercado">
        <v-toolbar dark color="primary gradient" height="80">
            <v-container>
                <v-row>
                    <v-col cols="12">
                        <v-text-field
                            append-icon="mdi-plus-circle-outline"
                            filled
                            outlined
                            hide-details="auto"
                            v-model="newItem.nome"
                            @click:append="addItem"
                            @keydown.enter="addItem"
                            color="light"
                        ></v-text-field>
                    </v-col>
                </v-row>
            </v-container>
        </v-toolbar>

        <v-container>
            <v-row>
                <v-col cols="12">
                    <div>
                        <v-chip-group :show-arrows="false">
                            <v-chip
                                @click="clickTag(tag)"
                                v-for="tag in filteredTags"
                                :key="tag.nome"
                                color="primary"
                            >
                                {{ tag }}</v-chip
                            >
                        </v-chip-group>
                    </div>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12">
                    <v-list v-if="itemsNaoComprados.length" subheader>
                        <v-subheader>
                            <v-icon class="mr-2"> mdi-cart-plus </v-icon>
                            Itens para comprar</v-subheader
                        >
                        <v-fade-transition group>
                            <v-list-item
                                dark
                                class="mx-3 my-1 gradient rounded item-mercado"
                                :class="[
                                    item.color,
                                    item.comprado ? 'comprado' : '',
                                ]"
                                v-for="item in itemsNaoComprados"
                                :key="item.nome"
                                @click="clickItem(item)"
                                v-hammer:swipe.left="
                                    (e) => {
                                        removeItem(item);
                                    }
                                "
                                v-hammer:press="
                                    (e) => {
                                        removeItem(item);
                                    }
                                "
                            >
                                <v-list-item-avatar>
                                    <v-img :src="imagePath(item)"> </v-img>
                                </v-list-item-avatar>
                                <v-list-item-title
                                    >{{ item.nome }}
                                </v-list-item-title>
                                <v-list-item-action
                                    v-if="item.color === 'success'"
                                >
                                    <v-icon>mdi-check</v-icon>
                                </v-list-item-action>
                                <v-list-item-action
                                    v-if="item.color === 'danger'"
                                >
                                    <v-icon>mdi-close</v-icon>
                                </v-list-item-action>
                            </v-list-item>
                        </v-fade-transition>
                    </v-list>
                </v-col>
                <v-col cols="12">
                    <v-list v-if="itemsComprados.length" subheader>
                        <v-subheader>
                            <v-icon class="mr-2">mdi-cart-check</v-icon>
                            Itens Comprados</v-subheader
                        >
                        <v-fade-transition group>
                            <v-list-item
                                dark
                                class="mx-3 my-1 gradient rounded item-mercado"
                                :class="[
                                    item.color,
                                    item.comprado ? 'comprado' : '',
                                ]"
                                v-for="item in itemsComprados"
                                :key="item.nome"
                                @click="clickItem(item)"
                                v-hammer:swipe.left="
                                    (e) => {
                                        removeItem(item);
                                    }
                                "
                            >
                                <v-list-item-title
                                    >{{ item.nome }}
                                </v-list-item-title>
                                <v-list-item-action>
                                    <v-icon>mdi-check</v-icon>
                                </v-list-item-action>
                            </v-list-item>
                        </v-fade-transition>
                    </v-list>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
export default {
    name: "mercado",
    data() {
        return {
            newItem: {
                nome: "",
                comprado: false,
                color: "primary",
            },
            items: [],
        };
    },
    watch: {
        "items.length"() {
            this.sortItems();
        },
    },
    computed: {
        imagePath() {
            return (item) => {
                const nome = item.nome.toLowerCase();
                try {
                    return require(`../../assets/appmercado/${nome}.svg`);
                } catch (e) {
                    return "https://cdn.iconscout.com/icon/premium/png-128-thumb/birthday-cake-1806490-1534548.png";
                }
            };
        },
        tags() {
            return this.$store.state.appmercado.tags;
        },
        itemsComprados() {
            return this.items.filter((item) => item.comprado);
        },
        itemsNaoComprados() {
            return this.items.filter((item) => !item.comprado);
        },
        filteredTags() {
            if (this.newItem.nome !== "") {
                const exp = new RegExp(this.newItem.nome, "gi");
                return this.tags.filter((tag) => {
                    return exp.test(tag);
                });
            } else {
                return this.tags.filter((tag) => {
                    return !this.items.some((item) => {
                        return tag.toLowerCase() === item.nome.toLowerCase();
                    });
                });
            }
        },
    },
    methods: {
        addTag(tag) {
            this.items.unshift({
                nome: tag,
                comprado: false,
                color: "primary",
            });
        },
        removeTag(tag) {
            const index = this.tags.indexOf(tag);
            if (index !== -1) {
                this.tags.splice(index, 1);
            }
        },
        clickTag(tag) {
            this.addTag(tag);
            // this.removeTag(tag);
            this.resetItem();
        },
        clickItem2(item) {
            item.comprado = !item.comprado;
            item.color = item.comprado ? "success" : "primary";
            this.sortItems();
        },
        clickItem(item) {
            item.color = !item.comprado ? "success" : "primary";
            setTimeout(() => {
                item.comprado = !item.comprado;
                this.sortItems();
            }, 300);
        },
        removeItem(itemToRemove) {
            const index = this.items.findIndex((item) => {
                return item.nome === itemToRemove.nome;
            });
            if (index !== -1) {
                const item = this.items[index];
                item.color = "danger";
                setTimeout(() => {
                    this.items.splice(index, 1);
                }, 300);
            }
        },
        addItem() {
            const hasItem = this.items.find((item) => {
                return item.nome === this.newItem.nome;
            });
            if (!hasItem) {
                this.items.unshift(this.newItem);
                this.resetItem();
            }
        },
        resetItem() {
            this.newItem = {
                nome: "",
                comprado: false,
                color: "primary",
            };
        },
        sortItems() {
            this.items.sort((a, b) => {
                return (
                    Number(a.comprado) - Number(b.comprado) ||
                    a.nome.localeCompare(b.nome)
                );
            });
        },
    },
};
</script>

<style>
.item-mercado {
    touch-action: pan-y !important;
}
</style>