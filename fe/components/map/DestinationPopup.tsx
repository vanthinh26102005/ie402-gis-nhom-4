"use client";

import Link from "next/link";
import type {
  DestinationFeatureProperties,
  ServiceFeatureProperties,
} from "@/lib/gis";

type DestinationPopupProps = {
  properties: DestinationFeatureProperties;
};

type ServicePopupProps = {
  properties: ServiceFeatureProperties;
};

export function DestinationPopup({ properties }: DestinationPopupProps) {
  return (
    <div className="space-y-2">
      <div>
        <p className="text-sm font-semibold text-slate-950">{properties.name}</p>
        <p className="text-xs text-slate-600">
          {properties.categoryName || "Địa điểm"} - {properties.provinceName}
        </p>
      </div>
      {properties.description ? (
        <p className="text-xs leading-5 text-slate-600">{properties.description}</p>
      ) : null}
      <Link
        href={`/destinations/${properties.id}`}
        className="inline-flex rounded-md bg-blue-700 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-800"
      >
        Xem chi tiết
      </Link>
    </div>
  );
}

export function ServicePopup({ properties }: ServicePopupProps) {
  return (
    <div className="space-y-2">
      <div>
        <p className="text-sm font-semibold text-slate-950">{properties.name}</p>
        <p className="text-xs text-slate-600">
          {properties.type.replace("_", " ")} - {properties.provinceName}
        </p>
      </div>
      {properties.address ? (
        <p className="text-xs leading-5 text-slate-600">{properties.address}</p>
      ) : null}
      {properties.phone ? (
        <p className="text-xs font-medium text-slate-700">{properties.phone}</p>
      ) : null}
    </div>
  );
}
