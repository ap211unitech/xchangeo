import { isLocalhost } from "./utils";

export const FAUCETS = isLocalhost
  ? [
      {
        address: "0x0165878A594ca255338adfa4d48449f69242Eb8F",
        startBlock: 0,
      },
      {
        address: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
        startBlock: 0,
      },
      {
        address: "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
        startBlock: 0,
      },
      {
        address: "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",
        startBlock: 0,
      },
      {
        address: "0x610178dA211FEF7D417bC0e6FeD39F05609AD788",
        startBlock: 0,
      },
      {
        address: "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e",
        startBlock: 0,
      },
    ]
  : // contracts on sepolia
    [
      {
        address: "0x42dA0Dee05ABE99F11C73d9E1dfC7b43130C35e1",
        startBlock: 9289313,
      },
      {
        address: "0x99B8b358A1098529c11dc148621b39dDc0168Cc5",
        startBlock: 9289313,
      },
      {
        address: "0x34e74cE0c019C80643Afaa403f51C92D48A98Ca3",
        startBlock: 9289313,
      },
      {
        address: "0x306E3bEbe6D82850178269A48B220cbbFCd93311",
        startBlock: 9289313,
      },
      {
        address: "0x57911E20A857C28E082f30145bBcb1659Fdc7f1F",
        startBlock: 9289313,
      },
      {
        address: "0x71CaC24D3FfC2987CEFFa2B1e130DEa3D3B913F0",
        startBlock: 9289313,
      },
    ];
