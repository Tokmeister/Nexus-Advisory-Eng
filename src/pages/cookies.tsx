import PublicInfoPage from '@/components/PublicInfoPage';

export default function CookiesPage() {
  return (
    <PublicInfoPage
      title="Cookies"
      intro="Nexus may use cookies and similar technologies to support core website and platform functionality."
    >
      <>
        <p style={{ marginTop: 0 }}>
          These technologies may help us maintain sessions, improve site performance, support navigation, remember preferences, and understand general usage patterns that help improve the user experience.
        </p>
        <p style={{ marginBottom: 0 }}>
          By continuing to use the site, users acknowledge that cookies may be used for functional and operational purposes. Users can usually manage cookie preferences through their browser settings.
        </p>
      </>
    </PublicInfoPage>
  );
}
