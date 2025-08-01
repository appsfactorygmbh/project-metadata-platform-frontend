<script setup lang="ts">
  import { type FormStore, type FormSubmitType } from '@/components/Form';
  import { notification } from 'ant-design-vue';
  import { projectEditStoreSymbol } from '@/store/injectionSymbols';
  import { inject, onBeforeMount, reactive, ref, toRaw } from 'vue';
  import type { SelectProps } from 'ant-design-vue';
  import type { PluginEditModel, PluginModel } from '@/models/Plugin';
  import type { LabeledValue, SelectValue } from 'ant-design-vue/lib/select';
  import type { RulesObject } from '@/components/Form/types';
  import type { AddPluginFormData } from './AddPluginFormData.ts';
  import { useGlobalPluginStore } from '@/store/GlobalPluginStore.ts';
  import { usePluginStore } from '@/store';
  import { isUniqueUrl } from '@/utils/form/userValidation.ts';
  import type { GlobalPluginModel } from '@/models/GlobalPlugin';

  const { formStore, initialValues } = defineProps<{
    formStore: FormStore;
    initialValues: AddPluginFormData;
  }>();

  const globalPluginStore = useGlobalPluginStore();
  const projectEditStore = inject(projectEditStoreSymbol);
  const pluginStore = usePluginStore();
  const options = ref<SelectProps['options']>([]);
  const emit = defineEmits(['addedPlugin']);

  onBeforeMount(async () => {
    await globalPluginStore?.fetchAll();
    options.value = toRaw(globalPluginStore?.getGlobalPlugins)
      ?.filter((plugin) => !plugin.isArchived)
      .map((plugin: GlobalPluginModel) => {
        return {
          value: plugin.pluginName,
          label: plugin.pluginName,
        };
      });
  });

  const [notificationApi, contextHolder] = notification.useNotification();

  function findMatchingGlobalPlugin(url: string): string | null {
    try {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname
        .split('.')
        .filter((part) => part !== 'www')
        .join('.');

      const pluginNames = new Map(
        globalPluginStore?.getGlobalPlugins.map((plugin) => {
          const pluginUrl = plugin.baseUrl
            ? plugin.baseUrl
                .toLowerCase()
                .split(/[./]/)
                .filter(
                  (part) => part !== 'www' && !part.startsWith('http') && part,
                )
                .join('.')
            : '';
          return [pluginUrl, plugin.pluginName];
        }),
      );

      if (pluginNames.has(hostname)) {
        const result = pluginNames.get(hostname) ?? null;
        return result;
      } else return null;
    } catch (error) {
      console.error('Invalid URL provided:', error);
      return null;
    }
  }

  const onSubmit: FormSubmitType = (fields) => {
    try {
      const pluginNumber: number | undefined =
        globalPluginStore?.getGlobalPlugins.find(
          (plugin) => plugin.pluginName === toRaw(fields).globalPlugin,
        )?.id;
      if (pluginNumber === undefined) {
        return;
      }
      const pluginDef: PluginModel = {
        id: pluginNumber,
        pluginName: toRaw(fields).globalPlugin,
        displayName: toRaw(fields).pluginName,
        url: toRaw(fields).pluginUrl,
      };
      addPlugin(pluginDef);
      emit('addedPlugin');
    } catch (error) {
      notificationApi.error({
        message: 'An error occurred. The plugin could not be created',
      });
      console.error('error while creating a new project plugin', error);
    }
  };

  const addPlugin = (pluginDef: PluginModel) => {
    const index = projectEditStore?.initialAdd(pluginDef);

    if (index !== undefined) {
      const newPlugin: PluginEditModel = {
        ...pluginDef,
        editKey: index,
        isDeleted: false,
      };
      projectEditStore?.addNewPlugin(newPlugin);
    }
  };

  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 4 },
    },
  };

  const dynamicValidateForm = reactive<AddPluginFormData>(initialValues);

  const rulesRef = reactive<RulesObject<AddPluginFormData>>({
    pluginName: [
      {
        required: true,
        message: 'Please insert the plugin name.',
        trigger: 'change',
        type: 'string',
      },
    ],
    pluginUrl: [
      {
        required: true,
        message: 'Please insert a unique url.',
        validator: isUniqueUrl,
        trigger: 'change',
        type: 'string',
      },
    ],
    globalPlugin: [
      {
        required: true,
        message: 'Please select a global plugin.',
        trigger: 'change',
        type: 'string',
      },
    ],
    inputsDisabled: [
      {
        required: false,
      },
    ],
  });

  const handleUrlChange = (url: string | undefined) => {
    if (url && dynamicValidateForm.globalPlugin === '') {
      const matchingPluginName = findMatchingGlobalPlugin(url);
      if (matchingPluginName) {
        dynamicValidateForm.globalPlugin = matchingPluginName;
        dynamicValidateForm.inputsDisabled = false;
        handleChange(matchingPluginName);
      } else dynamicValidateForm.globalPlugin = '';
    }
  };

  const isGlobalPluginAlreadyUsed = (globalPlugin: string) => {
    // All plugin names already use in the project
    const projectPluginNames = pluginStore.getPlugins.map(
      (plugin: PluginModel) => plugin.pluginName,
    );

    // All currently new added plugin names
    const addedPluginNames = (projectEditStore?.getAddedPlugins ?? []).map(
      (plugin: PluginEditModel) => plugin.pluginName,
    );

    // returns true if the global plugin is already used in the project
    return [...projectPluginNames, ...addedPluginNames].some(
      (pluginName: string) => pluginName === globalPlugin,
    );
  };

  const handleChange = (value: SelectValue) => {
    dynamicValidateForm.inputsDisabled = false;

    const globalPlugin = value as string;

    //sets the plugin name to the global plugin name if it is not already used
    if (!isGlobalPluginAlreadyUsed(globalPlugin)) {
      dynamicValidateForm.pluginName = globalPlugin;
    } else {
      dynamicValidateForm.pluginName = '';
    }
  };

  const filterOption = (input: string, option: LabeledValue) => {
    return (
      option.value
        .valueOf()
        .toString()
        .toLowerCase()
        .indexOf(input.toLowerCase()) >= 0
    );
  };

  formStore.setOnSubmit(onSubmit);
  formStore.setModel(dynamicValidateForm);
  formStore.setRules(rulesRef);

  const formRef = ref();
</script>

<template>
  <a-form
    ref="formRef"
    :model="dynamicValidateForm"
    v-bind="formItemLayoutWithOutLabel"
  >
    <a-form-item
      name="globalPlugin"
      :rules="[{ required: true, whitespace: true }]"
      class="column"
      :no-style="true"
      :whitespace="true"
    >
      <a-select
        id="inputAddPluginPluginSelect"
        v-model:value="dynamicValidateForm.globalPlugin"
        class="inputField"
        show-search
        placeholder="Select a global Plugin"
        :options="options"
        :filter-option="filterOption"
        @change="handleChange"
      />
    </a-form-item>
    <a-form-item
      name="pluginName"
      class="column"
      :no-style="true"
      :whitespace="true"
      :rules="rulesRef.pluginName"
    >
      <a-input
        id="inputAddPluginPluginName"
        v-model:value="dynamicValidateForm.pluginName"
        class="inputField"
        placeholder="Plugin Name"
        :disabled="dynamicValidateForm.inputsDisabled"
        :rules="rulesRef.pluginName"
      />
    </a-form-item>
    <a-form-item
      name="pluginUrl"
      class="column"
      :no-style="true"
      :whitespace="true"
      :rules="rulesRef.pluginUrl"
    >
      <a-input
        id="inputAddPluginPluginUrl"
        v-model:value="dynamicValidateForm.pluginUrl"
        :rules="rulesRef.pluginUrl"
        class="inputField"
        placeholder="Plugin URL"
        @change="(e) => handleUrlChange(e.target.value)"
      />
    </a-form-item>
  </a-form>
  <contextHolder />
</template>
