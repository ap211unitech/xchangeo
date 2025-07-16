import {
  Faucet__ReceivedFunds as Faucet__ReceivedFundsEvent,
  Faucet__Created as FaucetCreatedEvent,
} from "../generated/Faucet/Faucet";
import { Faucet, Transfer } from "../generated/schema";

export function handleFaucetCreated(event: FaucetCreatedEvent): void {
  const id = event.address.toHex();

  const entity = new Faucet(id);
  entity.tokenAddress = event.params.token;
  entity.faucetAddress = event.address;
  entity.lockTime = event.params.lockTime;
  entity.withdrawalAmount = event.params.withdrawalAmount;
  entity.timestamp = event.block.timestamp;

  entity.save();
}

export function handleFaucetRequestedFunds(
  event: Faucet__ReceivedFundsEvent
): void {
  let entity = new Transfer(event.transaction.hash);

  const faucet = Faucet.load(event.params.from.toHex());

  if (faucet) {
    entity.from = event.params.from;
    entity.to = event.params.to;
    entity.token = faucet.tokenAddress;
    entity.amount = event.params.amount;

    entity.timestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    entity.eventType = "Faucet";

    entity.save();
  }
}
