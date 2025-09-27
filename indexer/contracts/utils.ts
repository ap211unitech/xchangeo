const args = process.argv.slice(2);
const networkArg = args.find((arg) => arg.startsWith("--network="));
const network = networkArg ? networkArg.split("=")[1] : "localhost";

export const isLocalhost = network === "localhost";
