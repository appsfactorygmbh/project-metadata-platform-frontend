<script lang="ts" setup>
  import { ProjectPlugins } from './ProjectPlugins';
  import { LocalLogView } from './LocalLogView';
  import { ProjectInformation } from './ProjectInformation';
  import type { UpdateProjectModel } from '@/models/Project';
  import ProjectEditButtons from '@/components/ProjectEditButtons/ProjectEditButtons.vue';
  import { useEditing } from '@/utils/hooks/useEditing';
  import {
    projectEditStoreSymbol,
    localLogStoreSymbol,
  } from '@/store/injectionSymbols';
  import { inject, ref, watch } from 'vue';
  import { message } from 'ant-design-vue';
  import { usePluginStore, useProjectStore } from '@/store';
  import type { PluginModel } from '@/models/Plugin';
  import _ from 'lodash';
  import type { FloatButtonModel } from '@/components/Button';
  import { AppstoreAddOutlined } from '@ant-design/icons-vue';
  import { AddPluginView } from '@/views/ProjectView/ProjectPlugins/AddPlugin';

  const localLogStore = inject(localLogStoreSymbol);
  const projectEditStore = inject(projectEditStoreSymbol);
  const pluginStore = usePluginStore();
  const projectStore = useProjectStore();
  const rerenderPlugins = ref(1);
  const isModalOpen = ref(false);
  const openModal = () => {
    isModalOpen.value = true;
  };
  const { isEditing, stopEditing } = useEditing();

  const reloadEditStore = () => {
    if (pluginStore) {
      pluginStore.getPlugins.forEach((plugin) => {
        projectEditStore?.initialAdd(plugin);
      });
    }
  };

  watch(
    () => isEditing,
    (newVal) => {
      if (newVal) {
        projectEditStore?.resetPluginChanges();
      }
    },
  );

  const cancelEdit = () => {
    projectEditStore?.resetPluginChanges();
    reloadEditStore();
    stopEditing();
    rerenderPlugins.value++;
  };

  const isEmpty = ref(false);
  const setIsEmpty = (value: boolean) => {
    isEmpty.value = value;
  };

  watch(
    () => projectStore.getProjects,
    () => {
      if (projectStore.getProjects.length === 0) {
        setIsEmpty(true);
      } else {
        setIsEmpty(false);
      }
    },
  );

  const isAdding = computed(() => projectStore.getIsLoadingUpdate);

  // Watcher to see if fetch was successful
  watch(isAdding, (newVal) => {
    if (!newVal) {
      if (projectStore.getUpdatedSuccessfully) {
        projectEditStore?.resetPluginChanges();
        message.success('Project updated successfully.', 2);
        projectStore.fetch(projectStore.getProject?.id ?? 0);
        stopEditing();
      } else {
        message.error('Could not update Project.', 5);
      }
    }
  });

  const saveEdit = async () => {
    // Check for empty fields and duplicates
    projectEditStore?.checkForConflicts();

    // If error occurred, display message and return
    if (!projectEditStore?.getCanBeAdded) {
      message.error(
        'Could not update Project. There are empty fields or duplicated plugins.',
        5,
      );
      return;
    }

    if (!projectStore.getProject) {
      console.error(
        'Error when trying to get ProjectInformation. getProject is undefined',
      );
      return;
    }

    const updateProjectInformation =
      projectEditStore.getProjectInformationChanges;

    // Puts the unarchived plugins and the archived plugins together
    const updatedPluginList = computed(() => {
      const tempPluginList: PluginModel[] = [];
      projectEditStore.getPluginChanges.forEach((plugin) => {
        tempPluginList.push({
          id: plugin.id,
          pluginName: plugin.pluginName,
          displayName: plugin.displayName,
          url: plugin.url,
        });
      });

      const archivedPlugins = _.differenceBy(
        pluginStore.getPlugins,
        pluginStore.getUnarchivedPlugins,
        'id',
      );

      archivedPlugins.forEach((plugin) => {
        tempPluginList.push({
          id: plugin.id,
          pluginName: plugin.pluginName,
          displayName: plugin.displayName,
          url: plugin.url,
        });
      });
      return tempPluginList;
    });

    const updatedProject: UpdateProjectModel = {
      projectName: updateProjectInformation?.projectName,
      teamId: updateProjectInformation?.teamId,
      clientName: updateProjectInformation?.clientName,
      pluginList: updatedPluginList.value,
      isArchived: projectStore.getProject.isArchived,
      offerId: updateProjectInformation?.offerId,
      company: updateProjectInformation?.company,
      companyState: updateProjectInformation?.companyState,
      ismsLevel: updateProjectInformation?.ismsLevel,
    };
    console.log(updatedProject);

    const projectID = computed(() => projectStore.getProject?.id);
    if (projectID.value) {
      await projectStore.update(projectID.value, updatedProject);
      await projectStore.fetchAll();
      await projectStore.fetch(projectID.value);
      await pluginStore.fetchUnarchived(projectID.value);
      await pluginStore.fetch(projectID.value);
      await localLogStore?.fetch(projectID.value);
    }
    closeAddPluginModal();
  };

  // Blur effect
  const isBlurred = ref(false);

  function setBlur(state: boolean) {
    isBlurred.value = state;
  }

  const openAddPluginModal = ref<boolean>(false);

  const syncEditStore = (normalPlugins: PluginModel[]) => {
    if (!normalPlugins?.length) return;
    for (let i = 0; i < normalPlugins.length; i++) {
      projectEditStore?.initialAdd(normalPlugins[i]);
    }
  };

  const handleClickAddPlugin = () => {
    projectEditStore?.resetPluginChanges();
    syncEditStore(pluginStore.getUnarchivedPlugins);
    openAddPluginModal.value = true;
  };

  const closeAddPluginModal = () => {
    openAddPluginModal.value = false;
  };

  const button: FloatButtonModel = {
    name: 'AddPluginButton',
    onClick: () => {
      handleClickAddPlugin();
    },
    type: 'primary',
    icon: AppstoreAddOutlined,
    status: 'activated',
    size: 'large',
    tooltip: 'Click here to add a new plugin',
  };
</script>

<template>
  <div v-if="!isEmpty">
    <ProjectEditButtons v-if="isEditing" @cancel="openModal" @save="saveEdit" />
    <ProjectInformation />
    <ProjectPlugins
      :key="rerenderPlugins"
      class="pluginView"
      @set-blur="setBlur"
    />
    <FloatingButton
      v-if="!isEditing && projectStore.getProject"
      :button="button"
      class="addPlugin"
    />
    <AddPluginView
      v-if="openAddPluginModal"
      :show-modal="openAddPluginModal"
      @added-plugin="async () => await saveEdit()"
    />
    <LocalLogView class="LocalLog" :class="{ blur: isBlurred }" />
    <ConfirmAction
      :is-open="isModalOpen"
      title="Cancel Editing"
      message="Are you sure you want to cancel all changes?"
      @confirm="cancelEdit"
      @cancel="isModalOpen = false"
      @update:is-open="(value) => (isModalOpen = value)"
    />
  </div>
  <a-flex
    v-else
    justify="center"
    align="center"
    style="height: 80vh; color: black"
  >
    <a-empty description="No project found" />
  </a-flex>
</template>

<style scoped>
  .pluginView {
    display: flex;
    justify-content: center;
    padding-top: 1em;
  }
  .LocalLog {
    margin: 2em 3.5em 2em 3em;
  }
  .addPlugin {
    margin-bottom: 60px;
  }
</style>
