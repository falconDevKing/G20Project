export enum RegisterNextStep {
  CONFIRM_SIGN_UP = "CONFIRM_SIGN_UP",
  DONE = "DONE",
  COMPLETE_AUTO_SIGN_IN = "COMPLETE_AUTO_SIGN_IN",
}

export interface SelectOptions {
  value: string | null | undefined;
  name: string | null | undefined;
}

export interface SelectOptionsWithFilt extends SelectOptions {
  filt: string;
}
