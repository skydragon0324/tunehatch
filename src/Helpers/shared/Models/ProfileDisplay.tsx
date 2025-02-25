import { IStat } from "../statsConfig";
import { Type } from "./Type";

export interface UserProfileSocials {
  youtubeLink?: string;
}

export interface UserProfileDisplay {
  id?: string;
  primaryCity?: string;
  secondaryCity?: string;
  type?: Type;
  self?: boolean;
  displayName?: string;
  about?: string;
  avatar?: string;
  banner?: string;
  genre?: string;
  subgenre?: string;
  socials?: UserProfileSocials;
  badges?: any[];
  stats?: IStat[];
  socialStats?: any[];
  images?: any[];
  roster?: any[];
  sr_groups?: any[];
  venues?: any[];
}
