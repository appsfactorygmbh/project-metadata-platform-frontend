<script lang="ts" setup>
  import { type FormSubmitType, useFormStore } from '@/components/Form';
  import { AuthLayout, LoginForm } from '.';
  import { computed } from 'vue';
  import { useToken } from 'ant-design-vue/es/theme/internal';
  import useBreakpoint from 'ant-design-vue/es/_util/hooks/useBreakpoint';
  import { useAuth } from 'vue-auth3';
  import axios from 'axios';
  import { useRoute } from 'vue-router';

  const auth = useAuth();
  const router = useRouter();
  const route = useRoute();
  const formStore = useFormStore('loginForm');

  const feedbackMessage = ref('');

  const onSubmit: FormSubmitType = (fields) => {
    auth
      .login({
        data: {
          email: fields.email,
          password: fields.password,
        },
        staySignedIn: fields.remember,
      })
      .then((response) => {
        callback();
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
        if (axios.isAxiosError(error))
          feedbackMessage.value = error.response?.data || 'An error occurred';
        formStore.updateField('password', '');
      });
  };

  formStore.setOnSubmit(onSubmit);

  const token = useToken()[1];
  const screens = useBreakpoint();

  const refreshToken = computed(() => auth.token()?.split('|')[1]);

  const callback = () => {
    const redirect = (route.query.redirect as string) ?? '/';
    router.push(redirect);
  };

  onMounted(() => {
    auth?.load().then(() => {
      const authCheck = auth.check();
      if (authCheck) return callback();
      auth.refresh({ data: { refreshToken: refreshToken.value } }).then(() => {
        return callback();
      });
    });
  });

  const styles = computed(() => ({
    header: {
      marginBottom: `${token.value.marginXL}px`,
    },
    text: {
      color: token.value.colorTextSecondary,
    },
    title: {
      fontSize: screens.value.md
        ? token.value.fontSizeHeading2
        : token.value.fontSizeHeading3,
    },
  }));
</script>

<template>
  <AuthLayout>
    <div :style="styles.header">
      <a-typography-title :style="styles.title"> Login </a-typography-title>
      <a-typography-text :style="styles.text">
        Welcome back! Please enter your credentials to continue.
      </a-typography-text>
    </div>
    <LoginForm :form-store="formStore" :feedback-message="feedbackMessage" />
  </AuthLayout>
</template>
