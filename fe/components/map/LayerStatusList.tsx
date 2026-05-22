import { CheckCircle2, CircleDashed, Database, MapPin, Route } from "lucide-react";
import Link from "next/link";
import { MAP_LAYERS, getLayerPointCount, type MapLayerId } from "@/lib/map-data";

const layerIcons = {
  destinations: MapPin,
  services: Database,
  route: Route,
} satisfies Record<MapLayerId, typeof MapPin>;

export function LayerStatusList() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {MAP_LAYERS.map((layer) => {
        const Icon = layerIcons[layer.id];

        return (
          <article
            key={layer.id}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <span
                className="flex size-11 items-center justify-center rounded-md text-white"
                style={{ backgroundColor: layer.color }}
              >
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-800">
                <CheckCircle2 className="size-3.5" aria-hidden="true" />
                {layer.status}
              </span>
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-950">{layer.label}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{layer.description}</p>

            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-500">Kiểu hình học</dt>
                <dd className="font-medium text-slate-900">{layer.geometry}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-500">Nguồn</dt>
                <dd className="font-medium text-slate-900">{layer.source}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-500">Số đối tượng</dt>
                <dd className="font-medium text-slate-900">{getLayerPointCount(layer.id)}</dd>
              </div>
            </dl>
          </article>
        );
      })}

      <article className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5">
        <span className="flex size-11 items-center justify-center rounded-md bg-slate-200 text-slate-700">
          <CircleDashed className="size-5" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-lg font-semibold text-slate-950">Ranh giới hành chính</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Lớp ranh giới tỉnh/thành sẽ được thay bằng GeoJSON từ backend khi nguồn dữ liệu chính thức
          được cung cấp.
        </p>
        <Link
          href="/map"
          className="mt-4 inline-flex rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white"
        >
          Xem bản đồ
        </Link>
      </article>
    </div>
  );
}
