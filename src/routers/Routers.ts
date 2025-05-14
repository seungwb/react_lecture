import { Dashboard } from '../pages/Dashboard';
import { Login } from './../pages/Login';
import { createBrowserRouter, type RouteObject } from 'react-router-dom';

const routers: RouteObject[] = [
  { path: '/', Component: Login },
  {
    path: '/react',
    Component: Dashboard,
  },
];

export const Routers = createBrowserRouter(routers);
