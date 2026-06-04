"use client";

import { useEffect, useState } from "react";
import { fetchDestinations } from "@/lib/api/destinations";
import type { DestinationSummary } from "@/lib/types/destination";

export function useDestinations() {
  const [destinations, setDestinations] = useState<DestinationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDestinations() {
      try {
        setIsLoading(true);
        setError(null);
        const items = await fetchDestinations();
        if (isMounted) {
          setDestinations(items);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : "Không thể tải danh sách địa điểm.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDestinations();

    return () => {
      isMounted = false;
    };
  }, []);

  return { destinations, error, isLoading };
}
