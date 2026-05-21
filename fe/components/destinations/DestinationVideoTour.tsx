"use client";

import { Video, Film } from "lucide-react";

interface DestinationVideoTourProps {
  videoUrl: string;
  destinationName: string;
}

export function DestinationVideoTour({ videoUrl, destinationName }: DestinationVideoTourProps) {
  return (
    <div className="bg-brand-surface-lowest rounded-brand-card p-6 md:p-8 border border-brand-outline-variant/30 shadow-sm transition-all">
      <h2 className="text-xl font-bold text-brand-primary border-b border-brand-outline-variant/20 pb-3 flex items-center gap-2 mb-4">
        <Video className="size-5 text-brand-primary" /> Video Tour địa điểm
      </h2>
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-inner bg-slate-950 border border-slate-800 group">
        {/* Cinematic dark frame wrapper */}
        <iframe
          src={videoUrl}
          title={`Video tour ${destinationName}`}
          className="absolute inset-0 w-full h-full border-0 transition-all duration-300"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>

        {/* Ambient watermark icon */}
        <div className="absolute top-3 right-3 bg-black/60 text-white rounded-lg p-1.5 backdrop-blur-md opacity-30 hover:opacity-100 transition-opacity pointer-events-none">
          <Film className="size-4" />
        </div>
      </div>
    </div>
  );
}
