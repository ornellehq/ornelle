import { Body, Container, Head, Html } from "@react-email/components"
import type React from "react"
import { colors, fontFamilies, fontSizes, spacing } from "./design-tokens"

// Email layout component
const Layout = ({ children }: { children: React.ReactNode }) => (
  <Html>
    <Head>
      <style
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{
          __html: `
        body {
          font-family: ${fontFamilies.primary};
          margin: 0;
          padding: 0;
          color: ${colors.secondary};
          line-height: 1.5;
        }
      `,
        }}
      />
    </Head>
    <Body
      style={{
        backgroundColor: colors.background,
        margin: "0",
        padding: `${spacing.xl} 0`,
        fontSize: fontSizes.md,
      }}
    >
      <Container
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: spacing.md,
        }}
      >
        {children}
      </Container>
    </Body>
  </Html>
)

export default Layout
