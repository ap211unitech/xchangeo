import { isLocalhost } from "./utils";

export const POOLS = isLocalhost
  ? [
      {
        address: "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0",
        startBlock: 0,
      },
      {
        address: "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82",
        startBlock: 0,
      },
      {
        address: "0x9A676e781A523b5d0C0e43731313A708CB607508",
        startBlock: 0,
      },
      {
        address: "0x0B306BF915C4d645ff596e518fAf3F9669b97016",
        startBlock: 0,
      },
      {
        address: "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1",
        startBlock: 0,
      },
      {
        address: "0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE",
        startBlock: 0,
      },
    ]
  : // contracts on sepolia
    [
      {
        address: "0x877303A3a0F7d4ce6307834a34168DcC41642afD",
        startBlock: 9289313,
      },
      {
        address: "0xA391760a43672061297D326F7703223145240989",
        startBlock: 9289313,
      },
      {
        address: "0x27418f3BaC291d24Fd7Cb252906F20f5Fc006Fd9",
        startBlock: 9289313,
      },
      {
        address: "0x55FEB15bB7a5e84733C905f6878f96e5e4274995",
        startBlock: 9289313,
      },
      {
        address: "0xf6F61B54B7bbe655cEAC5Dc6c161AF0d3B5B1C17",
        startBlock: 9289313,
      },
      {
        address: "0x73676BE2e60aE2600D6F97699Cb0CD6B557E8579",
        startBlock: 9289313,
      },
    ];
