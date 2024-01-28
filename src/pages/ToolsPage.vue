<template>
  <q-page class="container" padding>
    <div>
      <KeyGeneratorComponent />
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import KeyGeneratorComponent from "src/components/KeyGeneratorComponent.vue"

</script>
<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
}
</style>
