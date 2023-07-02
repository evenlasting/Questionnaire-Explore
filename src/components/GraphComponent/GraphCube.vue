<template>
    <g>
        <polygon :point="leftTri"></polygon>
        <polygon :point="rightTri"></polygon>
    </g>
</template>

<script>
export default {
  name: 'cube',
  data() {
    return {
      size: 10,
      leftColol: null,
      rightColol: null,

    };
  },
  mounted() {

  },
};
</script>

<style scoped>

</style>
