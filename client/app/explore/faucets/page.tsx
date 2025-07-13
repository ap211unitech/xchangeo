import { Faucets } from "@/components/explore";
import { TSearchParams } from "@/types";

const FaucetsPage = ({ searchParams }: { searchParams: TSearchParams }) => {
  return <Faucets searchParams={searchParams} />;
};

export default FaucetsPage;
