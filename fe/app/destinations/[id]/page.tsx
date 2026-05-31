import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DestinationDetail } from "@/components/destinations/DestinationDetail";
import { UserLayout } from "@/components/layout/UserLayout";

type DestinationDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DestinationDetailPage({ params }: DestinationDetailPageProps) {
  const { id } = await params;

  return (
    <UserLayout>
      <main className="min-h-screen bg-brand-background py-6">
        <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6 lg:px-8">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-brand-primary"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Quay lại danh sách điểm đến
          </Link>

          <DestinationDetail id={id} />
        </div>
      </main>
    </UserLayout>
  );
}
