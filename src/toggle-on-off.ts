import { toggleLight } from "./litra";

export default async function Command(): Promise<void> {
  await toggleLight();
}
