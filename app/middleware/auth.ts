export default defineNuxtRouteMiddleware(() => {
  const { loggedIn } = useUserSession();

  if (!loggedIn) {
    return navigateTo("/login");
  }
});
