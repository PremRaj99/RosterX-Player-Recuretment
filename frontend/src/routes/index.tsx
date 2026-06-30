import { createBrowserRouter } from 'react-router-dom';

import ProtectedLayout from '@/layouts/ProtectedLayout';
import RootLayout from '@/layouts/rootLayout';

import Home from '@/pages/Home';
import NotFound from '@/pages/Not-Found';
import AuthLayout from '@/layouts/AuthLayout';
import Register from '@/pages/Register';
import LoginPage from '@/pages/Login';
import { OrgDashboard } from '@/pages/OrgDashboard';
import { SubscriptionPage } from '@/pages/Subscription';
import OrganizerLayout from '@/layouts/OrganizerLayout';
import PlayerLayout from '@/layouts/PlayerLayout';
import PlayerProfile from '@/pages/Players/Profile';
import Players from '@/pages/Players';
import Teams from '@/pages/Teams';
import TeamProfile from '@/pages/Teams/Team';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <Home /> },
      {
        element: <AuthLayout />,
        children: [
          { path: 'login', element: <LoginPage /> },
          { path: 'register', element: <Register /> },
        ],
      },
      {
        element: <ProtectedLayout />,
        children: [
          {
            path: 'organizer',
            element: <OrganizerLayout />,
            children: [{ path: 'dashboard', element: <OrgDashboard /> }],
          },
          {
            path: 'player',
            element: <PlayerLayout />,
            children: [
              { path: 'dashboard', element: <div>Player Dashboard</div> },
              { path: 'subscription', element: <SubscriptionPage /> },
            ],
          },
          { path: 'players', element: <Players /> },
          { path: 'player/profile/:id', element: <PlayerProfile /> },
          { path: 'teams', element: <Teams /> },
          { path: 'team/:id', element: <TeamProfile /> },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
