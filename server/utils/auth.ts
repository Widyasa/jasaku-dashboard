import type { H3Event } from "h3";

export async function requireOwner(event: H3Event) {
  const user = await getUserSession(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  if (user.role !== "OWNER") {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
    });
  }

  return user;
}

export async function requiereAuth(event: H3Event) {
  const user = await getUserSession(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }
}
