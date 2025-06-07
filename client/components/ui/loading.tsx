import { XchangeoLogo } from "@/components/ui";

export const Loading = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 [&_div]:h-16 [&_div]:w-16">
      <div className="animate-pulse">
        <XchangeoLogo />
      </div>
      <span>Loading . . .</span>
    </div>
  );
};
