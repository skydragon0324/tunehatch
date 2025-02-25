import { StringValueToken } from "html2canvas/dist/types/css/syntax/tokenizer";
import { Type } from "./Type";

export interface UserObject {
  uid?: string | null;
  displayUID?: string | null;
  firstname?: string | null;
  lastname?: string | null;
  forms: any;
  avatar?: string | null;
  artist?: boolean;
  host?: boolean;
  showrunner?: boolean;
}
