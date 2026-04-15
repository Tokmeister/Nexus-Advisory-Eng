import PublicInfoPage from '@/components/PublicInfoPage';
import { BRAND_BLUE } from '@/components/PublicMarketingChrome';

export default function DevelopersPage() {
  return (
    <PublicInfoPage
      title="Developers"
      intro="Nexus is being built as a scalable advisory platform with future potential for broader integrations, workflow extensions, and connected systems."
    >
      <>
        <p style={{ marginTop: 0 }}>
          At this stage, developer-facing functionality may be limited, and some technical capabilities may still be evolving. Over time, the platform may introduce additional integration, automation, and interoperability features where commercially relevant.
        </p>

        <h3 style={{ margin: '28px 0 10px', color: BRAND_BLUE, fontSize: '22px' }}>Subprocessors and Infrastructure</h3>
        <p>
          Nexus may rely on third-party infrastructure, hosting, authentication, database, analytics, communications, or related service providers to support the operation of the platform.
        </p>
        <p>
          As the service matures, we may publish more detailed information on relevant subprocessors, platform components, and infrastructure dependencies where appropriate.
        </p>
        <p>
          The inclusion or use of third-party services does not change our focus on responsible platform operation, access control, and service reliability.
        </p>
        <p style={{ marginBottom: 0 }}>
          For technical partnership or integration-related enquiries, please contact us directly.
        </p>
      </>
    </PublicInfoPage>
  );
}
