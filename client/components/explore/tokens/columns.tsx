import { createColumnHelper } from "@tanstack/react-table";

import { Button } from "@/components/ui";

type Token = {
  name: string;
  ticker: string;
  contractAddress: string;
  logo: string;
};

const columnHelper = createColumnHelper<Token>();

export const columns = [
  columnHelper.accessor(row => row, {
    id: "tokenInfo",
    header: () => <span>Token Info</span>,
    cell: info => (
      <span>
        {info.getValue().name} {info.getValue().ticker}
      </span>
    ),
    footer: e => e.column.id,
  }),
  columnHelper.accessor(row => row, {
    id: "balance",
    header: () => <span>Balance</span>,
    cell: info => <span>0.49 {info.getValue().ticker}</span>,
    footer: e => e.column.id,
  }),
  columnHelper.accessor(row => row, {
    id: "actions",
    header: () => <span className="text-right">Actions</span>,
    cell: () => <Button variant="secondary">Add to wallet</Button>,
    footer: e => e.column.id,
  }),
];
