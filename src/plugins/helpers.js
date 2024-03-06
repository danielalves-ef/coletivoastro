import colors from "vuetify/lib/util/colors";

export default {
    install(Vue) {
        const helpers = {}
        helpers.colors = colors;
        // TO MONEY
        helpers.toMoney = (num, right = false) => {
            const numero = Number(num);
            let string = numero.toLocaleString("pt-BR", {
                currency: "EUR",
                maximumFractionDigits: 2,
                style: "currency",
            });

            if (right) {
                const pos = numero < 0 ? 1 : 0;
                const simbol = string.charAt(pos);
                string = string.replace(simbol, "") + " " + simbol
            }
            return string
        };

        helpers.capitalize = (s) => {
            if (typeof s !== 'string') return '';
            return s.charAt(0).toUpperCase() + s.slice(1);
        }

        helpers.momento = (data) => {
            const antes = data;
            const agora = Date.now();
            const minutos = (agora - antes) / 1000 / 60;
            if (minutos < 60) {
                return Math.floor(minutos) + " min"
            }
            const horas = minutos / 60;
            if (horas < 24) {
                return Math.floor(horas) + " h"
            }
            const dias = horas / 24;
            if (dias < 7) {
                return Math.floor(dias) + " d"
            }
            const semanas = dias / 7;
            return Math.floor(semanas) + " sem"
        }





        Vue.prototype.$helpers = helpers;

    }
};