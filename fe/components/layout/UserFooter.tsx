import { APP_NAME, PROJECT_COURSE, REGION_PROVINCES } from "@/lib/constants";

export function UserFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-slate-600 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p>
          {APP_NAME} - {PROJECT_COURSE}
        </p>
        <p>Phạm vi: {REGION_PROVINCES.join(" - ")}</p>
      </div>
    </footer>
  );
}
