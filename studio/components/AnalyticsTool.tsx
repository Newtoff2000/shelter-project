import {Box, Button, Card, Flex, Stack, Text} from '@sanity/ui'
import {LaunchIcon} from '@sanity/icons'

// The public "share" URL from Umami Cloud (website → Settings → enable Share URL).
// Exposed to the Studio bundle via a SANITY_STUDIO_-prefixed env var so it can
// change without code edits. See studio/README.md.
const SHARE_URL = import.meta.env.SANITY_STUDIO_UMAMI_SHARE_URL as string | undefined

export function AnalyticsTool() {
  // Friendly empty state instead of a blank iframe when the URL isn't configured.
  if (!SHARE_URL) {
    return (
      <Card height="fill" padding={5} tone="caution">
        <Flex align="center" justify="center" height="fill">
          <Stack space={4} style={{maxWidth: 480, textAlign: 'center'}}>
            <Text size={2} weight="semibold">
              Analytics not configured yet
            </Text>
            <Text size={1} muted>
              Set <code>SANITY_STUDIO_UMAMI_SHARE_URL</code> to the public share link
              from your Umami dashboard (website → Settings → enable Share URL), then
              redeploy the Studio.
            </Text>
          </Stack>
        </Flex>
      </Card>
    )
  }

  return (
    <Flex direction="column" height="fill">
      {/* Slim header with an escape hatch in case embedding is blocked */}
      <Card padding={2} borderBottom>
        <Flex justify="flex-end">
          <Button
            as="a"
            href={SHARE_URL}
            target="_blank"
            rel="noopener noreferrer"
            mode="bleed"
            icon={LaunchIcon}
            text="Open in new tab"
            fontSize={1}
          />
        </Flex>
      </Card>

      <Box flex={1}>
        <iframe
          src={SHARE_URL}
          title="Umami analytics"
          style={{width: '100%', height: '100%', border: 0, display: 'block'}}
        />
      </Box>
    </Flex>
  )
}
