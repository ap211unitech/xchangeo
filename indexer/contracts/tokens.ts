import { isLocalhost } from "./utils";

export const TOKENS = isLocalhost
  ? [
      {
        address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        startBlock: 0,
      },
      {
        address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        startBlock: 0,
      },
      {
        address: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
        startBlock: 0,
      },
      {
        address: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
        startBlock: 0,
      },
      {
        address: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
        startBlock: 0,
      },
      {
        address: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
        startBlock: 0,
      },
    ]
  : // contracts on sepolia
    [
      {
        address: "0x4854F674F5c26FF24Bda3F231177368B45C46aB3",
        startBlock: 9289313,
      },
      {
        address: "0x50E0F593305f2ba31AfB5F17De6C61390CaD2e4c",
        startBlock: 9289313,
      },
      {
        address: "0x5C7c5D30402c6f1AA21eC81c8E3CbFe50C38c6B8",
        startBlock: 9289313,
      },
      {
        address: "0x298858DDcFa8C475d6580b5D2Fcc4d8365A31Fb5",
        startBlock: 9289313,
      },
      {
        address: "0xeDcFf9982C22f64Afe248b8BD088Fc3c9863A8e3",
        startBlock: 9289313,
      },
      {
        address: "0x37af3A601301F858F8C1E89426459714eE8B69fe",
        startBlock: 9289313,
      },
    ];
