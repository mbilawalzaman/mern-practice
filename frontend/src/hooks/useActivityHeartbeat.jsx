import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { clearTokens, getAccessToken } from "../utils/tokenStorage";
import { refreshTokens } from "../services/api";

const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];
const IDLE_LIMIT_MS = 15 * 60 * 1000;
const REFRESH_INTERVAL_MS = 5 * 60 * 1000;
const HEARTBEAT_CHECK_MS = 60 * 1000;

const useActivityHeartbeat = (enabled) => {
  const navigate = useNavigate();
  const lastActiveRef = useRef(Date.now());
  const lastRefreshRef = useRef(Date.now());

  useEffect(() => {
    if (!enabled) return;

    const handleActivity = () => {
      lastActiveRef.current = Date.now();
    };

    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, handleActivity));

    const intervalId = setInterval(async () => {
      if (!getAccessToken()) {
        clearTokens();
        navigate("/login");
        return;
      }

      const now = Date.now();
      const idleTime = now - lastActiveRef.current;

      if (idleTime >= IDLE_LIMIT_MS) {
        clearTokens();
        navigate("/login");
        return;
      }

      const sinceRefresh = now - lastRefreshRef.current;
      if (sinceRefresh >= REFRESH_INTERVAL_MS) {
        try {
          await refreshTokens();
          lastRefreshRef.current = Date.now();
        } catch (error) {
          clearTokens();
          navigate("/login");
        }
      }
    }, HEARTBEAT_CHECK_MS);

    return () => {
      clearInterval(intervalId);
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, handleActivity));
    };
  }, [enabled, navigate]);
};

export default useActivityHeartbeat;
