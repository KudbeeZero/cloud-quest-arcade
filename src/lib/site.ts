// Central site configuration for Cloud Quest Arcade.
// Shared by the nav, footer, and page metadata so navigation and SEO stay
// consistent as the app grows.

export const siteConfig = {
  name: "Cloud Quest Arcade",
  shortName: "Cloud Quest",
  title: "Cloud Quest Arcade — AWS Cloud Practitioner Trainer",
  description:
    "A retro-flavored practice arcade for the AWS Certified Cloud Practitioner (CLF-C02) exam. Original questions, streaks, and instant explanations to build cloud confidence.",
  // Used for metadataBase + structured data. Swap for the real domain at launch.
  url: "https://cloud-quest-arcade.example.com",
  nav: [
    { href: "/", label: "Home" },
    { href: "/study-tips", label: "Study Tips" },
    { href: "/domain-guide", label: "Domain Guide" },
    { href: "/resources", label: "Resources" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
    { href: "/disclaimer", label: "Disclaimer" },
  ],
} as const;

export type NavItem = (typeof siteConfig.nav)[number];
