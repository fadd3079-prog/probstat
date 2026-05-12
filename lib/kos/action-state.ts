import type { KosDataFormValues } from "./validation";

export type KosCrudActionStatus = "idle" | "success" | "error";

export type KosCrudActionState = Readonly<{
  status: KosCrudActionStatus;
  message: string;
  fieldErrors?: Partial<Record<keyof KosDataFormValues | "id", string[]>>;
  values?: Partial<KosDataFormValues>;
}>;

export const emptyKosCrudActionState: KosCrudActionState = {
  status: "idle",
  message: "",
};
