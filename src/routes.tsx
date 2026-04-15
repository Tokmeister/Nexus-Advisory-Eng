import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { ProtectedRoute } from '@/lib/auth/auth-client';
import { SubscribedRoute } from '@/lib/billing';

const NotFoundPage = lazy(() => import('./pages/_404'));

// Public pages — no auth required
const LandingPage = lazy(() => import('./pages/landing'));
const LoginPage = lazy(() => import('./pages/login'));
const SignupPage = lazy(() => import('./pages/signup'));
const UpdatePasswordPage = lazy(() => import('./pages/update-password'));
const WelcomePage = lazy(() => import('./pages/welcome'));
const BillingPage = lazy(() => import('./pages/billing'));

const AboutPage = lazy(() => import('./pages/about'));
const FeaturesPage = lazy(() => import('./pages/features'));
const AdvisoryPlatformPage = lazy(() => import('./pages/advisory-platform'));
const ContactPage = lazy(() => import('./pages/contact'));
const SecurityPage = lazy(() => import('./pages/security'));
const PrivacyPage = lazy(() => import('./pages/privacy'));
const CookiesPage = lazy(() => import('./pages/cookies'));
const LegalPage = lazy(() => import('./pages/legal'));
const DevelopersPage = lazy(() => import('./pages/developers'));

// Protected dashboard pages — require auth
const DashboardPage = lazy(() => import('./pages/index'));
const AdvisoryPage = lazy(() => import('./pages/advisory'));
const ProjectsPage = lazy(() => import('./pages/projects'));
const ReportsPage = lazy(() => import('./pages/reports'));
const AnalyticsPage = lazy(() => import('./pages/analytics'));
const SettingsPage = lazy(() => import('./pages/settings'));

const protect = (el: React.ReactElement) => <ProtectedRoute>{el}</ProtectedRoute>;

const protectSubscribed = (el: React.ReactElement) => <SubscribedRoute>{el}</SubscribedRoute>;

export const routes: RouteObject[] = [
  // Public flow
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/update-password', element: <UpdatePasswordPage /> },
  { path: '/billing', element: protect(<BillingPage />) },
  { path: '/welcome', element: protectSubscribed(<WelcomePage />) },

  // Public footer pages
  { path: '/about', element: <AboutPage /> },
  { path: '/features', element: <FeaturesPage /> },
  { path: '/advisory-platform', element: <AdvisoryPlatformPage /> },
  { path: '/contact', element: <ContactPage /> },
  { path: '/security', element: <SecurityPage /> },
  { path: '/privacy', element: <PrivacyPage /> },
  { path: '/cookies', element: <CookiesPage /> },
  { path: '/legal', element: <LegalPage /> },
  { path: '/developers', element: <DevelopersPage /> },

  // Protected dashboard
  { path: '/dashboard', element: protectSubscribed(<DashboardPage />) },
  { path: '/advisory', element: protectSubscribed(<AdvisoryPage />) },
  { path: '/projects', element: protectSubscribed(<ProjectsPage />) },
  { path: '/reports', element: protectSubscribed(<ReportsPage />) },
  { path: '/analytics', element: protectSubscribed(<AnalyticsPage />) },
  { path: '/settings', element: protectSubscribed(<SettingsPage />) },

  { path: '*', element: <NotFoundPage /> },
];

export type Path =
  | '/'
  | '/login'
  | '/signup'
  | '/update-password'
  | '/billing'
  | '/welcome'
  | '/about'
  | '/features'
  | '/advisory-platform'
  | '/contact'
  | '/security'
  | '/privacy'
  | '/cookies'
  | '/legal'
  | '/developers'
  | '/dashboard'
  | '/advisory'
  | '/projects'
  | '/reports'
  | '/analytics'
  | '/settings';

export type Params = Record<string, string | undefined>;
