<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { useElementSize } from '@vueuse/core';
  import { useThemeToken } from '@/utils/hooks';

  const token = useThemeToken();

  const props = defineProps({
    timeStamp: {
      type: String,
      required: true,
    },
    logMessage: {
      type: String,
      required: true,
    },
    isLast: {
      type: Boolean,
      required: true,
    },
  });
  const timeStampSize = ref(null);
  const size = reactive(useElementSize(timeStampSize));

  const minWidth = computed(() => {
    if (size.width < 340) return '90px';
    else return '162px';
  });
</script>

<template>
  <div ref="timeStampSize" class="container">
    <div class="text timeStamp" :style="{ minWidth }">
      {{ new Date(props.timeStamp).toLocaleString('de-DE') }}
    </div>
    <div class="line-container">
      <div class="circle" />
      <div v-if="!isLast" class="line" />
    </div>
    <p class="text">
      {{ props.logMessage }}
    </p>
  </div>
</template>

<style scoped>
  .line-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 10px;
    transform: translateY(7px);
  }

  .circle {
    width: 10px !important;
    height: 10px !important;
    background-color: v-bind('token.colorBgContainer');
    border: 3px solid #6d6e6f;
    border-radius: 50%;
    box-sizing: border-box;
  }
  .line {
    width: 3px;
    min-height: 30px;
    background-color: v-bind('token.colorTextDisabled');
    flex-grow: 1;
  }
  .container {
    display: flex;
    flex-direction: row;
    height: max-content;
  }
  .text {
    margin: 0 0 20px;
  }
  .timeStamp {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    height: 0;
    margin-right: -30px;
    max-width: 90px;
  }

  .timeStamp p {
    width: 70px;
    margin: 0;
  }
</style>
