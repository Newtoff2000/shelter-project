<template>
  <div>
    <!-- The route announcer only narrates client-side navigations to screen
         readers, so it has no role during SSR. Left server-rendered it emits an
         empty <div> that hydrates against the client's <span> — a div-vs-span
         hydration mismatch on the first node of every page. ClientOnly defers it
         to the client, where it belongs. -->
    <ClientOnly>
      <NuxtRouteAnnouncer />
    </ClientOnly>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
