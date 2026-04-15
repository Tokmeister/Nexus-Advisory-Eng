import PublicInfoPage from '@/components/PublicInfoPage';

export default function SecurityPage() {
  return (
    <PublicInfoPage
      title="Security"
      intro="We take platform security seriously and are committed to building Nexus with practical safeguards that support responsible access, data protection, and operational reliability."
    >
      <>
        <p style={{ marginTop: 0 }}>
          Our approach includes authenticated access, organisation-based platform context, controlled workflows, and ongoing attention to secure platform operation.
        </p>
        <p>
          As the platform grows, security practices, controls, and monitoring measures may continue to evolve.
        </p>
        <p>
          Security is not treated as a one-time statement. It is an ongoing operational priority intended to support trust, continuity, and responsible service delivery.
        </p>
        <p style={{ marginBottom: 0 }}>
          For security-related questions, users may contact us through the channels provided on this site.
        </p>
      </>
    </PublicInfoPage>
  );
}
