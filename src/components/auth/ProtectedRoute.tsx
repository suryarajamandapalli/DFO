import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { AppRole } from '../../contexts/AuthContext';
import { Activity } from 'lucide-react';

interface ProtectedRouteProps {
  requireRole?: AppRole; // If specified, user must have this specific role (for dashboards)
}

export function ProtectedRoute({ requireRole }: ProtectedRouteProps) {
  const { user, profile, onboardingState, isLoading } = useAuth();
  const location = useLocation();

  // 0. Global Loading State Skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Activity className="w-12 h-12 text-sky-500 animate-pulse mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Establishing Secure Connection...</p>
      </div>
    );
  }

  // 1. Not Logged In
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Logged In, but No Role yet
  if (!profile?.role) {
    if (location.pathname !== '/select-role') {
      return <Navigate to="/select-role" replace />;
    }
    // They are correctly on select-role, allow render
    return <Outlet />;
  }

  // 3. Logged in, Role Selected, but Onboarding Not Completed
  if (!onboardingState?.completed) {
    const correctOnboardingPath = `/onboarding/${profile.role}`;
    
    // Push them to their specific onboarding path if they aren't there
    if (location.pathname !== correctOnboardingPath) {
      return <Navigate to={correctOnboardingPath} replace />;
    }
    
    // They are on their correct onboarding form, allow render
    return <Outlet />;
  }

  // 4. Role mismatch (Trying to access a different dashboard or wrong path)
  if (requireRole && profile.role !== requireRole) {
    return <Navigate to={`/dashboard/${profile.role}`} replace />;
  }

  // 5. If they are fully onboarded but manually navigate backwards to auth/onboarding routes
  if (location.pathname === '/select-role' || location.pathname.startsWith('/onboarding')) {
    return <Navigate to={`/dashboard/${profile.role}`} replace />;
  }

  // All checks passed!
  return <Outlet />;
}
