<template>
  <div id="app">
    <checkComponents></checkComponents>
  </div>
</template>

<script>
import checkComponents from './components/checkComponents.vue';

export default {
  name: 'App',
  components: {
    checkComponents,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
