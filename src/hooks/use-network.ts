"use client";

import { useState, useEffect } from "react";

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  const [connectionQuality, setConnectionQuality] = useState("unknown");

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const connection =
      "connection" in navigator && (navigator as any).connection;

    if (connection) {
      const updateConnectionQuality = () => {
        const { effectiveType, downlink, rtt } = connection;

        if (effectiveType === "4g" && downlink > 5 && rtt < 100) {
          setConnectionQuality("high");
        } else if (effectiveType === "4g" || effectiveType === "3g") {
          setConnectionQuality("medium");
        } else {
          setConnectionQuality("low");
        }
      };

      updateConnectionQuality();
      connection.addEventListener("change", updateConnectionQuality);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
        connection.removeEventListener("change", updateConnectionQuality);
      };
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return { isOnline, connectionQuality };
}
