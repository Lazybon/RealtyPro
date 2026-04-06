/** URL основного приложения (поиск, вход). Переопредели через NEXT_PUBLIC_WEB_APP_URL. */
export const WEB_APP_URL = (
  process.env.NEXT_PUBLIC_WEB_APP_URL ?? 'https://realty-pro-web.vercel.app'
).replace(/\/$/, '');
