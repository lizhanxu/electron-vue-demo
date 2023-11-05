<!--<template>-->
  <!--<div id="app">-->
    <!--<router-view></router-view>-->
  <!--</div>-->
<!--</template>-->

<!--<script>-->
  <!--export default {-->
    <!--name: 'electron-vue-project'-->
  <!--}-->
<!--</script>-->

<!--<style>-->
  <!--/* CSS */-->
<!--</style>-->
<template>
  <div id="app">
    <!-- <router-view></router-view> -->
    <button @click="autoUpdate()">获取更新</button>
    <ol id="content">
      <li>生命周期过程展示</li>
    </ol>
  </div>
</template>

<script>
  // import { ipcRenderer } from 'electron';
  const { ipcRenderer } = require('electron');
  export default {
    name: 'my-project1',
    mounted() {
      var _ol = document.getElementById("content");
      ipcRenderer.on('message',(event,{message,data}) => {
        let _li = document.createElement("li");
        _li.innerHTML = message + " <br>data:" + JSON.stringify(data) +"<hr>";
        _ol.appendChild(_li);
        if (message === 'isUpdateNow') {
          if (confirm('是否现在更新？')) {
            ipcRenderer.send('updateNow');
          }
        }
      });
    },
    methods: {
      autoUpdate() {
        ipcRenderer.send('update');
      }
    }
  };
</script>

<style>
  /* CSS */
</style>
