import { Text } from "@react-email/components"
import { colors, fontSizes, spacing } from "./design-tokens"

const Footer = ({ companyName }: { companyName: string }) => {
  return (
    <>
      <Text
        style={{
          color: colors.secondary,
          margin: `${spacing.md} 0 0 0`,
        }}
      >
        Thanks,
      </Text>

      <Text
        style={{
          fontSize: fontSizes.sm,
          color: colors.secondary,
          margin: `0 0 ${spacing.xl}`,
        }}
      >
        The {companyName} Team
      </Text>
      <hr
        style={{
          border: "0",
          borderTop: `1px solid ${colors.border}`,
          backgroundColor: colors.border,
        }}
      />
      <Text
        style={{
          fontSize: fontSizes.xs,
          color: colors.tertiary,
          margin: `${spacing.xl} 0 0`,
        }}
      >
        Ornelle.co
      </Text>
      <Text
        style={{
          fontSize: fontSizes.xs,
          color: colors.tertiary,
          margin: "0",
        }}
      >
        Briph Inc, Newark, DE © {new Date().getFullYear()} Briph
      </Text>
    </>
  )
}

export default Footer
