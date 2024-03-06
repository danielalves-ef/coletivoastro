<template>
  <v-menu origin="top center" transition="scale-transition">
    <template v-slot:activator="{ on, attrs }">
      <v-list two-line subheader>
        <v-list-item v-bind="attrs" v-on="on">
          <v-list-item-avatar size="25">
            <v-icon>${{ $i18n.locale }}</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-subtitle class="text-caption">
              {{ $t("idiomas.idioma") }}
            </v-list-item-subtitle>
            <v-list-item-title>{{
              $t("idiomas." + $i18n.locale)
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>
    <v-list>
      <v-list-item-group>
        <v-list-item
          :style="{ cursor: 'pointer' }"
          v-for="item in idiomas"
          :key="item.locale"
          @click="setLocale(item.locale)"
        >
          <v-list-item-icon
            ><v-icon>${{ item.locale }}</v-icon></v-list-item-icon
          >
          <v-list-item-title>{{
            $t("idiomas." + item.locale)
          }}</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: "astro-select-locale",
  data() {
    return {
      idiomas: {
        es: {
          locale: "es",
          text: "espanhol",
        },
        pt: {
          locale: "pt",
          text: "portugues",
        },
        en: {
          locale: "en",
          text: "ingles",
        },
      },
    };
  },
  methods: {
    setLocaleRouter(locale) {
      if (this.$i18n.locale !== locale) {
        this.$i18n.locale = locale;
        const to = this.$router.resolve({ params: { locale } }); // <--------------------
        this.$router.push(to.location); // <--------------------
      }
    },
    setLocale(locale) {
      this.$i18n.locale = locale;
    },
    getTemaFromLocal() {
      const isDark = localStorage.getItem("theme_isDark");
      const primary = localStorage.getItem("theme_primary");
      if (isDark) {
        this.$vuetify.theme.dark = isDark == "true" ? true : false;
      }
      if (primary) {
        this.$vuetify.theme.themes.dark.primary = primary;
        this.$vuetify.theme.themes.light.primary = primary;
      }
    },
  },
  mounted() {
    this.getTemaFromLocal();
  },
};
</script>

<style>
</style>