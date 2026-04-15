import PublicInfoPage from '@/components/PublicInfoPage';

export default function AdvisoryPlatformPage() {
  return (
    <PublicInfoPage
      title="Advisory Platform"
      intro="Nexus is not just a reporting tool. It is a structured advisory platform designed to help organisations identify business pressure points, assess priorities, and move toward practical action."
    >
      <>
        <p style={{ marginTop: 0 }}>
          Users can submit key business information, outline the challenge they are facing, define strategic goals, and generate outputs that support sharper thinking and more disciplined execution.
        </p>
        <p>
          The platform is intended to create a clearer pathway from business issue to advisory response.
        </p>
        <p style={{ marginBottom: 0 }}>
          Nexus is built for businesses that want more than generic commentary. It is designed for users who need practical structure, decision support, and a platform that helps turn uncertainty into forward movement.
        </p>
      </>
    </PublicInfoPage>
  );
}
