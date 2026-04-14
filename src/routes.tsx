import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { ProtectedRoute } from '@/lib/auth/auth-client';
import { SubscribedRoute } from '@/lib/billing';

const NotFoundPage = lazy(() => import('./pages/_404'));

// Public pages — no auth required
const LandingPage   = lazy(() => import('./pages/landing'));
const LoginPage     = lazy(() => import('./pages/login'));
const SignupPage    = lazy(() => import('./pages/signup'));
const UpdatePasswordPage = lazy(() => import('./pages/update-password'));
const WelcomePage   = lazy(() => import('./pages/welcome'));
const BillingPage   = lazy(() => import('./pages/billing'));

// Protected dashboard pages — require auth
const DashboardPage  = lazy(() => import('./pages/index'));
const AdvisoryPage   = lazy(() => import('./pages/advisory'));
const ProjectsPage   = lazy(() => import('./pages/projects'));
const ReportsPage    = lazy(() => import('./pages/reports'));
const AnalyticsPage  = lazy(() => import('./pages/analytics'));
const SettingsPage   = lazy(() => import('./pages/settings'));

const protect = (el: React.ReactElement) => (
  <ProtectedRoute>{el}</ProtectedRoute>
);

const protectSubscribed = (el: React.ReactElement) => (
  <SubscribedRoute>{el}</SubscribedRoute>
);

export const routes: RouteObject[] = [
  // Public flow
  { path: '/',                element: <LandingPage /> },
  { path: '/login',           element: <LoginPage /> },
  { path: '/signup',          element: <SignupPage /> },
  { path: '/update-password', element: <UpdatePasswordPage /> },
  { path: '/billing',         element: protect(<BillingPage />) },
  { path: '/welcome',         element: protectSubscribed(<WelcomePage />) },

  // Protected dashboard
  { path: '/dashboard',       element: protectSubscribed(<DashboardPage />) },
  { path: '/advisory',        element: protectSubscribed(<AdvisoryPage />) },
  { path: '/projects',        element: protectSubscribed(<ProjectsPage />) },
  { path: '/reports',         element: protectSubscribed(<ReportsPage />) },
  { path: '/analytics',       element: protectSubscribed(<AnalyticsPage />) },
  { path: '/settings',        element: protectSubscribed(<SettingsPage />) },

  { path: '*', element: <NotFoundPage /> },
];

export type Path = '/' | '/login' | '/signup' | '/update-password' | '/billing' | '/welcome' | '/dashboard' | '/advisory' | '/projects' | '/reports' | '/analytics' | '/settings';
export type Params = Record<string, string | undefined>;
