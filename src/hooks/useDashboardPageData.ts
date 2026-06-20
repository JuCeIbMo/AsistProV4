import { useCallback, useEffect, useRef, useState } from 'react';
import { checkAuth, logout as logoutSession } from '../services/authService';
import {
  fetchAppointments,
  fetchSummary,
  type Appointment,
  type DashboardSummary,
} from '../services/dashboardService';

export function useDashboardPageData(onUnauthorized: () => void) {
  const hasFetched = useRef(false);
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const [summaryResult, appointmentsResult] = await Promise.all([
        fetchSummary(),
        fetchAppointments({}),
      ]);

      if (!summaryResult.ok) {
        if (summaryResult.status === 'unauthorized') {
          onUnauthorized();
          return;
        }
        setError(true);
        setLoading(false);
        return;
      }

      if (!appointmentsResult.ok && appointmentsResult.status === 'unauthorized') {
        onUnauthorized();
        return;
      }

      setData(summaryResult.data);
      setAppointments(appointmentsResult.ok ? appointmentsResult.data.appointments : []);
      setLoading(false);
    } catch {
      setError(true);
      setLoading(false);
    }
  }, [onUnauthorized]);

  useEffect(() => {
    if (hasFetched.current) {
      return;
    }

    hasFetched.current = true;

    checkAuth().then(result => {
      if (!result.ok) {
        onUnauthorized();
        return;
      }

      setAuthChecking(false);
      load();
    });
  }, [load, onUnauthorized]);

  const logout = useCallback(async () => {
    await logoutSession();
  }, []);

  return { appointments, authChecking, data, error, load, loading, logout };
}
