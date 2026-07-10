import ContentShell from "@/components/ContentShell";
import Prose from "@/components/Prose";

export default function PrivacyPage() {
  return (
    <ContentShell title="Privacy Policy" backLabel="Home" backHref="/">
      <Prose>
        <p>
          Cloud Quest Arcade is a fully client-side practice tool. We do not collect,
          transmit, or store personal information on any server.
        </p>
        <h3>Local storage only</h3>
        <p>
          Your best score, streak count, and run history are saved in your browser
          using <code>localStorage</code>. You can clear this data at any time through
          your browser&rsquo;s developer tools or site settings.
        </p>
        <h3>No tracking</h3>
        <p>
          This site does not use analytics cookies, advertising pixels, or
          third-party tracking scripts. What you do in the app stays on your device.
        </p>
        <h3>Third-party services</h3>
        <p>
          The site is served publicly and may be hosted on platforms such as Vercel or
          AWS Amplify. Those platforms collect standard access logs, but we do not
          control or rely on those logs for any product feature.
        </p>
      </Prose>
    </ContentShell>
  );
}
