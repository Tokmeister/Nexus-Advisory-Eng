NEXUS OFFLINE DEMO TEST

This package is patched for offline/local browser testing of the UI flow.

What works in demo mode:
- Sign up (stores demo user in browser localStorage)
- Log in (uses demo credentials)
- Welcome animation
- Protected pages like Dashboard, Advisory, Projects, Reports, Analytics, Settings
- Log out
- Local password reset

What does NOT work yet:
- Real Supabase auth
- Real database writes
- Real advisory/report/project generation

How to test locally:
1. Open a terminal in this project folder
2. Run: npm install
3. Run: npm run dev
4. Open the local URL shown by Vite

Recommended flow:
1. Sign up with a demo account
2. Log in with the same credentials
3. Test the shell and protected routes
