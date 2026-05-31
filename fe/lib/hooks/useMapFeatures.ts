"use client";

import { useEffect, useState } from "react";
import { fetchDestinationFeatures, fetchServiceFeatures } from "@/lib/api/geo";
import type { DestinationFeatureProperties } from "@/lib/types/destination";
import type { GeoJsonFeatureCollection } from "@/lib/types/geojson";
import type { ServiceFeatureProperties } from "@/lib/types/service";

const emptyDestinations: GeoJsonFeatureCollection<DestinationFeatureProperties> = {
  type: "FeatureCollection",
  features: [],
};

const emptyServices: GeoJsonFeatureCollection<ServiceFeatureProperties> = {
  type: "FeatureCollection",
  features: [],
};

export function useMapFeatures() {
  const [destinations, setDestinations] = useState(emptyDestinations);
  const [services, setServices] = useState(emptyServices);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadMapData() {
      try {
        setIsLoading(true);
        setError(null);
        const [destinationFeatures, serviceFeatures] = await Promise.all([
          fetchDestinationFeatures(),
          fetchServiceFeatures(),
        ]);

        if (isMounted) {
          setDestinations(destinationFeatures);
          setServices(serviceFeatures);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : "Không thể tải dữ liệu bản đồ.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadMapData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { destinations, error, isLoading, services };
}
