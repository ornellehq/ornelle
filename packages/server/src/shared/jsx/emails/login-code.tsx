import { Section, Text } from "@react-email/components"
import {
  colors,
  fontFamilies,
  fontSizes,
  spacing,
} from "./components/design-tokens"
import Footer from "./components/footer"
import Layout from "./components/layout"

// Login verification code email component
const LogInCode = ({
  code = "5MFXR4",
  firstName = "",
  companyName,
}: {
  code: string
  firstName?: string
  companyName: string
}) => {
  return (
    <Layout>
      <Section style={{ padding: `${spacing.lg} 0` }}>
        <Text
          style={{
            fontWeight: 600,
            color: colors.primary,
            margin: `0 0 ${spacing.md} 0`,
          }}
        >
          Sign in to Ornelle
        </Text>

        <Text
          style={{
            color: colors.secondary,
            margin: `0 0 ${spacing.md} 0`,
          }}
        >
          Hi{firstName ? ` ${firstName},` : ","}
        </Text>
        <Text
          style={{
            color: colors.secondary,
            margin: `0 0 ${spacing.md} 0`,
          }}
        >
          We received a request to sign in to your account.
          <br /> To complete your sign-in, please enter the verification code
          below on the login screen.
        </Text>

        <Text
          style={{
            fontFamily: fontFamilies.mono,
            fontSize: fontSizes.sm,
            margin: "0",
            letterSpacing: "2px",
            color: colors.primary,
            borderLeft: `3px solid ${colors.primary}`,
            paddingLeft: spacing.sm,
            lineHeight: "1",
          }}
        >
          {code}
        </Text>

        <Text
          style={{
            color: colors.tertiary,
            margin: `${spacing.md} 0 0 0`,
          }}
        >
          This code is valid for the next 10 minutes.
          <br />
          For your security, please do not share this code with anyone. If you
          did not attempt to log in, please disregard this email.
        </Text>

        <Footer companyName={companyName} />
      </Section>
    </Layout>
  )
}

export default LogInCode
