import { Type } from "./Type";

export interface IPaymentObject {
  amount: string | number;
  id: string;
  total: string | number;
  additionalPayment: string | number;
  type: Type;
  payouts_enabled?: boolean;
  paid?: boolean;
  custom?: boolean;
  customAmount?: number | string;
  status: string | boolean;
}
