import { DestinationForm } from "@/components/admin/DestinationForm";
import { mockDestinations } from "@/lib/admin-data";

interface EditDestinationPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDestinationPage({ params }: EditDestinationPageProps) {
  const { id } = await params;
  const destination = mockDestinations.find((d) => d.id === id);

  if (!destination) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-slate-950">Không tìm thấy</h1>
          <p className="mt-2 text-slate-600">Điểm du lịch không tồn tại.</p>
        </div>
      </div>
    );
  }

  return (
    <DestinationForm
      initialData={{
        name: destination.name,
        province: destination.province,
        category: destination.category,
        address: destination.address,
        latitude: destination.latitude.toString(),
        longitude: destination.longitude.toString(),
        ticket_price: destination.ticket_price.toString(),
        open_time: destination.open_time,
        close_time: destination.close_time,
        description: destination.description,
      }}
      isEditing
    />
  );
}
