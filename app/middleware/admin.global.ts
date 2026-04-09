export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn, user } = useUserSession();

  // 관리자 페이지로 가는데 이미 로그인되어 있지 않거나 관리자가 아니면 로그인 페이지로
  if (to.path.startsWith('/admin')) {
    if (loggedIn.value && (user.value as { role: string }).role === 'ADMIN') return;
    return navigateTo('/login', { replace: true });
  }
});
