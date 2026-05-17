export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname;

  if (!path.startsWith("/api/")) return;
  if (path === "/api/auth/login") return;

  const session = await getUserSession(event);

  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }
});
