import { PoolInfo } from "@/components/pool";

const PoolInfoPage = async ({ params }: { params: Promise<{ poolAddress: string }> }) => {
  const poolAddress = (await params).poolAddress;

  return <PoolInfo poolAddress={poolAddress} />;
};

export default PoolInfoPage;
