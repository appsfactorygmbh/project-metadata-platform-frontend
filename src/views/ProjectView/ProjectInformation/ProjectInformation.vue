<script lang="ts" setup>
  import { computed, inject, onMounted, ref, toRaw } from 'vue';
  import {
    localLogStoreSymbol,
    projectEditStoreSymbol,
    projectRoutingSymbol,
  } from '@/store/injectionSymbols';
  import { storeToRefs } from 'pinia';
  import type {
    DetailedProjectModel,
    UpdateProjectModel,
  } from '@/models/Project';
  import type { ComputedRef } from 'vue';
  import {
    DeleteOutlined,
    EditOutlined,
    InboxOutlined,
    UndoOutlined,
  } from '@ant-design/icons-vue';
  import { useEditing } from '@/utils/hooks/useEditing';
  import { usePluginStore, useProjectStore, useTeamStore } from '@/store';
  import type { EditProjectModel } from '@/models/Project/EditProjectModel';
  import ConfirmAction from '@/components/Modal/ConfirmAction.vue';
  import IconButton from '@/components/Button/IconButton.vue';
  import router from '@/router';
  import _ from 'lodash';
  import {
    EditableTextField,
    ProjectInformationInputField,
    ProjectInformationSearchSelectField,
  } from '@/components/EditableTextField';
  import { useThemeToken } from '@/utils/hooks';
  import { CompanyState, SecurityLevel } from '@/api/generated';

  const localLogStore = inject(localLogStoreSymbol);
  const projectStore = useProjectStore();
  const projectEditStore = inject(projectEditStoreSymbol)!;
  const pluginStore = usePluginStore();
  const teamStore = useTeamStore();
  const projectRouting = inject(projectRoutingSymbol)!;
  const token = useThemeToken();

  const editingClass = computed(() => ({
    'editing-mode': isEditing.value,
  }));

  const nonEditingClass = computed(() => ({
    'non-editing-mode': !isEditing.value,
  }));

  const { getIsLoadingProject } = storeToRefs(projectStore);
  const { getIsLoading } = storeToRefs(projectStore);
  const isLoading = computed(
    () => getIsLoadingProject.value || getIsLoading.value,
  );

  const { isEditing, stopEditing, startEditing } = useEditing();

  onMounted(async () => {
    const project = projectStore.getProject;
    teamStore.fetchAll();
    if (project) addData(project);

    const data: ComputedRef<DetailedProjectModel | null> = computed(
      () => projectStore.getProject,
    );

    watch(
      () => data.value,
      (newProject, oldProject) => {
        if (!newProject) return;
        if (!_.isEqual(newProject, oldProject)) {
          addData(toRaw(newProject));
        }
      },
    );
  });

  // set watcher for isEditing. if isEditing is false reset the input status fields
  watch(
    () => isEditing.value,
    (newVal) => {
      if (!newVal) {
        projectEditStore.resetPluginChanges();
        BUInputStatus.value = '';
        teamNumberInputStatus.value = '';
        PtlInputStatus.value = '';
        clientNameInputStatus.value = '';
        offerIdInputStatus.value = '';
        companyInputStatus.value = '';
        companyStateInputState.value = '';
        ismsLevelInputState.value = '';
        teamNameInputStatus.value = '';
        teamNameInput.value = '';
        addData(projectStore.getProject!);
      }
    },
  );

  const toggleEditingMode = async () => {
    if (isEditing.value) {
      await stopEditing();
    } else {
      await startEditing();
    }
  };

  const projectData = {
    id: ref<number>(0),
    slug: ref<string>(''),
    projectName: ref<string>(''),
    businessUnit: ref<string>(''),
    teamId: ref<number | undefined>(undefined),
    teamName: ref<string>(''),
    ptl: ref<string>(''),
    clientName: ref<string>(''),
    offerId: ref<string>(''),
    company: ref<DetailedProjectModel['company']>(''),
    companyState: ref<DetailedProjectModel['companyState']>('EXTERNAL'), //check if implementation matches with backend
    ismsLevel: ref<DetailedProjectModel['ismsLevel']>('NORMAL'),
    isArchived: ref<boolean>(false),
  };

  type Status = '' | 'error' | 'warning' | undefined;

  const BUInputStatus = ref<Status>('');
  const teamNameInputStatus = ref<Status>('');
  const teamNumberInputStatus = ref<Status>('');
  const PtlInputStatus = ref<Status>('');
  const clientNameInputStatus = ref<Status>('');
  const offerIdInputStatus = ref<Status>('');
  const companyInputStatus = ref<Status>('');
  const companyStateInputState = ref<Status>('');
  const ismsLevelInputState = ref<Status>('');

  const clientNameInput = ref(projectData.clientName);
  const teamNameInput = ref(projectData.teamName);
  const offerIdInput = ref(projectData.offerId);
  const companyInput = ref(projectData.company);
  const companyStateInput = ref(projectData.companyState);
  const ismsLevelInput = ref(projectData.ismsLevel);

  type BaseInputField<T = string | number | undefined | null> = {
    label: string;
    name: string;
    value: Ref<T>;
    status: Ref<Status>;
    requiredValue: boolean;
    displayValue?: (value: T) => string | number | boolean | undefined;
  };

  type InputField<T = string | number> = BaseInputField<T> &
    (
      | {
          options?: string[] | (keyof T)[];
          getValue?: (value: string) => T;
          inputType: 'select';
        }
      | {
          inputType?: 'text';
        }
    );

  const requieredTextFields = ref<InputField[]>([
    {
      label: 'Client\xa0Name',
      name: 'clientName',
      value: clientNameInput,
      status: clientNameInputStatus,
      requiredValue: true,
    },
    {
      label: 'Offer\xa0ID',
      name: 'offerId',
      value: offerIdInput,
      status: offerIdInputStatus,
      requiredValue: false,
    },
    {
      label: 'Company',
      name: 'company',
      value: companyInput,
      status: companyInputStatus,
      requiredValue: true,
    },
    {
      label: 'Company\xa0State',
      name: 'companyState',
      value: companyStateInput,
      status: companyStateInputState,
      options: Object.keys(CompanyState) as (keyof typeof CompanyState)[],
      displayValue: (value) =>
        Object.keys(CompanyState).find(
          (key) => CompanyState[key as keyof typeof CompanyState] === value,
        ),
      getValue: (value) => CompanyState[value as keyof typeof CompanyState],
      inputType: 'select',
      requiredValue: true,
    },
    {
      label: 'ISMS\xa0Level',
      name: 'ismsLevel',
      value: ismsLevelInput,
      status: ismsLevelInputState,
      options: Object.keys(SecurityLevel) as (keyof typeof SecurityLevel)[],
      displayValue: (value) =>
        Object.keys(SecurityLevel).find(
          (key) => SecurityLevel[key as keyof typeof SecurityLevel] === value,
        ),
      getValue: (value) => SecurityLevel[value as keyof typeof SecurityLevel],
      inputType: 'select',
      requiredValue: true,
    },
  ]);

  // Function to update the project information
  function updateProjectInformation(): void {
    const mappedTeamId = teamStore.getIdToName(teamNameInput.value);
    const updatedProject: EditProjectModel = {
      projectName: projectData.projectName.value,
      clientName: clientNameInput.value,
      offerId: offerIdInput.value,
      company: companyInput.value,
      companyState: companyStateInput.value,
      ismsLevel: ismsLevelInput.value,
      teamId: mappedTeamId,
    };
    projectEditStore.updateProjectInformationChanges(updatedProject);
  }

  //Function to load the data from projectViewService to projectView
  function addData(loadedData: DetailedProjectModel) {
    if (projectStore.getProject)
      projectEditStore.setProjectInformation(projectStore.getProject);
    projectData.id.value = loadedData.id;
    projectData.slug.value = loadedData.slug;
    projectData.businessUnit.value =
      loadedData.team == undefined ? '' : loadedData.team.businessUnit;
    projectData.teamName.value =
      loadedData.team == undefined ? '' : loadedData.team.teamName;
    projectData.ptl.value =
      loadedData.team?.ptl == undefined ? '' : loadedData.team.ptl;
    projectData.projectName.value = loadedData.projectName;
    projectData.clientName.value = loadedData.clientName;
    projectData.offerId.value = loadedData.offerId ?? '';
    projectData.company.value = loadedData.company;
    projectData.companyState.value = loadedData.companyState;
    projectData.ismsLevel.value = loadedData.ismsLevel;
  }

  const isArchiveModalOpen = ref(false);
  const isDeleteModalOpen = ref(false);
  const isModalOpen = ref(false);

  const handleArchive = () => {
    isArchiveModalOpen.value = true;
  };

  const handleDelete = async () => {
    isDeleteModalOpen.value = true;
  };

  const confirmDelete = async () => {
    const project = projectStore.getProject;

    if (!project?.id) {
      isDeleteModalOpen.value = false;
      return;
    }

    try {
      await projectStore.delete(project.id);
    } catch (error) {
      console.error('Error deleting project:', error);
    } finally {
      isDeleteModalOpen.value = false;
      const newProjectId =
        getNextActiveProjectId(project.id) === project.id
          ? getNextArchivedProjectId()!
          : getNextActiveProjectId(project.id);
      if (newProjectId === undefined) {
        await router.push('/');
      } else {
        projectRouting.setProjectId(newProjectId);
      }
    }
    return;
  };

  const getNextArchivedProjectId = (): number | undefined => {
    const projects = projectStore.getProjects;
    const nextProject = projects.find((project) => project.isArchived);
    if (!nextProject) return undefined;
    return nextProject.id;
  };

  const getNextActiveProjectId = (currentProjectId: number): number => {
    const projects = projectStore.getProjects;
    const nextProject = projects.find((project) => !project.isArchived);
    if (!nextProject) return currentProjectId;
    return nextProject.id;
  };

  const confirmArchive = async () => {
    const projectID = projectStore?.getProject?.id;
    const projectData = projectStore?.getProject as UpdateProjectModel;
    projectData.pluginList = pluginStore?.getPlugins;

    if (projectID) {
      try {
        await projectStore.archive(projectID);
      } finally {
        isArchiveModalOpen.value = false;
        isModalOpen.value = false;
        await localLogStore?.fetch(projectID);
        const newProjectId = getNextActiveProjectId(projectID);
        projectRouting.setProjectId(newProjectId);
      }
    }
  };

  const reactivateProject = async () => {
    const currentProject = projectStore.getProject! as UpdateProjectModel;
    const projectId = projectStore.getProject?.id;
    currentProject.pluginList = pluginStore.getPlugins;

    await projectStore.unarchive(projectId!);
    await localLogStore?.fetch(projectId!);
  };
</script>

<template>
  <div class="pane">
    <div v-if="projectData.id.value" class="main">
      <!-- create box for the project name -->
      <div class="projectNameContainer">
        <!-- Reactivate Button -->
        <IconButton
          v-if="projectStore.getProject?.isArchived"
          tooltip-position="left"
          tooltip="Click here to reactivate"
          @click="reactivateProject"
        >
          <template #icon>
            <UndoOutlined class="icon" />
          </template>
        </IconButton>

        <!-- Delete Button -->
        <IconButton
          v-if="projectStore.getProject?.isArchived"
          tooltip-position="right"
          tooltip="Click here to delete the project"
          @click="handleDelete"
        >
          <template #icon>
            <DeleteOutlined class="icon" />
          </template>
        </IconButton>

        <ConfirmAction
          :is-open="isDeleteModalOpen"
          title="Delete Project"
          message="Are you sure you want to delete this project permanently?"
          @confirm="confirmDelete"
          @cancel="isDeleteModalOpen = false"
          @update:is-open="(value) => (isDeleteModalOpen = value)"
        />

        <!-- Archive Button -->
        <IconButton
          v-if="!projectStore.getProject?.isArchived && !isEditing"
          tooltip-position="right"
          tooltip="Click here to archive the project"
          @click="handleArchive"
        >
          <template #icon>
            <InboxOutlined class="icon" />
          </template>
        </IconButton>

        <!-- Edit Button -->
        <IconButton
          v-if="!projectStore.getProject?.isArchived && !isEditing"
          tooltip-position="left"
          tooltip="Click here to activate Edit-View"
          @click="toggleEditingMode"
        >
          <template #icon>
            <EditOutlined class="icon" />
          </template>
        </IconButton>

        <ConfirmAction
          :is-open="isArchiveModalOpen"
          title="Archive Project"
          message="Are you sure you want to archive this project?"
          @confirm="confirmArchive"
          @cancel="isArchiveModalOpen = false"
          @update:is-open="(value) => (isArchiveModalOpen = value)"
        />
        <h1 v-if="!isLoading" class="projectName">
          {{ projectData.projectName.value }}
        </h1>
        <a-skeleton v-else active :paragraph="false" style="max-width: 20em" />
      </div>

      <!-- create box for project description (BU, Team Nr, Department, Client Name) -->
      <a-flex
        class="projectInformationBox"
        :body-style="{
          height: 'fit-content',
        }"
      >
        <a-divider class="SectionSeperator" orientation="left"
          >General Information</a-divider
        >
        <EditableTextField
          v-if="!isEditing"
          class="infoCard non-editing-mode"
          :value="projectData.slug.value"
          :is-loading="isLoading"
          :label="'Project\xa0Slug'"
          :has-edit-keys="false"
        />

        <EditableTextField
          v-for="field in requieredTextFields"
          :key="field.name"
          class="infoCard"
          :class="[editingClass, nonEditingClass]"
          :value="field.value"
          :is-loading="isLoading"
          :label="field.label"
          :has-edit-keys="false"
          :display-value="field.displayValue"
        >
          <ProjectInformationSearchSelectField
            v-if="field.inputType === 'select'"
            class="editField"
            :column-name="field.name"
            :input-value="field.value"
            :input-status="field.status"
            :edit-store="projectEditStore"
            :options="field.options!"
            :get-value="field.getValue!"
            :display-value="field.displayValue!"
            :is-editing="true"
            @updated="
              (newValue) => {
                field.value = newValue;
                updateProjectInformation();
              }
            "
            @error="field.status = 'error'"
            @success="field.status = ''"
          />
          <ProjectInformationInputField
            v-else
            class="editField"
            :column-name="field.name"
            :input-value="field.value"
            :input-status="field.status"
            :edit-store="projectEditStore"
            :required-value="field.requiredValue"
            @updated="
              (newValue) => {
                field.value = newValue;
                updateProjectInformation();
              }
            "
            @error="field.status = 'error'"
            @success="field.status = ''"
          />
        </EditableTextField>

        <!-- team specific inputs -->
        <a-divider orientation="left" class="SectionSeperator">Team</a-divider>
        <EditableTextField
          v-if="isEditing"
          :key="'Team'"
          class="infoCard"
          :class="[editingClass, nonEditingClass]"
          :value="teamNameInput"
          :is-loading="isLoading"
          :label="'Team\xa0Select'"
          :has-edit-keys="false"
          :display-value="() => 'Team\xa0Select'"
          ><ProjectInformationSearchSelectField
            class="editField"
            :column-name="'TeamName'"
            :input-value="teamNameInput"
            :input-status="'error'"
            :options="teamStore.getTeamNames"
            :edit-store="projectEditStore"
            :is-editing="isEditing"
            @updated="
              (newValue) => {
                teamNameInput = newValue;
                updateProjectInformation();
              }
            "
        /></EditableTextField>

        <EditableTextField
          v-if="!isEditing"
          class="infoCard non-editing-mode teamNameField"
          :value="projectData.teamName.value"
          :is-loading="isLoading"
          :label="'Team\xa0Name'"
          :has-edit-keys="false"
        />

        <EditableTextField
          v-if="!isEditing"
          class="infoCard non-editing-mode buField"
          :value="projectData.businessUnit.value"
          :is-loading="isLoading"
          :label="'Business\xa0Unit'"
          :has-edit-keys="false"
        />

        <EditableTextField
          v-if="!isEditing"
          class="infoCard non-editing-mode ptlField"
          :value="projectData.ptl.value"
          :is-loading="isLoading"
          :label="'PTL'"
          :has-edit-keys="false"
        />
      </a-flex>
    </div>
    <a-flex
      v-else
      justify="center"
      align="center"
      class="emptyProjects"
      :loading="isLoading"
    >
      <a-spin v-if="isLoading" />
      <a-empty v-else description="No project selected." />
    </a-flex>
  </div>
</template>

<style scoped lang="scss">
  /* Style for the seperator */
  .SectionSeperator {
    font-size: large;
  }

  /* Style for the middle section */
  .main {
    width: 100%;
    max-height: 80vh;
    height: max-content;
    padding: 0 3.5em 0 3em;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .emptyProjects {
    height: 100vh;
    width: 100vh;
    margin: 0 auto;
    color: v-bind('token.colorText');
  }

  /* Style for the right panel */
  .pane {
    display: flex;
    flex-direction: row;
  }

  /* Style for the Project name input box */
  .projectNameInput {
    font-size: 2.8em;
    width: 80%;
    height: 2.8em;
    text-align: center;
    border: none;
    border-bottom: 2px solid #a5a4a4;
    color: black;
    background-color: rgb(250, 250, 250);
  }

  /* Style for the Project title box */
  .projectNameContainer {
    width: 100%;
    height: 5%;
    margin: 10px;
    border-radius: 10px;
    text-align: center;
    align-items: center;
    flex-direction: row;
    display: flex;
    justify-content: center;
  }

  .projectName {
    font-size: 2.5em;
    font-weight: bold;
    color: v-bind('token.colorText');
    margin: 10px;
    max-width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .projectInformationBox {
    width: 100%;
    height: auto;
    justify-content: start;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 0.5em 0;
    border-radius: 10px;
    container-type: inline-size;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: v-bind('token.colorBgElevated') !important;
  }

  @container (max-width: 53vw) {
    .infoCard.editing-mode {
      width: 100% !important;
    }
  }

  .infoCard.editing-mode {
    margin: 0.2em 0;
  }

  @container (max-width: 42vw) {
    .infoCard.non-editing-mode {
      width: 24vw !important;
      margin: 0 auto;
      padding: 0 0.5em;
    }
  }

  .infoCard {
    border: none;
    width: 50%;
    display: table;
    padding: 0 0 0 1em;
    white-space: nowrap;
    overflow: hidden;
    max-width: 100%;
    background-color: v-bind('token.colorBgElevated ');
  }

  .editField {
    margin: 0 2em 0 1em;
  }

  .button {
    margin-bottom: 10px;
    height: 40px;
    width: 40px;
    border: none;
  }

  .icon {
    color: v-bind('token.colorText');
    font-size: 1.5em;
  }

  .label {
    font-size: 1.4em;
    font-weight: bold;
    margin: 0;
  }

  .text {
    font-size: 1.4em;
    margin: 0 auto 0 0.5em;
    white-space: nowrap;
  }
</style>
