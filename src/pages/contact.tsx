import PublicInfoPage from '@/components/PublicInfoPage';
import { BRAND_BLUE } from '@/components/PublicMarketingChrome';

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontSize: '14px',
  fontWeight: 700,
  color: '#0b1f4d',
};

const inputStyle = {
  width: '100%',
  minHeight: '48px',
  borderRadius: '14px',
  border: '1px solid #cfd7e6',
  padding: '0 14px',
  fontSize: '15px',
  color: '#0b1f4d',
  background: '#fff',
  boxSizing: 'border-box' as const,
};

const textareaStyle = {
  width: '100%',
  minHeight: '150px',
  borderRadius: '14px',
  border: '1px solid #cfd7e6',
  padding: '14px',
  fontSize: '15px',
  color: '#0b1f4d',
  background: '#fff',
  resize: 'vertical' as const,
  boxSizing: 'border-box' as const,
};

export default function ContactPage() {
  return (
    <PublicInfoPage
      title="Contact"
      intro="Get in touch with Nexus for platform enquiries, onboarding discussions, and advisory-related questions."
    >
      <div style={{ display: 'grid', gap: '28px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '22px',
          }}
        >
          <div
            style={{
              border: '1px solid #e5e8ef',
              borderRadius: '22px',
              padding: '24px',
              background: '#f9fbff',
            }}
          >
            <h3 style={{ margin: '0 0 14px', color: BRAND_BLUE, fontSize: '22px' }}>Contact Details</h3>
            <p style={{ margin: '0 0 10px' }}>
              <strong>Platform:</strong> Nexus Advisory Intelligence Platform
            </p>
            <p style={{ margin: '0 0 10px' }}>
              <strong>Business:</strong> Stratwell Partners
            </p>
            <p style={{ margin: '0 0 10px' }}>
              <strong>Email:</strong> support@nexus.stratwellpartners.co.za
            </p>
            <p style={{ margin: '0 0 10px' }}>
              <strong>Website:</strong> nexus.stratwellpartners.co.za
            </p>
            <p style={{ margin: 0 }}>
              <strong>Purpose:</strong> Product enquiries, onboarding support, partnership enquiries, and general platform communication.
            </p>
          </div>

          <div
            style={{
              border: '1px solid #e5e8ef',
              borderRadius: '22px',
              padding: '24px',
              background: '#fff',
            }}
          >
            <h3 style={{ margin: '0 0 14px', color: BRAND_BLUE, fontSize: '22px' }}>Before You Contact Us</h3>
            <p style={{ margin: '0 0 12px' }}>
              Nexus is designed for businesses that want structured advisory support and stronger execution discipline.
            </p>
            <p style={{ margin: '0 0 12px' }}>
              Contact us if you want to discuss platform access, onboarding, service fit, or commercial use cases.
            </p>
            <p style={{ margin: 0 }}>
              If you are unsure which path is right for your organisation, send an enquiry and we will help direct you.
            </p>
          </div>
        </div>

        <div
          style={{
            border: '1px solid #d9e0ea',
            borderRadius: '24px',
            padding: '30px',
            background: '#fff',
          }}
        >
          <h3 style={{ margin: '0 0 10px', color: '#0b1f4d', fontSize: '22px' }}>Send an Enquiry</h3>
          <p style={{ margin: '0 0 22px', color: '#4a5978' }}>
            Complete the form below and we’ll capture your enquiry for follow-up.
          </p>

          <form style={{ display: 'grid', gap: '18px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: '18px',
              }}
            >
              <div>
                <label style={labelStyle}>Full Name</label>
                <input type="text" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" style={inputStyle} />
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: '18px',
              }}
            >
              <div>
                <label style={labelStyle}>Phone</label>
                <input type="text" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Company</label>
                <input type="text" style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Service Interest</label>
              <select style={inputStyle} defaultValue="">
                <option value="" disabled>
                  Select a service
                </option>
                <option>Nexus Platform Access</option>
                <option>Advisory Support</option>
                <option>Onboarding and Setup</option>
                <option>Partnership Enquiry</option>
                <option>General Enquiry</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Message</label>
              <textarea style={textareaStyle} />
            </div>

            <div>
              <button
                type="button"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '48px',
                  padding: '0 22px',
                  borderRadius: '999px',
                  border: 'none',
                  background: '#caa54b',
                  color: '#0b1f4d',
                  fontSize: '15px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Send Enquiry
              </button>
            </div>
          </form>
        </div>
      </div>
    </PublicInfoPage>
  );
}
