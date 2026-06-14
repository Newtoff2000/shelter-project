# Sanity Clean Content Studio

Congratulations, you have now installed the Sanity Content Studio, an open-source real-time content editing environment connected to the Sanity backend.

Now you can do the following things:

- [Read “getting started” in the docs](https://www.sanity.io/docs/introduction/getting-started?utm_source=readme)
- [Join the Sanity community](https://www.sanity.io/community/join?utm_source=readme)
- [Extend and build plugins](https://www.sanity.io/docs/content-studio/extending?utm_source=readme)

## Analytics tool

The Studio has an **Analytics** tab in the top nav that embeds the website's
Umami dashboard, so volunteers can see visits and donation/adoption interest in
the same place they edit animals.

To wire it up, set `SANITY_STUDIO_UMAMI_SHARE_URL` (in `.env`, see
`.env.example`) to the public **Share URL** from Umami Cloud — open the website
in Umami → Settings → enable *Share URL* → copy the link → redeploy the Studio
(`npm run deploy`). Until it's set, the tab shows a short "not configured" notice.
