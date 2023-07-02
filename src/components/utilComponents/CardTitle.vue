<template>
    <el-card class="titleBackground" body-style=
    "padding-top:0%;padding-left:0%;display: flex;" shadow="never">
  <!-- <div class="titleBackground"> -->
      <div class="titleName">{{name}}</div>
      <slot ></slot>
  <!-- </div> -->
    </el-card>
</template>

<script>
export default {
  name: 'cardTitle',
  props: [
    'name',
  ],
};
</script>

<style scoped>
.titleBackground{
    background-color: rgb(236, 236, 236);
    border-radius: .3em .3em 0 0;
    padding-top: 0em;
    height: 1.5em;
    z-index: 99;
    position:relative;
}

.titleName{
    padding-left: .5em;
    padding-top: .4em;
    padding-bottom: .3em;
    font-family: sans-serif;
    font-size: .8em;
    font-weight:bolder;
    flex: auto;
}

slot{
    flex:2;
    align-self: flex-end;
}
</style>
