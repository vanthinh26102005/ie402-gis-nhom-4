"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DestinationForm } from "@/components/admin/DestinationForm";
import {
  createAdminDestination,
  getAdminCategories,
  getAdminDestination,
  getAdminProvinces,
  updateAdminDestination,
  type AdminCategory,
  type AdminDestination,
  type AdminDestinationPayload,
  type AdminProvince,
} from "@/lib/api/admin";

type DestinationEditorProps = {
  destinationId?: string;
};

type EditorData = {
  categories: AdminCategory[];
  destination: AdminDestination | null;
  provinces: AdminProvince[];
};

const emptyEditorData: EditorData = {
  categories: [],
  destination: null,
  provinces: [],
};

export function DestinationEditor({ destinationId }: DestinationEditorProps) {
  const router = useRouter();
  const [data, setData] = useState<EditorData>(emptyEditorData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadEditorData() {
      try {
        setIsLoading(true);
        setLoadError(null);
        const [categories, provinces, destination] = await Promise.all([
          getAdminCategories(),
          getAdminProvinces(),
          destinationId ? getAdminDestination(destinationId) : Promise.resolve(null),
        ]);

        if (!isMounted) return;
        setData({
          categories,
          destination,
          provinces,
        });
      } catch (error) {
        if (isMounted) {
          setLoadError(error instanceof Error ? error.message : "Không thể tải dữ liệu form điểm du lịch.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadEditorData();

    return () => {
      isMounted = false;
    };
  }, [destinationId]);

  async function handleSubmit(payload: AdminDestinationPayload) {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      if (destinationId) {
        await updateAdminDestination(destinationId, payload);
      } else {
        await createAdminDestination(payload);
      }

      router.push("/admin/destinations");
      router.refresh();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Không thể lưu điểm du lịch.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm font-semibold text-slate-600 shadow-sm">
        Đang tải dữ liệu form điểm du lịch…
      </div>
    );
  }

  if (loadError) {
    return (
      <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        {loadError}
      </div>
    );
  }

  return (
    <DestinationForm
      key={data.destination?.id || "new-destination"}
      categories={data.categories}
      initialData={data.destination}
      isEditing={Boolean(destinationId)}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      provinces={data.provinces}
      submitError={submitError}
    />
  );
}
