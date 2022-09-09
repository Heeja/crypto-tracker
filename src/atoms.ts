import { atom } from "recoil";

export interface IHistorical {
  time_open: number;
  time_close: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  market_cap: number;
}

export const isDarkAtom = atom({
  key: "isDark",
  default: false,
});
