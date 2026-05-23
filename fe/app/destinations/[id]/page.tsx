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
      <DestinationDetail id={id} />
    </UserLayout>
  );
}
