import { createBrowserRouter } from 'react-router-dom';

import RootLayout from '@/layouts/rootLayout';
import AuthLayout from '@/layouts/AuthLayout';
import ProtectedLayout from '@/layouts/ProtectedLayout';
import PlayerLayout from '@/layouts/PlayerLayout';
import OrganizerLayout from '@/layouts/OrganizerLayout';

// Public pages
import Home from '@/pages/Home';
import LoginPage from '@/pages/Login';
import Register from '@/pages/Register';
import RecruitmentBoardPage from '@/pages/Board';
import PlayerProfilePage from '@/pages/Players/Profile';
import OrgProfilePage from '@/pages/OrgProfile';
import NotFound from '@/pages/Not-Found';

// Common protected pages
import OnboardingPage from '@/pages/Onboarding';
import SettingsPage from '@/pages/Settings';
import InboxPage from '@/pages/Inbox';
import NotificationsPage from '@/pages/Notifications';

// Player-only pages
import PlayerDashboard from '@/pages/PlayerDashboard';
import EditProfilePage from '@/pages/Players/EditProfile';
import ApplyPage from '@/pages/Board/Apply';

// Organizer-only pages
import OrgDashboard from '@/pages/OrgDashboard';
import ManageTeamsPage from '@/pages/OrgDashboard/ManageTeams';
import ManageRecruitmentsPage from '@/pages/OrgDashboard/ManageRecruitments';
import OrgApplicationsPage from '@/pages/OrgDashboard/Applications';
import PlayersPage from '@/pages/Players'; // Scout page

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // 1. Public Routes
      { path: '/', element: <Home /> },
      {
        element: <AuthLayout />,
        children: [
          { path: 'login', element: <LoginPage /> },
          { path: 'register', element: <Register /> },
        ],
      },
      { path: 'board', element: <RecruitmentBoardPage /> },
      { path: 'player/:id', element: <PlayerProfilePage /> },
      { path: 'org/:slug', element: <OrgProfilePage /> },

      // 2. Protected Routes (Common)
      {
        element: <ProtectedLayout />,
        children: [
          { path: 'onboarding', element: <OnboardingPage /> },
          { path: 'settings', element: <SettingsPage /> },
          { path: 'inbox', element: <InboxPage /> },
          { path: 'notifications', element: <NotificationsPage /> },

          // 3. Player-only Routes
          {
            element: <PlayerLayout />,
            children: [
              { path: 'dashboard', element: <PlayerDashboard /> },
              { path: 'profile/edit', element: <EditProfilePage /> },
              { path: 'board/:id/apply', element: <ApplyPage /> },
            ],
          },

          // 4. Organizer-only Routes
          {
            element: <OrganizerLayout />,
            children: [
              { path: 'org/dashboard', element: <OrgDashboard /> },
              { path: 'org/teams/manage', element: <ManageTeamsPage /> },
              { path: 'org/recruitments/manage', element: <ManageRecruitmentsPage /> },
              { path: 'org/applications', element: <OrgApplicationsPage /> },
              { path: 'scout', element: <PlayersPage /> }, // Player discovery
            ],
          },
        ],
      },

      { path: '*', element: <NotFound /> },
    ],
  },
]);
