<template>
    <div id="app">
        <router-view/>
        <Scene/>
    </div>
</template>

<script>
import Scene from './components/Scene/Scene';

export default {
    name: 'app',
    components: {
        Scene
    }
}
</script>

<style>

@font-face {
    font-family: 'Montserrat';
    font-weight: 300;
    src: url("./assets/fonts/Montserrat-Light.ttf") format("opentype");
}

@font-face {
    font-family: 'Montserrat';
    font-weight: 600;
    src: url("./assets/fonts/Montserrat-SemiBold.ttf") format("opentype");
}

@font-face {
    font-family: 'Montserrat';
    font-weight: 600;
    src: url("./assets/fonts/Montserrat-Bold.ttf") format("opentype");
}

body {
    height: 100vh;
    margin: 0;
    overflow: hidden;
    touch-action: none;
}

#app {
    font-family: 'Montserrat';
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #000;
}
</style>
