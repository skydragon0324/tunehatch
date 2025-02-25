import { Venue } from "./Venue";

export interface Showrunner {
  about: string;
  avatar: string;
  name: string;
  type: "showrunner";
  uid: string;
  banner: string;
  SRID: string;
  _key: string;
  members?: any[];
  bio?: string;
  contact?: any;
  socials?: any;
  venues?: Venue[];
  id?: string;
  sponsor?: boolean;
}
