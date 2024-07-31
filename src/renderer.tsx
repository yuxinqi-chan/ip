import { jsxRenderer } from "hono/jsx-renderer";
import { translations } from "./i18n";

export const renderer = jsxRenderer(({ children }, c) => {
  let lang = c.req.param("lang") || "en";
  if (Object.hasOwn(translations, lang)) {
    lang = "en";
  }
  const t = translations[lang as keyof typeof translations];
  return (
    <html lang={lang}>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${t.title}</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        />
        <link href="/static/style.css" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
});
