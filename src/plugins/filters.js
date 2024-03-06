import Vue from 'vue';

Vue.filter('capitalize', function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
});

Vue.filter('euros', function (num) {
    if (!num && num !== 0) return ''
    num = Number(num);
    return num.toLocaleString("pt-BR", {
        currency: "EUR",
        maximumFractionDigits: 2,
        style: "currency",
    });
})
