"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type {
  DestinationFeatureProperties,
  GeoJsonFeatureCollection,
  GeoJsonLineString,
  ServiceFeatureProperties,
} from "@/lib/gis";
import { fetchDestinationFeatures, fetchServiceFeatures } from "@/lib/gis";

const TourismLeafletMap = dynamic(
  () => import("@/components/map/TourismLeafletMap").then((mod) => mod.TourismLeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[520px] items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600">
        Đang tải bản đồ...
      </div>
    ),
  },
);

const emptyDestinations: GeoJsonFeatureCollection<DestinationFeatureProperties> = {
  type: "FeatureCollection",
  features: [],
};

const emptyServices: GeoJsonFeatureCollection<ServiceFeatureProperties> = {
  type: "FeatureCollection",
  features: [],
};

type MapViewProps = {
  routeGeometry?: GeoJsonLineString | null;
};

export function MapView({ routeGeometry }: MapViewProps) {
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
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Không thể tải dữ liệu bản đồ.",
          );
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

  if (isLoading) {
    return (
      <div className="flex min-h-[520px] items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600">
        Đang tải dữ liệu GIS...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        {error}
      </div>
    );
  }

  return (
    <TourismLeafletMap
      destinations={destinations}
      services={services}
      routeGeometry={routeGeometry}
    />
  );
}
