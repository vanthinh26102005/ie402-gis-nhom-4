import { DestinationEditor } from "@/components/admin/DestinationEditor";

interface EditDestinationPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDestinationPage({ params }: EditDestinationPageProps) {
  const { id } = await params;
  return <DestinationEditor destinationId={id} />;
}
