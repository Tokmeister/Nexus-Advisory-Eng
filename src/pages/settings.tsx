import { useEffect, useRef, useState } from 'react';
import NexusShell from '@/components/NexusShell';
import { User, Building2, Bell, Shield, Palette, Database, Key, Save } from 'lucide-react';
import { updatePassword, useSession } from '@/lib/auth/auth-client';

const sections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'organisation', label: 'Organisation', icon: Building2 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'data', label: 'Data & Storage', icon: Database },
  { id: 'api', label: 'API & Integrations', icon: Key },
];

const PROFILE_UPDATED_EVENT = 'nexus-profile-updated';
const ORGANISATION_UPDATED_EVENT = 'nexus-organisation-updated';
const APPEARANCE_UPDATED_EVENT = 'nexus-appearance-updated';
const DEFAULT_AVATAR = '/assets/profile.jpg';

type ProfileState = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone: string;
  avatarUrl: string;
};

type OrganisationState = {
  name: string;
  regNumber: string;
  industry: string;
  country: string;
  timezone: string;
};

type NotificationState = {
  emailReports: boolean;
  emailAdvisory: boolean;
  emailProjects: boolean;
  urgencyAlerts: boolean;
  weeklyDigest: boolean;
  systemUpdates: boolean;
};

type SupabaseUserLike = {
  id?: string;
  email?: string;
};

type SupabaseClientLike = {
  from: (table: string) => {
    select: (columns?: string) => {
      eq: (column: string, value: string) => {
        maybeSingle: () => Promise<{ data: Record<string, unknown> | null; error: { message?: string } | null }>;
      };
    };
    update: (values: Record<string, unknown>) => {
      eq: (column: string, value: string) => Promise<{ data?: unknown; error: { message?: string } | null }>;
    };
  };
  storage: {
    from: (bucket: string) => {
      upload: (
        path: string,
        file: File,
        options?: { cacheControl?: string; upsert?: boolean; contentType?: string }
      ) => Promise<{ data?: unknown; error: { message?: string } | null }>;
      getPublicUrl: (path: string) => { data: { publicUrl: string } };
    };
  };
};

const SUPABASE_URL =
  import.meta.env.VITE_NEXUS_SUPABASE_URL || 'https://clwjhdxjdpikrxcormsb.supabase.co';

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_NEXUS_SUPABASE_ANON_KEY || 'sb_publishable_EJGKO-RRnc9zJo8jUxsLlQ_uvTNC2Bw';

let supabasePromise: Promise<SupabaseClientLike> | null = null;

function clean(value: unknown): string {
  return String(value || '').trim();
}

function buildFullName(firstName: string, lastName: string): string {
  return `${clean(firstName)} ${clean(lastName)}`.replace(/\s+/g, ' ').trim();
}

function dispatchProfileUpdated() {
  localStorage.setItem('nexus_profile_updated_at', String(Date.now()));
  window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT));
}

function dispatchOrganisationUpdated(nextOrganisationName: string) {
  const name = clean(nextOrganisationName);
  if (name) {
    localStorage.setItem('nexus_organisation_name', name);
  }
  localStorage.setItem('nexus_organisation_updated_at', String(Date.now()));
  window.dispatchEvent(new Event(ORGANISATION_UPDATED_EVENT));
}

function dispatchAppearanceUpdated(theme: string, density: string, sidebarCollapsed: boolean) {
  localStorage.setItem('nexus_theme_preference', theme);
  localStorage.setItem('nexus_density_preference', density);
  localStorage.setItem('nexus_sidebar_collapsed', String(sidebarCollapsed));
  localStorage.setItem('nexus_appearance_updated_at', String(Date.now()));
  window.dispatchEvent(new Event(APPEARANCE_UPDATED_EVENT));
}

async function getSupabase(): Promise<SupabaseClientLike> {
  const existing = (window as Window & { __nexusSupabase?: SupabaseClientLike }).__nexusSupabase;
  if (existing) return existing;

  if (!supabasePromise) {
    supabasePromise = import(
      /* @vite-ignore */ 'https://esm.sh/@supabase/supabase-js@2'
    ).then((mod: { createClient: (url: string, key: string, options?: Record<string, unknown>) => SupabaseClientLike }) => {
      const client = mod.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });

      (window as Window & { __nexusSupabase?: SupabaseClientLike }).__nexusSupabase = client;
      return client;
    });
  }

  return supabasePromise;
}

function profileFromRow(row: Record<string, unknown> | null, user?: SupabaseUserLike | null): ProfileState {
  const firstName = clean(row?.first_name);
  const lastName = clean(row?.last_name);
  const fullName = clean(row?.full_name);
  const nameParts = fullName ? fullName.split(/\s+/) : [];

  return {
    firstName: firstName || nameParts[0] || '',
    lastName: lastName || nameParts.slice(1).join(' ') || '',
    email: clean(row?.email) || clean(user?.email),
    role: clean(row?.role_title) || clean(row?.role),
    phone: clean(row?.phone_number),
    avatarUrl: clean(row?.avatar_url) || DEFAULT_AVATAR,
  };
}

function organisationFromRow(row: Record<string, unknown> | null): OrganisationState {
  return {
    name: clean(row?.name),
    regNumber: clean(row?.registration_number),
    industry: clean(row?.industry),
    country: clean(row?.country),
    timezone: clean(row?.timezone),
  };
}

function notificationsFromRow(row: Record<string, unknown> | null): NotificationState {
  return {
    emailReports: row?.notify_email_reports === false ? false : true,
    emailAdvisory: row?.notify_email_advisory === false ? false : true,
    emailProjects: row?.notify_email_projects === true,
    urgencyAlerts: row?.notify_urgency_alerts === false ? false : true,
    weeklyDigest: row?.notify_weekly_digest === false ? false : true,
    systemUpdates: row?.notify_system_updates === true,
  };
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [activeSection, setActiveSection] = useState('profile');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isLoadingOrganisation, setIsLoadingOrganisation] = useState(true);
  const [isSavingOrganisation, setIsSavingOrganisation] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);
  const [isLoadingAppearance, setIsLoadingAppearance] = useState(true);
  const [isSavingAppearance, setIsSavingAppearance] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [organisationError, setOrganisationError] = useState('');
  const [notificationsError, setNotificationsError] = useState('');
  const [appearanceError, setAppearanceError] = useState('');
  const [securityError, setSecurityError] = useState('');
  const [securitySuccess, setSecuritySuccess] = useState('');
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);
  const [dataError, setDataError] = useState('');
  const [dataSuccess, setDataSuccess] = useState('');
  const [activeDataAction, setActiveDataAction] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [organisationId, setOrganisationId] = useState('');

  const [profile, setProfile] = useState<ProfileState>({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    phone: '',
    avatarUrl: DEFAULT_AVATAR,
  });
  const [initialProfile, setInitialProfile] = useState<ProfileState>({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    phone: '',
    avatarUrl: DEFAULT_AVATAR,
  });

  const [org, setOrg] = useState<OrganisationState>({
    name: '',
    regNumber: '',
    industry: '',
    country: '',
    timezone: '',
  });
  const [initialOrg, setInitialOrg] = useState<OrganisationState>({
    name: '',
    regNumber: '',
    industry: '',
    country: '',
    timezone: '',
  });

  const [notifications, setNotifications] = useState<NotificationState>({ emailReports: true, emailAdvisory: true, emailProjects: false, urgencyAlerts: true, weeklyDigest: true, systemUpdates: false });
  const [initialNotifications, setInitialNotifications] = useState<NotificationState>({ emailReports: true, emailAdvisory: true, emailProjects: false, urgencyAlerts: true, weeklyDigest: true, systemUpdates: false });
  const [appearance, setAppearance] = useState({ theme: 'dark', density: 'comfortable', sidebarCollapsed: false });
  const [initialAppearance, setInitialAppearance] = useState({ theme: 'dark', density: 'comfortable', sidebarCollapsed: false });
  const [securityForm, setSecurityForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const handleGenericSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const panel: React.CSSProperties = { background: '#0d1526', border: '1px solid #1e3a5f', borderRadius: '12px', padding: '1.75rem' };
  const kicker = (t: string) => <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: '#3b82f6', textTransform: 'uppercase' as const, fontWeight: '600', marginBottom: '0.2rem' }}>{t}</div>;
  const inputStyle: React.CSSProperties = { width: '100%', background: '#0a0f1e', border: '1px solid #1e3a5f', borderRadius: '8px', padding: '0.6rem 0.875rem', color: '#e2e8f0', fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.7rem', color: '#60a5fa', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button onClick={() => onChange(!value)}
      style={{ width: '40px', height: '22px', borderRadius: '999px', background: value ? '#2563eb' : '#1e3a5f', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s ease', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: '3px', left: value ? '21px' : '3px', width: '16px', height: '16px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s ease' }} />
    </button>
  );

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      // Set all loading states in one synchronous batch — prevents 4 separate re-renders
      setIsLoadingProfile(true);
      setIsLoadingOrganisation(true);
      setIsLoadingNotifications(true);
      setIsLoadingAppearance(true);
      setProfileError('');
      setOrganisationError('');
      setNotificationsError('');
      setAppearanceError('');
      setSecurityError('');
      setSecuritySuccess('');
      setDataError('');
      setDataSuccess('');

      const userId = clean(session?.user?.id);
      if (!userId) {
        if (!mounted) return;
        const blankProfile = profileFromRow(null, session?.user || null);
        const blankOrg = organisationFromRow(null);
        const blankNotifications = notificationsFromRow(null);
        setProfile(blankProfile);
        setInitialProfile(blankProfile);
        setOrg(blankOrg);
        setInitialOrg(blankOrg);
        setNotifications(blankNotifications);
        setInitialNotifications(blankNotifications);
        setAppearance({ theme: 'dark', density: 'comfortable', sidebarCollapsed: false });
        setInitialAppearance({ theme: 'dark', density: 'comfortable', sidebarCollapsed: false });
        localStorage.setItem('nexus_theme_preference', 'dark');
        localStorage.setItem('nexus_density_preference', 'comfortable');
        localStorage.setItem('nexus_sidebar_collapsed', 'false');
        setOrganisationId('');
        setIsLoadingProfile(false);
        setIsLoadingOrganisation(false);
        setIsLoadingNotifications(false);
        setIsLoadingAppearance(false);
        return;
      }

      try {
        const supabase = await getSupabase();

        // Single query for profile + notifications + appearance — all in one round trip
        const { data, error } = await supabase
          .from('profiles')
          .select('id, organisation_id, first_name, last_name, full_name, email, phone_number, role_title, role, avatar_url, notify_email_reports, notify_email_advisory, notify_email_projects, notify_urgency_alerts, notify_weekly_digest, notify_system_updates, theme_preference, density_preference, sidebar_collapsed')
          .eq('id', userId)
          .maybeSingle();

        if (error) throw new Error(error.message || 'Failed to load profile.');
        if (!mounted) return;

        const nextProfile = profileFromRow(data, session?.user || null);
        const nextNotifications = notificationsFromRow(data);
        const nextAppearance = {
          theme: clean(data?.theme_preference) || 'dark',
          density: clean(data?.density_preference) || 'comfortable',
          sidebarCollapsed: data?.sidebar_collapsed === true,
        };

        // Apply profile, notifications, appearance all at once before org fetch
        setProfile(nextProfile);
        setInitialProfile(nextProfile);
        setNotifications(nextNotifications);
        setInitialNotifications(nextNotifications);
        setAppearance(nextAppearance);
        setInitialAppearance(nextAppearance);
        localStorage.setItem('nexus_theme_preference', nextAppearance.theme);
        localStorage.setItem('nexus_density_preference', nextAppearance.density);
        localStorage.setItem('nexus_sidebar_collapsed', String(nextAppearance.sidebarCollapsed));
        setIsLoadingProfile(false);
        setIsLoadingNotifications(false);
        setIsLoadingAppearance(false);

        const nextOrganisationId = clean(data?.organisation_id);
        setOrganisationId(nextOrganisationId);
        localStorage.setItem('activeOrganisationId', nextOrganisationId);
        localStorage.setItem('nexus_selected_organisation_id', nextOrganisationId);

        if (!nextOrganisationId) {
          setOrg(organisationFromRow(null));
          setInitialOrg(organisationFromRow(null));
          setIsLoadingOrganisation(false);
          return;
        }

        // Org fetch is the second round trip — intentionally separate so profile shows fast
        const orgResult = await supabase
          .from('organisations')
          .select('id, name, registration_number, industry, country, timezone')
          .eq('id', nextOrganisationId)
          .maybeSingle();

        if (orgResult.error) throw new Error(orgResult.error.message || 'Failed to load organisation.');
        if (!mounted) return;

        const nextOrg = organisationFromRow(orgResult.data);
        setOrg(nextOrg);
        setInitialOrg(nextOrg);
        if (clean(nextOrg.name)) {
          localStorage.setItem('nexus_organisation_name', clean(nextOrg.name));
        }
      } catch (error) {
        if (!mounted) return;
        const message = error instanceof Error ? error.message : 'Failed to load settings.';
        setProfileError(message);
        setOrganisationError(message);
        setNotificationsError(message);
        setAppearanceError(message);
      } finally {
        if (mounted) {
          setIsLoadingOrganisation(false);
          // Belt-and-suspenders: ensure other loaders are cleared even if org fetch threw
          setIsLoadingProfile(false);
          setIsLoadingNotifications(false);
          setIsLoadingAppearance(false);
        }
      }
    };

    void loadSettings();

    return () => {
      mounted = false;
    };
  }, [session?.user?.id, session?.user?.email]);

  const handlePhotoSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (!file) return;

    const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!acceptedTypes.includes(file.type)) {
      setProfileError('Use JPG, PNG, or WEBP for the profile photo.');
      event.target.value = '';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setProfileError('Profile photo must be smaller than 2MB.');
      event.target.value = '';
      return;
    }

    setProfileError('');
    setSelectedPhoto(file);
    const previewUrl = URL.createObjectURL(file);
    setProfile(current => ({ ...current, avatarUrl: previewUrl }));
    event.target.value = '';
  };

  const uploadProfilePhoto = async (userId: string, file: File): Promise<string> => {
    const supabase = await getSupabase();
    const extension = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const path = `${userId}/avatar.${extension}`;

    const { error } = await supabase.storage
      .from('profile-photos')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type,
      });

    if (error) {
      throw new Error(error.message || 'Photo upload failed.');
    }

    const { data } = supabase.storage.from('profile-photos').getPublicUrl(path);
    return clean(data?.publicUrl);
  };

  const handleProfileSave = async () => {
    try {
      const userId = clean(session?.user?.id);
      if (!userId) {
        setProfileError('No active user session was found.');
        return;
      }

      const firstName = clean(profile.firstName);
      const lastName = clean(profile.lastName);
      const email = clean(profile.email).toLowerCase();
      const roleTitle = clean(profile.role);
      const phoneNumber = clean(profile.phone);
      const fullName = buildFullName(firstName, lastName);

      if (!firstName || !lastName || !email) {
        setProfileError('First name, last name, and email are required.');
        return;
      }

      setIsSavingProfile(true);
      setProfileError('');

      let avatarUrl = clean(initialProfile.avatarUrl) || DEFAULT_AVATAR;
      if (selectedPhoto) {
        avatarUrl = await uploadProfilePhoto(userId, selectedPhoto);
      }

      const supabase = await getSupabase();
      const payload = {
        first_name: firstName,
        last_name: lastName,
        full_name: fullName,
        email,
        phone_number: phoneNumber,
        role_title: roleTitle,
        avatar_url: avatarUrl,
      };

      const { error } = await supabase.from('profiles').update(payload).eq('id', userId);
      if (error) throw new Error(error.message || 'Profile save failed.');

      const nextProfile: ProfileState = {
        firstName,
        lastName,
        email,
        role: roleTitle,
        phone: phoneNumber,
        avatarUrl: avatarUrl || DEFAULT_AVATAR,
      };

      setProfile(nextProfile);
      setInitialProfile(nextProfile);
      setSelectedPhoto(null);
      setSaved(true);
      dispatchProfileUpdated();
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : 'Profile save failed.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleOrganisationSave = async () => {
    try {
      const orgId = clean(organisationId);
      if (!orgId) {
        setOrganisationError('No active organisation was found for this user.');
        return;
      }

      const payload = {
        name: clean(org.name),
        registration_number: clean(org.regNumber),
        industry: clean(org.industry),
        country: clean(org.country),
        timezone: clean(org.timezone),
      };

      if (!payload.name) {
        setOrganisationError('Organisation name is required.');
        return;
      }

      setIsSavingOrganisation(true);
      setOrganisationError('');

      const supabase = await getSupabase();
      const { error } = await supabase.from('organisations').update(payload).eq('id', orgId);
      if (error) throw new Error(error.message || 'Organisation save failed.');

      const nextOrganisation: OrganisationState = {
        name: payload.name,
        regNumber: payload.registration_number,
        industry: payload.industry,
        country: payload.country,
        timezone: payload.timezone,
      };

      setOrg(nextOrganisation);
      setInitialOrg(nextOrganisation);
      setSaved(true);
      dispatchOrganisationUpdated(nextOrganisation.name);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      setOrganisationError(error instanceof Error ? error.message : 'Organisation save failed.');
    } finally {
      setIsSavingOrganisation(false);
    }
  };

  const handleNotificationsSave = async () => {
    try {
      const userId = clean(session?.user?.id);
      if (!userId) {
        setNotificationsError('No active user session was found.');
        return;
      }

      setIsSavingNotifications(true);
      setNotificationsError('');

      const payload = {
        notify_email_reports: notifications.emailReports,
        notify_email_advisory: notifications.emailAdvisory,
        notify_email_projects: notifications.emailProjects,
        notify_urgency_alerts: notifications.urgencyAlerts,
        notify_weekly_digest: notifications.weeklyDigest,
        notify_system_updates: notifications.systemUpdates,
      };

      const supabase = await getSupabase();
      const { error } = await supabase.from('profiles').update(payload).eq('id', userId);
      if (error) throw new Error(error.message || 'Notification settings save failed.');

      const nextNotifications = { ...notifications };
      setNotifications(nextNotifications);
      setInitialNotifications(nextNotifications);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      setNotificationsError(error instanceof Error ? error.message : 'Notification settings save failed.');
    } finally {
      setIsSavingNotifications(false);
    }
  };

  const handleAppearanceSave = async () => {
    try {
      const userId = clean(session?.user?.id);
      if (!userId) {
        setAppearanceError('No active user session was found.');
        return;
      }

      setIsSavingAppearance(true);
      setAppearanceError('');
      setSecurityError('');
      setSecuritySuccess('');
      setDataError('');
      setDataSuccess('');

      const payload = {
        theme_preference: appearance.theme,
        density_preference: appearance.density,
        sidebar_collapsed: appearance.sidebarCollapsed,
      };

      const supabase = await getSupabase();
      const { error } = await supabase.from('profiles').update(payload).eq('id', userId);
      if (error) throw new Error(error.message || 'Appearance settings save failed.');

      const nextAppearance = { ...appearance };
      setAppearance(nextAppearance);
      setInitialAppearance(nextAppearance);
      dispatchAppearanceUpdated(nextAppearance.theme, nextAppearance.density, nextAppearance.sidebarCollapsed);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      setAppearanceError(error instanceof Error ? error.message : 'Appearance settings save failed.');
    } finally {
      setIsSavingAppearance(false);
    }
  };

  const handleSecuritySave = async () => {
    try {
      setSecurityError('');
      setSecuritySuccess('');
      setDataError('');
      setDataSuccess('');

      const currentPassword = clean(securityForm.currentPassword);
      const newPassword = clean(securityForm.newPassword);
      const confirmPassword = clean(securityForm.confirmPassword);
      const email = clean(session?.user?.email).toLowerCase();

      if (!email) {
        setSecurityError('No active user session was found.');
        return;
      }

      if (!currentPassword || !newPassword || !confirmPassword) {
        setSecurityError('Complete all password fields before saving.');
        return;
      }

      if (newPassword.length < 8) {
        setSecurityError('New password must be at least 8 characters long.');
        return;
      }

      if (newPassword !== confirmPassword) {
        setSecurityError('New password and confirm password do not match.');
        return;
      }

      if (currentPassword === newPassword) {
        setSecurityError('New password must be different from your current password.');
        return;
      }

      setIsSavingSecurity(true);

      const result = await updatePassword(newPassword);
      if (result.error) {
        setSecurityError(result.error.message || 'Password update failed.');
        return;
      }

      setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSaved(true);
      setSecuritySuccess('Password updated successfully.');
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      setSecurityError(error instanceof Error ? error.message : 'Password update failed.');
    } finally {
      setIsSavingSecurity(false);
    }
  };


  const downloadFile = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const normaliseCsvValue = (value: unknown) => {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value ?? '');
    return `"${stringValue.replace(/"/g, '""')}"`;
  };

  const toCsv = (rows: Record<string, unknown>[]) => {
    if (!rows.length) return '';
    const headers = Array.from(new Set(rows.flatMap(row => Object.keys(row))));
    const headerLine = headers.join(',');
    const body = rows.map(row => headers.map(h => normaliseCsvValue(row[h])).join(',')).join('\n');
    return `${headerLine}\n${body}`;
  };

  const runDataAction = async (action: 'exportReports' | 'exportProjects' | 'clearCache') => {
    try {
      setDataError('');
      setDataSuccess('');
      setActiveDataAction(action);

      const orgId = clean(organisationId);
      const supabase = await getSupabase() as any;

      if (action === 'clearCache') {
        const removableKeys: string[] = [];
        for (let index = 0; index < localStorage.length; index += 1) {
          const key = localStorage.key(index);
          if (!key) continue;
          const lowered = key.toLowerCase();
          const isProtected = ['activeorganisationid', 'nexus_selected_organisation_id', 'nexus_user_name', 'nexus_user_avatar', 'nexus_organisation_name', 'nexus_theme_preference', 'nexus_density_preference', 'nexus_sidebar_collapsed'].includes(lowered);
          if (isProtected) continue;
          if (lowered.includes('advisory') || lowered.includes('history') || lowered.includes('cache') || lowered.includes('report') || lowered.includes('project')) {
            removableKeys.push(key);
          }
        }
        removableKeys.forEach(key => localStorage.removeItem(key));
        setDataSuccess(`Advisory cache cleared. Removed ${removableKeys.length} cached item(s).`);
        return;
      }

      if (!orgId) {
        setDataError('No active organisation was found for this user.');
        return;
      }

      if (action === 'exportReports') {
        const { data, error } = await supabase
          .from('reports')
          .select('*')
          .eq('organisation_id', orgId);

        if (error) throw new Error(error.message || 'Failed to export reports.');

        const rows = Array.isArray(data) ? data : [];
        downloadFile(`nexus-reports-${orgId}.json`, JSON.stringify(rows, null, 2), 'application/json');
        const csv = toCsv(rows as Record<string, unknown>[]);
        if (csv) {
          downloadFile(`nexus-reports-${orgId}.csv`, csv, 'text/csv;charset=utf-8;');
        }
        setDataSuccess(`Exported ${rows.length} report record(s).`);
        return;
      }

      if (action === 'exportProjects') {
        const [{ data: projects, error: projectsError }, { data: actions, error: actionsError }] = await Promise.all([
          supabase.from('projects').select('*').eq('organisation_id', orgId),
          supabase.from('project_actions').select('*').eq('organisation_id', orgId),
        ]);

        if (projectsError) throw new Error(projectsError.message || 'Failed to export projects.');
        if (actionsError) throw new Error(actionsError.message || 'Failed to export project actions.');

        const payload = {
          organisation_id: orgId,
          exported_at: new Date().toISOString(),
          projects: Array.isArray(projects) ? projects : [],
          project_actions: Array.isArray(actions) ? actions : [],
        };

        downloadFile(`nexus-project-data-${orgId}.json`, JSON.stringify(payload, null, 2), 'application/json');
        const projectsCsv = toCsv(payload.projects as Record<string, unknown>[]);
        if (projectsCsv) {
          downloadFile(`nexus-projects-${orgId}.csv`, projectsCsv, 'text/csv;charset=utf-8;');
        }
        const actionsCsv = toCsv(payload.project_actions as Record<string, unknown>[]);
        if (actionsCsv) {
          downloadFile(`nexus-project-actions-${orgId}.csv`, actionsCsv, 'text/csv;charset=utf-8;');
        }
        setDataSuccess(`Exported ${payload.projects.length} project(s) and ${payload.project_actions.length} action item(s).`);
      }
    } catch (error) {
      setDataError(error instanceof Error ? error.message : 'Data action failed.');
    } finally {
      setActiveDataAction('');
    }
  };

  const handleCancel = () => {
    if (activeSection === 'profile') {
      setProfile(initialProfile);
      setSelectedPhoto(null);
      setProfileError('');
      return;
    }

    if (activeSection === 'organisation') {
      setOrg(initialOrg);
      setOrganisationError('');
      return;
    }

    if (activeSection === 'notifications') {
      setNotifications(initialNotifications);
      setNotificationsError('');
      return;
    }

    if (activeSection === 'appearance') {
      setAppearance(initialAppearance);
      setAppearanceError('');
      setSecurityError('');
      setSecuritySuccess('');
      setDataError('');
      setDataSuccess('');
    }
  };

  const handleSave = async () => {
    if (activeSection === 'profile') {
      await handleProfileSave();
      return;
    }

    if (activeSection === 'organisation') {
      await handleOrganisationSave();
      return;
    }

    if (activeSection === 'notifications') {
      await handleNotificationsSave();
      return;
    }

    if (activeSection === 'appearance') {
      await handleAppearanceSave();
      return;
    }

    if (activeSection === 'security') {
      await handleSecuritySave();
      return;
    }

    handleGenericSave();
  };

  const profileCardName = buildFullName(profile.firstName, profile.lastName) || 'User';
  const profileCardRole = clean(profile.role) || 'Role not set';

  const renderContent = () => {
    switch (activeSection) {
      case 'profile': return (
        <div>
          {kicker('Profile Settings')}
          <h3 style={{ margin: '0 0 1.5rem', fontSize: '0.95rem', fontWeight: '700', color: '#e2e8f0' }}>Personal Information</h3>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handlePhotoSelection}
            style={{ display: 'none' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.75rem', padding: '1.25rem', background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.15)', borderRadius: '10px' }}>
            <img src={profile.avatarUrl || DEFAULT_AVATAR} alt={profileCardName} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #2563eb' }} />
            <div>
              <div style={{ fontSize: '1rem', fontWeight: '700', color: '#e2e8f0', marginBottom: '0.2rem' }}>{profileCardName}</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.5rem' }}>{profileCardRole}</div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{ fontSize: '0.72rem', padding: '0.3rem 0.75rem', borderRadius: '6px', background: 'transparent', border: '1px solid #2563eb', color: '#60a5fa', cursor: 'pointer' }}
              >
                Change Photo
              </button>
            </div>
          </div>
          {profileError ? (
            <div style={{ marginBottom: '1rem', padding: '0.75rem 0.9rem', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5', fontSize: '0.76rem' }}>
              {profileError}
            </div>
          ) : null}
          {isLoadingProfile ? (
            <div style={{ marginBottom: '1rem', color: '#94a3b8', fontSize: '0.78rem' }}>Loading profile…</div>
          ) : null}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            {[{ k: 'firstName', l: 'First Name' }, { k: 'lastName', l: 'Last Name' }].map(({ k, l }) => (
              <div key={k}>
                <label style={labelStyle}>{l}</label>
                <input value={profile[k as keyof ProfileState] as string} onChange={e => setProfile(p => ({ ...p, [k]: e.target.value }))} style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#2563eb')} onBlur={e => (e.target.style.borderColor = '#1e3a5f')} />
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            {[{ k: 'email', l: 'Email Address' }, { k: 'phone', l: 'Phone Number' }].map(({ k, l }) => (
              <div key={k}>
                <label style={labelStyle}>{l}</label>
                <input value={profile[k as keyof ProfileState] as string} onChange={e => setProfile(p => ({ ...p, [k]: e.target.value }))} style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#2563eb')} onBlur={e => (e.target.style.borderColor = '#1e3a5f')} />
              </div>
            ))}
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle}>Role / Title</label>
            <input value={profile.role} onChange={e => setProfile(p => ({ ...p, role: e.target.value }))} style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#2563eb')} onBlur={e => (e.target.style.borderColor = '#1e3a5f')} />
          </div>
        </div>
      );

      case 'organisation': return (
        <div>
          {kicker('Organisation Settings')}
          <h3 style={{ margin: '0 0 1.5rem', fontSize: '0.95rem', fontWeight: '700', color: '#e2e8f0' }}>Organisation Details</h3>
          {organisationError ? (
            <div style={{ marginBottom: '1rem', padding: '0.75rem 0.9rem', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5', fontSize: '0.76rem' }}>
              {organisationError}
            </div>
          ) : null}
          {isLoadingOrganisation ? (
            <div style={{ marginBottom: '1rem', color: '#94a3b8', fontSize: '0.78rem' }}>Loading organisation…</div>
          ) : null}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { k: 'name', l: 'Organisation Name' },
              { k: 'regNumber', l: 'Registration Number' },
              { k: 'industry', l: 'Industry' },
              { k: 'country', l: 'Country' },
              { k: 'timezone', l: 'Timezone' },
            ].map(({ k, l }) => (
              <div key={k}>
                <label style={labelStyle}>{l}</label>
                <input value={org[k as keyof OrganisationState]} onChange={e => setOrg(p => ({ ...p, [k]: e.target.value }))} style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#2563eb')} onBlur={e => (e.target.style.borderColor = '#1e3a5f')} />
              </div>
            ))}
          </div>
        </div>
      );

      case 'notifications': return (
        <div>
          {kicker('Notification Settings')}
          <h3 style={{ margin: '0 0 1.5rem', fontSize: '0.95rem', fontWeight: '700', color: '#e2e8f0' }}>Notification Preferences</h3>
          {notificationsError ? (
            <div style={{ marginBottom: '1rem', padding: '0.75rem 0.9rem', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5', fontSize: '0.76rem' }}>
              {notificationsError}
            </div>
          ) : null}
          {isLoadingNotifications ? (
            <div style={{ marginBottom: '1rem', color: '#94a3b8', fontSize: '0.78rem' }}>Loading notifications…</div>
          ) : null}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { k: 'emailReports', l: 'Email — New Reports', d: 'Receive an email when a new report is saved to the library' },
              { k: 'emailAdvisory', l: 'Email — Advisory Outputs', d: 'Notify when a new advisory output is generated' },
              { k: 'emailProjects', l: 'Email — Project Updates', d: 'Receive project status change notifications' },
              { k: 'urgencyAlerts', l: 'Urgency Alerts', d: 'Immediate alerts for high-urgency advisory flags' },
              { k: 'weeklyDigest', l: 'Weekly Digest', d: 'Summary of all activity sent every Monday morning' },
              { k: 'systemUpdates', l: 'System Updates', d: 'Platform updates, maintenance windows, and release notes' },
            ].map(({ k, l, d }) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid #1e3a5f' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '0.15rem' }}>{l}</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{d}</div>
                </div>
                <Toggle value={notifications[k as keyof NotificationState] as boolean} onChange={v => setNotifications(p => ({ ...p, [k]: v }))} />
              </div>
            ))}
          </div>
        </div>
      );

      case 'security': return (
        <div>
          {kicker('Security Settings')}
          <h3 style={{ margin: '0 0 1.5rem', fontSize: '0.95rem', fontWeight: '700', color: '#e2e8f0' }}>Account Security</h3>
          {securityError ? (
            <div style={{ marginBottom: '1rem', padding: '0.75rem 0.9rem', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5', fontSize: '0.76rem' }}>
              {securityError}
            </div>
          ) : null}
          {securitySuccess ? (
            <div style={{ marginBottom: '1rem', padding: '0.75rem 0.9rem', borderRadius: '8px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', color: '#86efac', fontSize: '0.76rem' }}>
              {securitySuccess}
            </div>
          ) : null}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid #1e3a5f' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '0.15rem' }}>Change Password</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '1rem' }}>Update your account password.</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.85rem' }}>
                <div>
                  <label style={labelStyle}>Current Password</label>
                  <input
                    type="password"
                    value={securityForm.currentPassword}
                    onChange={e => setSecurityForm(p => ({ ...p, currentPassword: e.target.value }))}
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#2563eb')}
                    onBlur={e => (e.target.style.borderColor = '#1e3a5f')}
                  />
                </div>
                <div>
                  <label style={labelStyle}>New Password</label>
                  <input
                    type="password"
                    value={securityForm.newPassword}
                    onChange={e => setSecurityForm(p => ({ ...p, newPassword: e.target.value }))}
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#2563eb')}
                    onBlur={e => (e.target.style.borderColor = '#1e3a5f')}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Confirm New Password</label>
                  <input
                    type="password"
                    value={securityForm.confirmPassword}
                    onChange={e => setSecurityForm(p => ({ ...p, confirmPassword: e.target.value }))}
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#2563eb')}
                    onBlur={e => (e.target.style.borderColor = '#1e3a5f')}
                  />
                </div>
              </div>
            </div>

            {[
              { label: 'Two-Factor Authentication', desc: '2FA is currently disabled. Enable for additional security.', action: 'Enable 2FA' },
              { label: 'Active Sessions', desc: '1 active session — Johannesburg, ZA · Chrome on macOS', action: 'Manage Sessions' },
              { label: 'Login History', desc: 'Last login: 2026-04-06 08:15 SAST', action: 'View History' },
            ].map(({ label, desc, action }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid #1e3a5f' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '0.15rem' }}>{label}</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{desc}</div>
                </div>
                <button style={{ padding: '0.45rem 0.9rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '500', cursor: 'pointer', background: 'transparent', border: '1px solid #1e3a5f', color: '#60a5fa' }}>{action}</button>
              </div>
            ))}
          </div>
        </div>
      );

      case 'appearance': return (
        <div>
          {kicker('Appearance Settings')}
          <h3 style={{ margin: '0 0 1.5rem', fontSize: '0.95rem', fontWeight: '700', color: '#e2e8f0' }}>Workspace Appearance</h3>
          {appearanceError ? (
            <div style={{ marginBottom: '1rem', padding: '0.75rem 0.9rem', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5', fontSize: '0.76rem' }}>
              {appearanceError}
            </div>
          ) : null}
          {isLoadingAppearance ? (
            <div style={{ marginBottom: '1rem', color: '#94a3b8', fontSize: '0.78rem' }}>Loading appearance…</div>
          ) : null}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Theme</label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {['dark', 'light', 'system'].map(theme => (
                <button key={theme} onClick={() => setAppearance(p => ({ ...p, theme }))}
                  style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '500', cursor: 'pointer', background: appearance.theme === theme ? 'rgba(37,99,235,0.15)' : 'rgba(255,255,255,0.02)', border: appearance.theme === theme ? '1px solid #2563eb' : '1px solid #1e3a5f', color: appearance.theme === theme ? '#60a5fa' : '#94a3b8', textTransform: 'capitalize' }}>
                  {theme}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Density</label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {['compact', 'comfortable', 'spacious'].map(d => (
                <button key={d} onClick={() => setAppearance(p => ({ ...p, density: d }))}
                  style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '500', cursor: 'pointer', background: appearance.density === d ? 'rgba(37,99,235,0.15)' : 'rgba(255,255,255,0.02)', border: appearance.density === d ? '1px solid #2563eb' : '1px solid #1e3a5f', color: appearance.density === d ? '#60a5fa' : '#94a3b8', textTransform: 'capitalize' }}>
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid #1e3a5f' }}>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: '500', color: '#e2e8f0' }}>Collapsed Sidebar</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Show icons only in the sidebar navigation</div>
            </div>
            <Toggle value={appearance.sidebarCollapsed} onChange={v => setAppearance(p => ({ ...p, sidebarCollapsed: v }))} />
          </div>
        </div>
      );

      case 'data': return (
        <div>
          {kicker('Data & Storage')}
          <h3 style={{ margin: '0 0 1.5rem', fontSize: '0.95rem', fontWeight: '700', color: '#e2e8f0' }}>Data Management</h3>
          {dataError ? (
            <div style={{ marginBottom: '1rem', padding: '0.75rem 0.9rem', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5', fontSize: '0.76rem' }}>
              {dataError}
            </div>
          ) : null}
          {dataSuccess ? (
            <div style={{ marginBottom: '1rem', padding: '0.75rem 0.9rem', borderRadius: '8px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', color: '#86efac', fontSize: '0.76rem' }}>
              {dataSuccess}
            </div>
          ) : null}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { key: 'exportReports', label: 'Export All Reports', desc: 'Download all saved reports as a JSON or CSV archive', action: 'Export', safe: true },
              { key: 'exportProjects', label: 'Export Project Data', desc: 'Download all project records and action items', action: 'Export', safe: true },
              { key: 'clearCache', label: 'Clear Advisory Cache', desc: 'Remove temporary advisory generation cache from local storage', action: 'Clear Cache', safe: true },
              { key: 'deleteReports', label: 'Delete All Reports', desc: 'Permanently remove all saved reports. This cannot be undone.', action: 'Delete All', safe: false },
              { key: 'resetOrganisation', label: 'Reset Organisation Data', desc: 'Wipe all organisation data and start fresh. Irreversible.', action: 'Reset', safe: false },
            ].map(({ key, label, desc, action, safe }) => {
              const isLiveAction = key === 'exportReports' || key === 'exportProjects' || key === 'clearCache';
              const isBusy = activeDataAction === key;
              return (
                <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: `1px solid ${safe ? '#1e3a5f' : 'rgba(239,68,68,0.2)'}` }}>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: '500', color: safe ? '#e2e8f0' : '#ef4444', marginBottom: '0.15rem' }}>{label}</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{desc}</div>
                  </div>
                  <button
                    onClick={() => {
                      if (!isLiveAction) return;
                      void runDataAction(key as 'exportReports' | 'exportProjects' | 'clearCache');
                    }}
                    disabled={!isLiveAction || isBusy}
                    style={{ padding: '0.4rem 0.875rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '500', cursor: !isLiveAction || isBusy ? 'not-allowed' : 'pointer', background: 'transparent', border: `1px solid ${safe ? '#1e3a5f' : 'rgba(239,68,68,0.4)'}`, color: safe ? '#60a5fa' : '#ef4444', whiteSpace: 'nowrap', opacity: !isLiveAction ? 0.55 : isBusy ? 0.7 : 1 }}>
                    {isBusy ? 'Working...' : action}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      );

      case 'api': return (
        <div>
          {kicker('API & Integrations')}
          <h3 style={{ margin: '0 0 1.5rem', fontSize: '0.95rem', fontWeight: '700', color: '#e2e8f0' }}>Connected Services</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { name: 'Supabase', desc: 'Database and authentication backend', status: 'Connected', color: '#22c55e' },
              { name: 'OpenAI API', desc: 'Advisory generation intelligence layer', status: 'Connected', color: '#22c55e' },
              { name: 'Slack', desc: 'Team notifications and alert routing', status: 'Not Connected', color: '#94a3b8' },
              { name: 'Google Workspace', desc: 'Calendar, Drive, and Docs integration', status: 'Not Connected', color: '#94a3b8' },
              { name: 'Zapier', desc: 'Workflow automation and third-party triggers', status: 'Not Connected', color: '#94a3b8' },
            ].map(({ name, desc, status, color }) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid #1e3a5f' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '0.15rem' }}>{name}</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{desc}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: '600', color }}>{status}</span>
                  <button style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '500', cursor: 'pointer', background: status === 'Connected' ? 'transparent' : '#2563eb', border: status === 'Connected' ? '1px solid #1e3a5f' : 'none', color: status === 'Connected' ? '#94a3b8' : '#fff' }}>
                    {status === 'Connected' ? 'Manage' : 'Connect'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <label style={labelStyle}>API Key</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input value="nxs_live_••••••••••••••••••••••••••••••••" readOnly style={{ ...inputStyle, flex: 1, color: '#94a3b8', fontFamily: 'monospace' }} />
              <button style={{ padding: '0.6rem 1rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '500', cursor: 'pointer', background: 'transparent', border: '1px solid #1e3a5f', color: '#60a5fa', whiteSpace: 'nowrap' }}>Reveal</button>
              <button style={{ padding: '0.6rem 1rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '500', cursor: 'pointer', background: 'transparent', border: '1px solid #1e3a5f', color: '#60a5fa', whiteSpace: 'nowrap' }}>Regenerate</button>
            </div>
          </div>
        </div>
      );

      default: return null;
    }
  };

  const saveDisabled =
    (activeSection === 'profile' && (isSavingProfile || isLoadingProfile)) ||
    (activeSection === 'organisation' && (isSavingOrganisation || isLoadingOrganisation)) ||
    (activeSection === 'notifications' && (isSavingNotifications || isLoadingNotifications)) ||
    (activeSection === 'appearance' && (isSavingAppearance || isLoadingAppearance)) ||
    (activeSection === 'security' && isSavingSecurity);

  return (
    <NexusShell>
      <div style={{ padding: '1.5rem 2rem 3rem' }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <div onMouseEnter={() => setHoveredCard('hero')} onMouseLeave={() => setHoveredCard(null)}
            style={{ background: 'linear-gradient(135deg, #0d1526 0%, #0f1e3a 100%)', border: `1px solid ${hoveredCard === 'hero' ? '#3b82f6' : '#1e3a5f'}`, borderLeft: '3px solid #2563eb', borderRadius: '12px', padding: '1.5rem 2rem', transition: 'all 0.2s ease', transform: hoveredCard === 'hero' ? 'translateY(-4px)' : 'translateY(0)', boxShadow: hoveredCard === 'hero' ? '0 8px 32px rgba(37,99,235,0.2)' : '0 2px 8px rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.25em', color: '#3b82f6', textTransform: 'uppercase', fontWeight: '600', marginBottom: '0.4rem' }}>Platform Configuration</div>
            <h1 style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', fontWeight: '800', color: '#e2e8f0' }}>NEXUS Settings</h1>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.6', maxWidth: '680px' }}>
              Manage your profile, organisation details, notification preferences, security settings, and platform integrations.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.25rem' }}>
          <div style={{ ...panel, padding: '1rem', height: 'fit-content' }}>
            {sections.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveSection(id)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.7rem 0.875rem', marginBottom: '0.2rem', borderRadius: '8px', background: activeSection === id ? 'rgba(37,99,235,0.15)' : 'transparent', color: activeSection === id ? '#60a5fa' : '#94a3b8', border: 'none', borderLeft: activeSection === id ? '3px solid #2563eb' : '3px solid transparent', fontSize: '0.82rem', fontWeight: activeSection === id ? '600' : '400', cursor: 'pointer', transition: 'all 0.2s ease', textAlign: 'left' as const }}>
                <Icon size={15} />{label}
              </button>
            ))}
          </div>

          <div style={panel}>
            {renderContent()}
            <div style={{ borderTop: '1px solid #1e3a5f', paddingTop: '1.25rem', marginTop: '0.5rem', display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => void handleSave()} disabled={saveDisabled}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.25rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '600', cursor: saveDisabled ? 'not-allowed' : 'pointer', background: saved ? '#22c55e' : '#2563eb', border: 'none', color: '#fff', transition: 'all 0.2s ease', opacity: saveDisabled ? 0.7 : 1 }}>
                <Save size={13} />
                {activeSection === 'profile' && isSavingProfile
                  ? 'Saving...'
                  : activeSection === 'organisation' && isSavingOrganisation
                    ? 'Saving...'
                    : activeSection === 'notifications' && isSavingNotifications
                      ? 'Saving...'
                      : activeSection === 'appearance' && isSavingAppearance
                        ? 'Saving...'
                        : activeSection === 'security' && isSavingSecurity
                          ? 'Saving...'
                          : saved
                            ? 'Saved!'
                            : 'Save Changes'}
              </button>
              <button onClick={handleCancel} style={{ padding: '0.65rem 1rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '500', cursor: 'pointer', background: 'transparent', border: '1px solid #1e3a5f', color: '#94a3b8' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </NexusShell>
  );
}
