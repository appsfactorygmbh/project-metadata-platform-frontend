import { createRouter, createWebHistory } from 'vue-router';
import { SplitView } from '@/views';
import { CreateGlobalPluginView } from '@/views/GlobalPlugins/CreateGlobalPlugin';
import { EditGlobalPluginView } from '@/views/GlobalPlugins/EditGlobalPlugin';
import { ProviderCollection } from './Provider';
import { SettingView } from '@/views/SettingView';
import { GlobalPluginsView } from '@/views/GlobalPlugins';
import ProjectSlugResolver from './Resolver/ProjectSlugResolver.vue';
import NotFoundView from '@/views/Service/NotFoundView.vue';
import { LoginView } from '@/views/Auth';
import ForbiddenView from '@/views/Service/ForbiddenView.vue';
import { UserListView } from '@/views/SettingView/UserManagementView/UserListView';
import { CreateUserView } from '@/views/SettingView/UserManagementView/CreateUser';
import GlobalLogsView from '@/views/SettingView/GlobalLogsView/GlobalLogsView.vue';
import { UserInformationView } from '@/views/SettingView/UserManagementView/UserInformationView';
import { useAuth } from 'vue-auth3';
import { TeamListView } from '@/views/SettingView/TeamManagementView/TeamListView';
import TeamInformationView from '@/views/SettingView/TeamManagementView/TeamInformationView/TeamInformationView.vue';
import CreateTeamView from '@/views/SettingView/TeamManagementView/CreateTeam/CreateTeamView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
      meta: {
        title: 'Project Metadata Platform - Login',
        noAuthRequired: true,
      },
    },
    {
      path: '/',
      name: 'Provider',
      component: ProviderCollection,
      meta: {},
      children: [
        {
          name: 'ProjectNameResolver',
          path: '/',
          component: ProjectSlugResolver,
          children: [
            {
              path: '/',
              name: 'SplitViewDefault',
              component: SplitView,
            },
            {
              path: '/:projectSlug',
              name: 'SplitView',
              component: SplitView,
            },
          ],
        },
        {
          path: '/settings',
          name: 'settings',
          redirect: '/settings/global-plugins',
          component: SettingView,
          meta: { title: 'Project Metadata Platform - Settings' },
          children: [
            {
              path: '/settings/user-management',
              name: 'usersList',
              component: UserListView,
              meta: { title: 'Project Metadata Platform - User Management' },
              children: [
                {
                  path: '/settings/user-management',
                  name: 'usersInformation',
                  component: UserInformationView,
                  meta: {
                    title: 'Project Metadata Platform - User Information',
                  },
                  children: [
                    {
                      path: '/settings/user-management/create',
                      name: 'createUsers',
                      component: CreateUserView,
                      meta: {
                        title: 'Project Metadata Platform - User Creation',
                      },
                    },
                  ],
                },
              ],
            },
            {
              path: '/settings/team-management',
              name: 'teamList',
              component: TeamListView,
              meta: { title: 'Project Metadata Platform - Team Management' },
              children: [
                {
                  path: '/settings/team-management',
                  name: 'teamsInformation',
                  component: TeamInformationView,
                  meta: {
                    title: 'Project Metadata Platform - Team Information',
                  },
                  children: [
                    {
                      path: '/settings/team-management/create',
                      name: 'createTeams',
                      component: CreateTeamView,
                      meta: {
                        title: 'Project Metadata Platform - Team Creation',
                      },
                    },
                  ],
                },
              ],
            },
            {
              path: '/settings/global-plugins',
              name: 'plugins',
              component: GlobalPluginsView,
              meta: { title: 'Project Metadata Platform - Plugins' },
              children: [
                {
                  path: '/settings/global-plugins/create',
                  name: 'CreateGlobalPlugin',
                  component: CreateGlobalPluginView,
                  meta: { title: 'Project Metadata Platform - Create Plugin' },
                },
                {
                  path: '/settings/global-plugins/edit/',
                  name: 'EditGlobalPlugin',
                  component: EditGlobalPluginView,
                  meta: { title: 'Project Metadata Platform - Edit Plugin' },
                },
              ],
            },
            {
              path: '/settings/global-logs',
              name: 'global-logs',
              component: GlobalLogsView,
              meta: { title: 'Project Metadata Platform - Global Logs' },
            },
          ],
        },
      ],
    },
    {
      name: 'NotFoundRedirect',
      path: '/:pathMatch(.*)*',
      redirect: '/404',
    },
    {
      path: '/404',
      name: 'NotFound',
      component: NotFoundView,
      meta: { title: 'Project Metadata Platform - Not Found' },
    },
    {
      path: '/403',
      name: 'Forbidden',
      component: ForbiddenView,
      meta: { title: 'Project Metadata Platform - Forbidden' },
    },
  ],
});

router.beforeEach(async (to, _, next) => {
  const auth = useAuth();

  auth.ready();

  const noAuthRequired = to.meta.noAuthRequired;
  const isAuthenticated = auth.check();

  if (!noAuthRequired && !isAuthenticated) {
    const redirectUrl = to.fullPath; // Get the full path of the route the user tried to access
    next({
      path: '/login',
      query: { redirect: redirectUrl },
    });
  } else {
    next();
  }
});

// Dynamic title changes
if (process.env.NODE_ENV !== 'test') {
  router.afterEach((to) => {
    document.title = (to.meta.title as string) || 'Project Metadata Platform';
  });
}

export default router;
