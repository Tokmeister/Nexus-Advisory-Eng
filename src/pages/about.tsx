import PublicInfoPage from '@/components/PublicInfoPage';

export default function AboutPage() {
  return (
    <PublicInfoPage
      title="About Nexus"
      intro="Nexus is an advisory intelligence platform built to help organisations move from business challenge to structured action."
    >
      <>
        <p style={{ marginTop: 0 }}>
          We designed Nexus to give business leaders, founders, and management teams a clearer way to capture problems, define priorities, and generate decision-ready outputs inside one focused environment.
        </p>
        <p>
          Instead of relying on scattered discussions, disconnected documents, or vague next steps, Nexus brings advisory logic and execution structure together.
        </p>
        <p>
          The platform is built around a practical principle: insight should lead to action. Nexus helps users organise business inputs, generate advisory guidance, and support the transition from analysis to implementation.
        </p>
        <p style={{ marginBottom: 0 }}>
          Whether the need is clarity, momentum, or stronger decision-making discipline, Nexus is designed to support better commercial thinking and better execution.
        </p>
      </>
    </PublicInfoPage>
  );
}
