<template>
  <div class="menu-container" :class="{ open: menuAtivo }">
    <span class="menu-bar"></span>
    <span class="menu-bar"></span>
    <span class="menu-bar"></span>
  </div>
</template>

<script>
export default {
  name: "menu-navbar",

  computed: {
    menuAtivo() {
      return this.$store.state.controles.menuAtivo;
    },
  },
  methods: {
    toggleMenu() {
      this.$store.dispatch("controles/toggleMenu");
    },
  },
};
</script>

<style lang="scss" scoped>
.menu-container {
  width: 35px;
  height: 30px;
  position: relative;
  transform: rotate(0deg);
  cursor: pointer;
  transition: 0.2s ease-in-out;
  .menu-bar {
    display: block;
    position: absolute;
    height: 3px;
    width: 100%;
    background: #fff;
    border-radius: 9px;
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition: 0.2s ease-in-out;
    transform-origin: left center;
    &:nth-child(1) {
      top: 4px;
    }
    &:nth-child(2) {
      top: 12px;
    }
    &:nth-child(3) {
      top: 20px;
    }
  }
  &.open {
    .menu-bar:nth-child(1) {
      transform: rotate(45deg);
      top: 0px;
      left: 6px;
    }
    .menu-bar:nth-child(2) {
      width: 0;
      opacity: 0;
    }
    .menu-bar:nth-child(3) {
      transform: rotate(-45deg);
      top: 26px;
      left: 6px;
    }
  }
}
</style>>
