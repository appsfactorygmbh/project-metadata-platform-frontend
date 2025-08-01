import { describe, it, expect, vi, beforeEach } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import { defineComponent, computed, toRaw } from 'vue';
import { setActivePinia, createPinia } from 'pinia';
import { usePluginStore, useProjectStore } from '@/store';
import type { PluginModel } from '@/models/Plugin';
import type { DetailedProjectModel } from '@/models/Project';
import {
  pluginStoreSymbol,
  projectStoreSymbol,
} from '@/store/injectionSymbols';
import { ProjectPlugins } from '..';
import router from '@/router';

vi.mock('@/api/generated', async () => {
  const originalModule = await import('@/api/generated');
  return {
    ...originalModule,
    PluginsApi: vi.fn().mockImplementation(() => ({
      pluginsGet: vi.fn(),
    })),
  };
});

// Define a ProjectPlugins component for testing
const ProjectPluginsMock = defineComponent({
  setup() {
    const pluginStore = usePluginStore();
    const plugins = computed(() => toRaw(pluginStore.getPlugins));
    return { plugins };
  },
  template: '<div></div>',
});

describe('ProjectPlugins', () => {
  beforeEach(() => {
    // Set up a new Pinia store instance before each test
    setActivePinia(createPinia());
  });

  it('should compute plugins from the store', async () => {
    const pluginStore = usePluginStore();
    const mockPlugins: PluginModel[] = [
      {
        pluginName: 'testPlugin',
        displayName: 'Test Plugin',
        url: 'http://example.com/',
        id: 1,
      },
    ];

    // Set the store plugins
    pluginStore.setPlugins(mockPlugins);

    // Mount the PluginView component
    const wrapper = shallowMount(ProjectPluginsMock);

    // Access the computed plugins
    const computedPlugins = wrapper.vm.plugins;

    // Check if the computed plugins match the store plugins
    expect(computedPlugins).toEqual(mockPlugins);
  });

  it('should get unarchived plugins when on an active project and all plugins on archived project', async () => {
    const pluginStore = usePluginStore();
    const projectStore = useProjectStore();

    const mockActiveProject: DetailedProjectModel = {
      id: 1,
      projectName: 'Test Project',
      clientName: 'Test Client',
      team: {
        businessUnit: 'Test Business Unit',
        id: 1,
        teamName: '1',
      },
      isArchived: false,
      slug: 'test-project',
      offerId: '1',
      company: 'AppsFactory',
      companyState: 'EXTERNAL',
      ismsLevel: 'HIGH',
    };

    const mockArchivedProject: DetailedProjectModel = {
      id: 2,
      projectName: 'Test Project',
      clientName: 'Test Client',
      team: {
        businessUnit: 'Test Business Unit',
        id: 1,
        teamName: '1',
      },
      isArchived: true,
      slug: 'test-project',
      offerId: '1',
      company: 'AppsFactory',
      companyState: 'EXTERNAL',
      ismsLevel: 'HIGH',
    };

    const unarchivedPluginsSpy = vi
      .spyOn(pluginStore, 'getUnarchivedPlugins', 'get')
      .mockReturnValue([]);
    const pluginsSpy = vi
      .spyOn(pluginStore, 'getPlugins', 'get')
      .mockReturnValue([]);

    // Test for active project
    projectStore.setProject(mockActiveProject);

    shallowMount(ProjectPlugins, {
      global: {
        provide: {
          [pluginStoreSymbol]: pluginStore,
          [projectStoreSymbol]: projectStore,
        },
        plugins: [router],
      },
    });

    expect(unarchivedPluginsSpy).toHaveBeenCalled();

    // Test for archived project
    projectStore.setProject(mockArchivedProject);

    shallowMount(ProjectPlugins, {
      global: {
        provide: {
          [pluginStoreSymbol]: pluginStore,
          [projectStoreSymbol]: projectStore,
        },
        plugins: [router],
      },
    });

    expect(pluginsSpy).toHaveBeenCalled();
  });
});
