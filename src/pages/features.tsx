import PublicInfoPage from '@/components/PublicInfoPage';

export default function FeaturesPage() {
  return (
    <PublicInfoPage
      title="Features"
      intro="Nexus provides a focused set of tools designed to support structured advisory work and execution discipline."
    >
      <>
        <p style={{ marginTop: 0 }}>
          Core platform capabilities include guided business input capture, advisory report generation, decision-focused outputs, project and action support, organisation-based user context, and professional print-ready reports.
        </p>
        <p>
          The platform is built to reduce noise and create clarity. Users can work through business challenges in a more structured way, convert inputs into useful outputs, and create a stronger link between strategic thinking and practical next steps.
        </p>
        <p style={{ marginBottom: 0 }}>
          As Nexus evolves, additional functionality may be introduced to expand reporting depth, execution visibility, workflow integration, and user-level control.
        </p>
      </>
    </PublicInfoPage>
  );
}
