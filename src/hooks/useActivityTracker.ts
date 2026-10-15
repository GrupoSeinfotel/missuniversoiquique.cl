"use client";
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function useActivityTracker() {
  const activeSeconds = useRef(0);
  const lastActiveTime = useRef(Date.now());
  const isTracking = useRef(false);
  const pathname = usePathname();

  useEffect(() => {
    // Only track if on the dashboard
    if (typeof window === 'undefined' || !pathname?.startsWith('/dashboard')) return;

    const handleActivity = () => {
      lastActiveTime.current = Date.now();
      if (!isTracking.current) {
        isTracking.current = true;
      }
    };

    const sendPing = async (minutes: number) => {
      try {
        await fetch('/api/candidate/ping', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ activeMinutes: minutes }),
          keepalive: true, // Fire-and-forget even on unload
        });
      } catch (error) {
        console.error('Ping failed', error);
      }
    };

    // Check activity every 10 seconds
    const intervalId = setInterval(() => {
      const now = Date.now();
      // If user interacted within the last 60 seconds, considering them active
      if (now - lastActiveTime.current < 60000) {
        activeSeconds.current += 10;
      }

      // Every 5 minutes of accumulated active time, send ping
      if (activeSeconds.current >= 300) {
        const minutes = Math.floor(activeSeconds.current / 60);
        sendPing(minutes);
        activeSeconds.current = activeSeconds.current % 60; // keep remainder
      }
    }, 10000);

    // To optimize and maintain "Real-time" indicator:
    // We send a ping every 2 minutes regardless, passing full minutes if available
    const pingIntervalId = setInterval(() => {
      if (Date.now() - lastActiveTime.current < 120000) {
         let minutesToSend = 0;
         if (activeSeconds.current >= 60) {
             minutesToSend = Math.floor(activeSeconds.current / 60);
             activeSeconds.current = activeSeconds.current % 60;
         }
         sendPing(minutesToSend);
      }
    }, 120000); // Send status every 2 mins to keep the "Online Status" fresh

    const handleBeforeUnload = () => {
      if (activeSeconds.current >= 60) {
        const minutes = Math.floor(activeSeconds.current / 60);
        sendPing(minutes);
      } else if (Date.now() - lastActiveTime.current < 60000) {
        sendPing(0);
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Initial ping
    sendPing(0);

    return () => {
      clearInterval(intervalId);
      clearInterval(pingIntervalId);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname]);
}
