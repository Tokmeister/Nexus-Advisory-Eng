import PublicInfoPage from '@/components/PublicInfoPage';
import { BRAND_BLUE } from '@/components/PublicMarketingChrome';

export default function LegalPage() {
  return (
    <PublicInfoPage
      title="Legal"
      intro="This page sets out the core legal and operating terms that apply to the use of Nexus and related platform services."
    >
      <>
        <h3 style={{ margin: '0 0 10px', color: BRAND_BLUE, fontSize: '22px' }}>Terms of Service</h3>
        <p style={{ marginTop: 0 }}>
          By accessing or using Nexus, users agree to use the platform lawfully, responsibly, and in accordance with any applicable service terms, subscription conditions, and platform rules.
        </p>
        <p>
          Nexus may update, modify, suspend, or improve features, content, workflows, access levels, or service structures as the platform evolves. Continued use of the platform after material updates may constitute acceptance of the revised terms.
        </p>
        <p>
          Users are responsible for ensuring that information submitted through the platform is accurate to the best of their knowledge and that use of the platform aligns with applicable law and internal organisational authority.
        </p>
        <p>
          Use of Nexus does not create a partnership, employment relationship, fiduciary relationship, or guaranteed business outcome unless expressly agreed in writing.
        </p>

        <h3 style={{ margin: '28px 0 10px', color: BRAND_BLUE, fontSize: '22px' }}>Acceptable Use Policy</h3>
        <p>
          Users may not misuse Nexus, interfere with its operation, attempt unauthorised access, upload malicious content, reverse engineer restricted parts of the platform, or use the service in a manner that is unlawful, harmful, misleading, abusive, or disruptive.
        </p>
        <p>
          The platform may not be used to transmit material that infringes the rights of others, breaches confidentiality obligations, violates applicable law, or creates operational or security risk for the service or its users.
        </p>
        <p>
          We reserve the right to suspend, restrict, or terminate access where use of the platform creates legal, operational, commercial, or security concerns.
        </p>

        <h3 style={{ margin: '28px 0 10px', color: BRAND_BLUE, fontSize: '22px' }}>Data Processing and POPIA</h3>
        <p>
          Nexus is committed to handling personal information in a responsible and commercially reasonable manner.
        </p>
        <p>
          Where personal information is processed through the platform, we aim to do so only to the extent reasonably necessary for account access, platform delivery, support, administration, security, and related lawful business purposes.
        </p>
        <p>
          Where applicable, we intend to operate in a manner aligned with relevant data protection obligations, including privacy, access control, responsible processing, and data handling principles. As the platform grows, this section may be expanded to include more detailed data processing terms, operational controls, retention practices, and user rights language.
        </p>
        <p>
          Users and client organisations are responsible for ensuring that any information they submit through Nexus is submitted lawfully and with appropriate authority.
        </p>

        <h3 style={{ margin: '28px 0 10px', color: BRAND_BLUE, fontSize: '22px' }}>Legal Notice</h3>
        <p>
          Nexus branding, platform content, workflows, and materials are owned by or licensed to the relevant rights holder unless otherwise stated.
        </p>
        <p>
          We may revise these legal notices from time to time as the platform matures, commercial arrangements develop, or regulatory expectations change.
        </p>
        <p style={{ marginBottom: 0 }}>
          For formal legal or commercial enquiries, please contact us through the available channels on this site.
        </p>
      </>
    </PublicInfoPage>
  );
}
