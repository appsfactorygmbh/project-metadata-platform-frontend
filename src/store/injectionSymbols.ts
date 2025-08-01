import { type ProjectStore } from './ProjectStore.ts';
import { type PluginStore } from './PluginStore';
import { type ProjectEditStore } from './ProjectEditStore/ProjectEditStore.ts';
import { type UserStore } from './UserStore';
import { useLogsStore } from './LogsStore';
import { useProjectRouting } from '@/utils/hooks/useProjectRouting.ts';
import { useLocalLogStore } from './LocalLogStore';
import type { InjectionKey } from 'vue';
import type { GlobalPluginStore } from './GlobalPluginStore.ts';
import type { AuthStore } from './AuthStore.ts';
import { useUserRouting } from '@/utils/hooks/useUserRouting.ts';
import type { TeamStore } from './TeamStore.ts';
import type { useTeamRouting } from '@/utils/hooks/useTeamRouting.ts';

const projectStoreSymbol = Symbol() as InjectionKey<ProjectStore>;

const pluginStoreSymbol = Symbol() as InjectionKey<PluginStore>;

const projectEditStoreSymbol = Symbol() as InjectionKey<ProjectEditStore>;

const userStoreSymbol = Symbol() as InjectionKey<UserStore>;

const globalPluginStoreSymbol = Symbol() as InjectionKey<GlobalPluginStore>;

const teamStoreSymbol = Symbol() as InjectionKey<TeamStore>;

const authStoreSymbol = Symbol() as InjectionKey<AuthStore>;

const logsStoreSymbol = Symbol() as InjectionKey<
  ReturnType<typeof useLogsStore>
>;

const projectRoutingSymbol = Symbol() as InjectionKey<
  ReturnType<typeof useProjectRouting>
>;

const localLogStoreSymbol = Symbol() as InjectionKey<
  ReturnType<typeof useLocalLogStore>
>;

const userRoutingSymbol = Symbol() as InjectionKey<
  ReturnType<typeof useUserRouting>
>;

const teamRoutingSymbol = Symbol() as InjectionKey<
  ReturnType<typeof useTeamRouting>
>;

export {
  projectStoreSymbol,
  pluginStoreSymbol,
  globalPluginStoreSymbol,
  projectEditStoreSymbol,
  userStoreSymbol,
  authStoreSymbol,
  logsStoreSymbol,
  projectRoutingSymbol,
  localLogStoreSymbol,
  userRoutingSymbol,
  teamStoreSymbol,
  teamRoutingSymbol,
};
