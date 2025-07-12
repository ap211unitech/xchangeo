import { Faucet__Created as FaucetCreatedEvent } from "../generated/Faucet/Faucet";
import { Faucet } from "../generated/schema";

export function handleFaucetCreated(event: FaucetCreatedEvent): void {
  const id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  const entity = new Faucet(id);
  entity.tokenAddress = event.params.token;
  entity.faucetAddress = event.address;
  entity.lockTime = event.params.lockTime;
  entity.withdrawalAmount = event.params.withdrawalAmount;
  entity.timestamp = event.block.timestamp;

  entity.save();
}
