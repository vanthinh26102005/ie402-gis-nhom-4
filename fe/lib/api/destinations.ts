import { fetchApi } from "@/lib/api/client";
import type { DestinationDetail, DestinationSummary } from "@/lib/types/destination";

export async function fetchDestinations() {
  return fetchApi<DestinationSummary[]>("/destinations?limit=100");
}

export async function fetchDestinationDetail(id: string) {
  return fetchApi<DestinationDetail>(`/destinations/${id}`);
}

export async function getDestinations(filters?: {
  keyword?: string;
  province?: string;
  category?: string;
}) {
  const destinations = await fetchDestinations();
  const keyword = filters?.keyword?.trim().toLowerCase() ?? "";

  return destinations.filter((destination) => {
    const matchesKeyword = keyword
      ? [
          destination.name,
          destination.description,
          destination.address,
          destination.province.name,
          destination.category?.name,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(keyword))
      : true;
    const matchesProvince = filters?.province
      ? destination.province.name === filters.province || destination.province.code === filters.province
      : true;
    const matchesCategory = filters?.category
      ? destination.category?.name === filters.category
      : true;

    return matchesKeyword && matchesProvince && matchesCategory;
  });
}

export async function getDestinationById(id: string) {
  try {
    return await fetchDestinationDetail(id);
  } catch {
    return null;
  }
}
