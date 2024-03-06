<template>
    <div>
        <v-container>
            <v-row class="mt-10" align="center">
                <v-col cols="12" class="d-flex align-center">
                    <h4 class="text-h5">Criar nova lista</h4>
                    <v-spacer></v-spacer>
                    <v-btn>Salvar</v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <v-card max-width="500" class="mx-auto">
                        <v-card-title> Detalhes </v-card-title>
                        <v-card-text>
                            <v-text-field
                                dense
                                label="Nome"
                                placeholder="ex: contas de casa"
                                outlined
                            >
                            </v-text-field>
                            <v-textarea
                                dense
                                label="Descrição"
                                placeholder="ex: Dispensas e gastos comuns da casa"
                                outlined
                                rows="1"
                                auto-grow
                            >
                            </v-textarea>
                            <v-subheader>
                                <h4 class="white--text">
                                    <v-icon class="mr-2" color="white"
                                        >list</v-icon
                                    >
                                    Info geral
                                </h4>
                            </v-subheader>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
export default {};
</script>

<style>
</style>