import PublicInfoPage from '@/components/PublicInfoPage';

export default function PrivacyPage() {
  return (
    <PublicInfoPage
      title="Privacy"
      intro="Nexus is committed to handling personal and business-related information responsibly."
    >
      <>
        <p style={{ marginTop: 0 }}>
          We may collect and use information required for account access, organisation setup, platform functionality, service communication, support, product improvement, and other lawful business purposes connected to the operation of the platform.
        </p>
        <p>
          We aim to limit the collection and use of information to what is reasonably necessary for service delivery, platform administration, and operational improvement.
        </p>
        <p>
          As Nexus evolves, our privacy practices may also be updated to reflect changes in product functionality, business processes, or applicable requirements.
        </p>
        <p style={{ marginBottom: 0 }}>
          Users should review this page periodically for updates.
        </p>
      </>
    </PublicInfoPage>
  );
}
