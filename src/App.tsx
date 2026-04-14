import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, useLocation, Outlet } from 'react-router-dom';

import CookieBannerErrorBoundary from '@/components/CookieBannerErrorBoundary';
import Spinner from './components/Spinner';
import { routes } from './routes';

const CookieBanner = lazy(() =>
  import('@/components/CookieBanner').catch((error) => {
    console.warn('Failed to load CookieBanner:', error);
    return { default: () => null };
  })
);

const STANDALONE_PATHS = [
  '/',
  '/login',
  '/signup',
  '/update-password',
  '/billing',
  '/welcome',
  '/dashboard',
  '/advisory',
  '/projects',
  '/reports',
  '/analytics',
  '/settings',
];

const SpinnerFallback = () => (
  <div className="flex justify-center py-8 h-screen items-center">
    <Spinner />
  </div>
);

function LayoutRouter() {
  const location = useLocation();
  const isStandalone = STANDALONE_PATHS.includes(location.pathname);

  if (isStandalone) {
    return <Outlet />;
  }

  const RootLayout = lazy(() => import('./layouts/RootLayout'));
  return (
    <Suspense fallback={<SpinnerFallback />}>
      <RootLayout>
        <Outlet />
      </RootLayout>
    </Suspense>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<SpinnerFallback />}>
        <LayoutRouter />
      </Suspense>
    ),
    children: routes,
  },
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <CookieBannerErrorBoundary>
        <Suspense fallback={null}>
          <CookieBanner />
        </Suspense>
      </CookieBannerErrorBoundary>
    </>
  );
}
