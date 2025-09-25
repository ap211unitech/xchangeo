import { TriangleAlert } from "lucide-react";

type Props = {
  error: Error | null;
};

export const Error = ({ error }: Props) => {
  return (
    <div className="text-muted-foreground bg-card/40 flex h-[482px] w-full items-center justify-center">
      <TriangleAlert className="mr-2 size-6" />
      {error?.message ?? "An error occurred while fetching the data."}
    </div>
  );
};
