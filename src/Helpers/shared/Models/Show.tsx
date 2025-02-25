import { Showrunner } from "./Showrunner";
import { DEFAULT_CALTAGS } from "../calTagsConfig";

export type application<T> = {
  uid: string;
  showID: string;
  type: T;
  status: "accepted" | "pending" | "rejected";
};

export type Performer = {
  uid: string | number;
  id: string | number;
  name: string;
};

export type QueryShowResponse = { [key: string]: Show };

export type ShowShareStatus = {
  shareKey: string;
  facebook: boolean | Date;
  instagram: boolean | Date;
}

export interface Show {
  _key?: string;
  showID?: string;
  venueID: string;
  cashLedger?: boolean;
  name: string; // Name of the show
  applications: application<"application">[]; // Performers who have applied to the show
  invites?: application<"invite">[]; // Performers who have been invited to perform at the show
  performers: Performer[]; // Performers who are confirmed to perform at the show
  deal: {
    type: string;
    guarantee?: string;
    production_fee?: string;
  };
  description: string;
  starttime: string;
  endtime: string;
  min_age: string | number; // Minimum age to attend the show
  type: string;
  covid_restrictions: {
    mask: boolean;
    vaccine: boolean;
  };
  ticket_tiers?: any;
  media?: Array<any>
  ticket_cost: string | number;
  donations: boolean;
  doorPrice?: string | number;
  private: boolean;
  cohosted: boolean;
  // kevin TODO: Why is this an array..?
  showrunner?: Showrunner[] | Array<{
    uid?: string,
    id?: string,
    type?: string
  }>;
  genre: string;
  capacity: string | number; // Maximum number of attendees
  flyer?: string;
  calTag?: keyof typeof DEFAULT_CALTAGS;
  timezone: string;
  soldTickets: number;
  remainingTickets: number;
  published: boolean;
  weekday?: string;
  ticketImage?: any;
  lineup_locked: boolean; // Can performers be added to the show?
  dealID: string;
  custom_fee?: number;
  custom_tax?: number;
  owed_fees?: number;
  owed_taxes?: number;
  youtubeLink?: string;
  notes?: string;
  shareStatus?: {
    shareKey: string
    facebook: any,
    instagram: any
  }
  metaPixel?: string;
  venueLabel?: string;
}
