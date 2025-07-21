import { Loader2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui";

export const Loading = () => {
  return (
    <Card className="shadow-md md:mx-auto md:max-w-3/4">
      <CardContent className="grid min-h-[19rem] place-content-center gap-2">
        <Loader2 className="size-10 w-full animate-spin" />
        <span className="text-base">Loading...</span>
      </CardContent>
    </Card>
  );
};
