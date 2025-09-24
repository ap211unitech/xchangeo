import { TriangleAlert } from "lucide-react";

export const NoData = () => {
  return (
    <div className="text-muted-foreground bg-card/40 flex h-[430px] w-full items-center justify-center">
      <TriangleAlert className="mr-2 size-6" />
      No swap data available to display chart.
    </div>
  );
};
