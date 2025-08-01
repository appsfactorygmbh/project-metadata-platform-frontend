<script lang="ts" setup>
  // Import ref for reactive variables and utility functions for URL handling.
  import { inject, ref, watch } from 'vue';
  import { createFaviconURL, cutAfterTLD } from './editURL';
  import { DeleteOutlined } from '@ant-design/icons-vue';
  import { projectEditStoreSymbol } from '@/store/injectionSymbols';
  import { useThemeToken } from '@/utils/hooks';

  const token = useThemeToken();

  // Define the component's props with pluginName and url as required strings.
  const props = defineProps({
    id: {
      type: Number,
      required: true,
    },
    pluginName: {
      type: String,
      required: false,
      default: '',
    },
    url: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    isLoading: {
      type: Boolean,
      required: false,
    },
    isEditing: {
      type: Boolean,
      required: true,
    },
    editKey: {
      type: Number,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      required: false,
    },
    showFavicon: {
      type: Boolean,
      default: true,
    },
  });

  const initDisplayName = props.displayName;
  const initUrl = props.url;

  const projectEditStore = inject(projectEditStoreSymbol);
  const urlStatusRef = ref<'' | 'error' | 'warning' | undefined>('');
  const displayNameStatusRef = ref<'' | 'error' | 'warning' | undefined>('');

  const displayNameInput = ref<string>(props.displayName);
  const urlInput = ref<string>(props.url);

  const toggleSkeleton = ref<boolean>(props.isLoading);

  watch(
    () => props.isEditing,
    (newVal) => {
      if (!newVal) {
        displayNameInput.value = initDisplayName;
        urlInput.value = initUrl;
        hide.value = false;
        urlStatusRef.value = '';
        displayNameStatusRef.value = '';
      }
    },
  );

  watch(
    () => props.isLoading,
    (newVal) => {
      toggleSkeleton.value = newVal;
    },
  );

  watch(
    () => projectEditStore?.getPluginsWithUrlConflicts,
    (newVal) => {
      if (props.editKey !== undefined && newVal?.includes(props.editKey)) {
        urlStatusRef.value = 'error';
      } else if (urlInput.value === '') {
        urlStatusRef.value = 'error';
      } else {
        urlStatusRef.value = '';
      }
    },
  );

  // Create a reactive variable for the favicon URL based on the given URL.
  const faviconUrl = ref(createFaviconURL(cutAfterTLD(props.url)));

  // Hides the plugin card if set to true
  const hide = ref<boolean>(false);
  const hidePlugin = () => {
    hide.value = true;
    if (props.editKey !== undefined) {
      projectEditStore?.deletePlugin(props.editKey);
    }
  };

  // Run on every key press in the input fields to update the plugin data
  const updatePluginData = (): void => {
    if (urlInput.value === '') {
      urlStatusRef.value = 'error';
      if (props.editKey !== undefined) {
        projectEditStore?.addEmptyUrlField(props.editKey);
      }
    } else if (props.editKey !== undefined) {
      projectEditStore?.removeEmptyUrlField(props.editKey);
      urlStatusRef.value = '';
    }

    if (displayNameInput.value === '') {
      displayNameStatusRef.value = 'error';
      if (props.editKey !== undefined) {
        projectEditStore?.addEmptyDisplaynameField(props.editKey);
      }
    } else if (props.editKey !== undefined) {
      projectEditStore?.removeEmptyDisplaynameField(props.editKey);
      displayNameStatusRef.value = '';
    }

    if (props.editKey !== undefined) {
      projectEditStore?.updatePluginChanges(props.editKey, {
        pluginName: props.pluginName,
        displayName: displayNameInput.value,
        url: urlInput.value,
        id: props.id,
        editKey: props.editKey,
        isDeleted: false,
      });
    }
  };
</script>

<template>
  <template v-if="isEditing">
    <a-card
      class="cardNoHover"
      :loading="toggleSkeleton"
      :bordered="false"
      toggle="true"
      :style="hide ? 'display: none' : ''"
    >
      <!-- Container for plugin name and URL text. -->
      <div class="textContainerInput">
        <h3 style="text-align: center">
          {{ pluginName }}
        </h3>
        <a-input
          v-model:value="displayNameInput"
          :status="displayNameStatusRef"
          class="inputField"
          @input="updatePluginData"
        />
        <a-input
          v-model:value="urlInput"
          :status="urlStatusRef"
          class="inputField"
          @input="updatePluginData"
        />
      </div>
      <DeleteOutlined class="circleBackground" @click="hidePlugin" />
    </a-card>
  </template>

  <template v-else>
    <!-- Define the card component, styled as a clickable link. -->
    <a
      :href="
        props.url.startsWith('http://') || props.url.startsWith('https://')
          ? props.url
          : 'https://' + props.url
      "
      target="_blank"
    >
      <a-card
        class="card"
        :loading="toggleSkeleton"
        :bordered="false"
        toggle="true"
        :body-style="{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: '15px',
        }"
      >
        <!-- Display the favicon image. -->
        <a-avatar
          v-if="showFavicon"
          shape="square"
          :src="faviconUrl"
          class="avatar"
        />
        <!-- Container for plugin name and URL text. -->
        <div class="textContainer">
          <h3>{{ pluginName }}</h3>
          <p>{{ displayName }}</p>
        </div>
      </a-card>
    </a>
  </template>
</template>

<style scoped lang="scss">
  // Import manrope font family.
  @font-face {
    font-family: 'Manrope';
    src: url('/fonts/manrope/Manrope-VariableFont_wght.woff2') format('woff');
  }

  // Style for the card container.

  .circleBackground {
    padding: 3.5%;
    border-radius: 100%;
    position: absolute;
    top: -3%;
    right: -3%;
    box-shadow: v-bind('token.boxShadowSecondary');
    color: white;
    background-color: color-mix(in srgb, #6d6e6f, #ff002e 60%) !important;
    &:hover {
      transition: 0.1s ease-in-out;
      cursor: pointer;
      transform: scale(1.1);
    }
  }

  .cardNoHover {
    width: max-content;
    min-width: 200px;
    max-width: 300px;
    box-shadow: v-bind('token.boxShadowSecondary');
    display: flex;
    background-color: v-bind('token.colorBgElevated');
  }

  .card {
    width: max-content;
    max-width: 300px;

    box-shadow: v-bind('token.boxShadowSecondary');
    display: flex;
    flex-direction: column;
    transition: 0.1s ease-in-out;

    background-color: v-bind('token.colorBgElevated');

    &:hover {
      cursor: pointer;
      transform: scale(1.01);
    }
  }

  .textContainerInput {
    font-family: Manrope, serif;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 10px;
    white-space: nowrap;
    overflow: hidden;

    & > * {
      margin: 5px 0 5px 0;
    }

    & p {
      color: #6d6e6f;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  // Style for the text container.
  .textContainer {
    font-family: Manrope, serif;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 10px;
    white-space: nowrap;
    overflow: hidden;

    & > * {
      margin: 0;
    }

    & p {
      color: #6d6e6f;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  // Style for the avatar image.
  .avatar {
    margin: 10px;
    width: 40px;
    height: auto;
    aspect-ratio: 1 / 1;
    object-fit: cover;
  }
</style>
