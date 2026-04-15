import { CSSProperties, ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';

export const BRAND_BLUE = '#003087';
export const SHELL_BG = '#f4f5f7';

const headerButtonBase: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '50px',
  padding: '0 26px',
  borderRadius: '999px',
  fontSize: '16px',
  fontWeight: 700,
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'all 160ms ease',
};

export function PublicHeader({ rightContent }: { rightContent?: ReactNode }) {
  return (
    <header style={{ background: '#fff', borderBottom: '1px solid #e5e8ef', padding: '0 34px' }}>
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          minHeight: '82px',
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        <Link
          to="/"
          style={{
            justifySelf: 'start',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '14px',
            textDecoration: 'none',
            color: '#0b1f4d',
            whiteSpace: 'nowrap',
          }}
        >
          <img src="/assets/nexus.png" alt="Nexus" style={{ height: '46px', width: 'auto', display: 'block', flexShrink: 0 }} />
          <span style={{ color: BRAND_BLUE, fontSize: '18px', fontWeight: 500, letterSpacing: '-0.01em' }}>NEXUS</span>
        </Link>

        <nav
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '34px',
            justifySelf: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          <a href="/#startup" style={{ color: '#0b1f4d', textDecoration: 'none', fontSize: '15px', fontWeight: 500 }}>
            Start-ups
          </a>
          <a href="/#small-business" style={{ color: '#0b1f4d', textDecoration: 'none', fontSize: '15px', fontWeight: 500 }}>
            Small Businesses
          </a>
          <a href="/#enterprise" style={{ color: '#0b1f4d', textDecoration: 'none', fontSize: '15px', fontWeight: 500 }}>
            Enterprise Solutions
          </a>
        </nav>

        <div style={{ justifySelf: 'end', display: 'flex', alignItems: 'center', gap: '14px', minWidth: '230px', justifyContent: 'flex-end' }}>
          {rightContent}
        </div>
      </div>
    </header>
  );
}

export function HeaderAuthActions({ active }: { active?: 'login' | 'signup' }) {
  return (
    <>
      <Link
        to="/login"
        style={{
          ...headerButtonBase,
          border: `2px solid ${BRAND_BLUE}`,
          color: BRAND_BLUE,
          background: active === 'login' ? '#f4f7fd' : '#fff',
          opacity: active === 'login' ? 0.9 : 1,
        }}
      >
        Log In
      </Link>
      <Link
        to="/signup"
        style={{
          ...headerButtonBase,
          border: `2px solid ${BRAND_BLUE}`,
          color: '#fff',
          background: BRAND_BLUE,
          opacity: active === 'signup' ? 1 : 1,
        }}
      >
        Sign Up
      </Link>
    </>
  );
}

export function BillingHeaderMeta() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', color: '#5e6c88' }}>
      <span>All prices in USD and exclusive of VAT.</span>
      <Link to="/login" style={{ color: BRAND_BLUE, textDecoration: 'none', fontWeight: 700 }}>
        Back to login
      </Link>
    </div>
  );
}

export function PublicFooter() {
  const footerSections = [
    {
      key: 'About',
      title: 'About Nexus',
      content: (
        <>
          <p style={{ marginTop: 0 }}>
            Nexus is an advisory intelligence platform built to help organisations move from business challenge to structured action.
          </p>
          <p>
            We designed Nexus to give business leaders, founders, and management teams a clearer way to capture problems, define priorities, and generate decision-ready outputs inside one focused environment. Instead of relying on scattered discussions, disconnected documents, or vague next steps, Nexus brings advisory logic and execution structure together.
          </p>
          <p>
            The platform is built around a practical principle: insight should lead to action. Nexus helps users organise business inputs, generate advisory guidance, and support the transition from analysis to implementation.
          </p>
          <p style={{ marginBottom: 0 }}>
            Whether the need is clarity, momentum, or stronger decision-making discipline, Nexus is designed to support better commercial thinking and better execution.
          </p>
        </>
      ),
    },
    {
      key: 'Features',
      title: 'Features',
      content: (
        <>
          <p style={{ marginTop: 0 }}>
            Nexus provides a focused set of tools designed to support structured advisory work and execution discipline.
          </p>
          <p>
            Core platform capabilities include guided business input capture, advisory report generation, decision-focused outputs, project and action support, organisation-based user context, and professional print-ready reports.
          </p>
          <p>
            The platform is built to reduce noise and create clarity. Users can work through business challenges in a more structured way, convert inputs into useful outputs, and create a stronger link between strategic thinking and practical next steps.
          </p>
          <p style={{ marginBottom: 0 }}>
            As Nexus evolves, additional functionality may be introduced to expand reporting depth, execution visibility, workflow integration, and user-level control.
          </p>
        </>
      ),
    },
    {
      key: 'Advisory Platform',
      title: 'Advisory Platform',
      content: (
        <>
          <p style={{ marginTop: 0 }}>
            Nexus is not just a reporting tool. It is a structured advisory platform designed to help organisations identify business pressure points, assess priorities, and move toward practical action.
          </p>
          <p>
            Users can submit key business information, outline the challenge they are facing, define strategic goals, and generate outputs that support sharper thinking and more disciplined execution. The platform is intended to create a clearer pathway from business issue to advisory response.
          </p>
          <p style={{ marginBottom: 0 }}>
            Nexus is built for businesses that want more than generic commentary. It is designed for users who need practical structure, decision support, and a platform that helps turn uncertainty into forward movement.
          </p>
        </>
      ),
    },
    {
      key: 'Contact',
      title: 'Contact',
      content: (
        <>
          <p style={{ marginTop: 0 }}>
            We welcome enquiries from prospective clients, partners, and businesses interested in learning more about Nexus.
          </p>
          <p>
            If you would like to discuss the platform, commercial options, onboarding, or advisory use cases, please contact the Nexus team through the contact details provided on this site.
          </p>
          <p>We aim to respond to genuine business enquiries as efficiently as possible.</p>
          <p style={{ marginBottom: 0 }}>
            If you are unsure which platform path is most suitable for your business, we can help you assess the most practical starting point.
          </p>
        </>
      ),
    },
    {
      key: 'Security',
      title: 'Security',
      content: (
        <>
          <p style={{ marginTop: 0 }}>
            We take platform security seriously and are committed to building Nexus with practical safeguards that support responsible access, data protection, and operational reliability.
          </p>
          <p>
            Our approach includes authenticated access, organisation-based platform context, controlled workflows, and ongoing attention to secure platform operation. As the platform grows, security practices, controls, and monitoring measures may continue to evolve.
          </p>
          <p>
            Security is not treated as a one-time statement. It is an ongoing operational priority intended to support trust, continuity, and responsible service delivery.
          </p>
          <p style={{ marginBottom: 0 }}>
            For security-related questions, users may contact us through the channels provided on this site.
          </p>
        </>
      ),
    },
    {
      key: 'Privacy',
      title: 'Privacy',
      content: (
        <>
          <p style={{ marginTop: 0 }}>
            Nexus is committed to handling personal and business-related information responsibly.
          </p>
          <p>
            We may collect and use information required for account access, organisation setup, platform functionality, service communication, support, product improvement, and other lawful business purposes connected to the operation of the platform.
          </p>
          <p>
            We aim to limit the collection and use of information to what is reasonably necessary for service delivery, platform administration, and operational improvement. As Nexus evolves, our privacy practices may also be updated to reflect changes in product functionality, business processes, or applicable requirements.
          </p>
          <p style={{ marginBottom: 0 }}>Users should review this page periodically for updates.</p>
        </>
      ),
    },
    {
      key: 'Cookies',
      title: 'Cookies',
      content: (
        <>
          <p style={{ marginTop: 0 }}>
            Nexus may use cookies and similar technologies to support core website and platform functionality.
          </p>
          <p>
            These technologies may help us maintain sessions, improve site performance, support navigation, remember preferences, and understand general usage patterns that help improve the user experience.
          </p>
          <p style={{ marginBottom: 0 }}>
            By continuing to use the site, users acknowledge that cookies may be used for functional and operational purposes. Users can usually manage cookie preferences through their browser settings.
          </p>
        </>
      ),
    },
    {
      key: 'Legal',
      title: 'Legal',
      content: (
        <>
          <p style={{ marginTop: 0 }}>
            This page sets out the core legal and operating terms that apply to the use of Nexus and related platform services.
          </p>

          <h4 style={{ margin: '20px 0 10px', color: BRAND_BLUE, fontSize: '18px' }}>Terms of Service</h4>
          <p>
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

          <h4 style={{ margin: '20px 0 10px', color: BRAND_BLUE, fontSize: '18px' }}>Acceptable Use Policy</h4>
          <p>
            Users may not misuse Nexus, interfere with its operation, attempt unauthorised access, upload malicious content, reverse engineer restricted parts of the platform, or use the service in a manner that is unlawful, harmful, misleading, abusive, or disruptive.
          </p>
          <p>
            The platform may not be used to transmit material that infringes the rights of others, breaches confidentiality obligations, violates applicable law, or creates operational or security risk for the service or its users.
          </p>
          <p>
            We reserve the right to suspend, restrict, or terminate access where use of the platform creates legal, operational, commercial, or security concerns.
          </p>

          <h4 style={{ margin: '20px 0 10px', color: BRAND_BLUE, fontSize: '18px' }}>Data Processing and POPIA</h4>
          <p>Nexus is committed to handling personal information in a responsible and commercially reasonable manner.</p>
          <p>
            Where personal information is processed through the platform, we aim to do so only to the extent reasonably necessary for account access, platform delivery, support, administration, security, and related lawful business purposes.
          </p>
          <p>
            Where applicable, we intend to operate in a manner aligned with relevant data protection obligations, including privacy, access control, responsible processing, and data handling principles. As the platform grows, this section may be expanded to include more detailed data processing terms, operational controls, retention practices, and user rights language.
          </p>
          <p>
            Users and client organisations are responsible for ensuring that any information they submit through Nexus is submitted lawfully and with appropriate authority.
          </p>

          <h4 style={{ margin: '20px 0 10px', color: BRAND_BLUE, fontSize: '18px' }}>Legal Notice</h4>
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
      ),
    },
    {
      key: 'Developers',
      title: 'Developers',
      content: (
        <>
          <p style={{ marginTop: 0 }}>
            Nexus is being built as a scalable advisory platform with future potential for broader integrations, workflow extensions, and connected systems.
          </p>
          <p>
            At this stage, developer-facing functionality may be limited, and some technical capabilities may still be evolving. Over time, the platform may introduce additional integration, automation, and interoperability features where commercially relevant.
          </p>

          <h4 style={{ margin: '20px 0 10px', color: BRAND_BLUE, fontSize: '18px' }}>Subprocessors and Infrastructure</h4>
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
      ),
    },
  ];

  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <footer style={{ marginTop: 'auto', background: '#f6f7fa', borderTop: '1px solid #e3e7ee', padding: '40px 34px 28px' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '18px',
            marginBottom: activeSection ? '24px' : '18px',
            textAlign: 'center',
          }}
        >
          {footerSections.map((section) => {
            const isActive = activeSection === section.key;

            return (
              <button
                key={section.key}
                type="button"
                onClick={() => setActiveSection(isActive ? null : section.key)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  color: isActive ? BRAND_BLUE : '#32405d',
                  fontSize: '14px',
                  fontWeight: isActive ? 700 : 400,
                  cursor: 'pointer',
                }}
              >
                {section.key}
              </button>
            );
          })}
        </div>

        {activeSection && (
          <div
            style={{
              maxWidth: '980px',
              margin: '0 auto 22px',
              background: '#ffffff',
              border: '1px solid #d9e0ea',
              borderRadius: '22px',
              padding: '28px 30px',
              color: '#32405d',
              fontSize: '15px',
              lineHeight: '1.8',
              boxShadow: '0 12px 30px rgba(13,33,89,0.05)',
            }}
          >
            <h3 style={{ margin: '0 0 16px', color: BRAND_BLUE, fontSize: '24px', lineHeight: '1.2' }}>
              {footerSections.find((section) => section.key === activeSection)?.title}
            </h3>
            {footerSections.find((section) => section.key === activeSection)?.content}
          </div>
        )}

        <div style={{ borderTop: '1px solid #d9e0ea', marginTop: '18px', paddingTop: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', color: '#32405d', fontWeight: 400, fontSize: '14px' }}>
            <img src="/assets/nexus.png" alt="Nexus" style={{ height: '42px', width: 'auto', display: 'block', flexShrink: 0 }} />
            <span style={{ marginLeft: '15px', lineHeight: '1' }}>NEXUS Advisory Intelligence Platform</span>
            <span style={{ marginLeft: 'auto', lineHeight: '1', textAlign: 'right' }}>Connecting data. Driving decisions.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
