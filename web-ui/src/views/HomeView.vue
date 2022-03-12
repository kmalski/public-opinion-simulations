<template>
  <div class="home">
    <sigma-example />
  </div>
</template>

<script lang="ts">
import SigmaExample from '@/components/SigmaExample.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    SigmaExample
  }
});
</script>
