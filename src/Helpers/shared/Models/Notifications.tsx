export enum NotificationTypes {
  TICKETS_SOLD = "TICKETS_SOLD",
  NEW_APPLICATION = "NEW_APPLICATION",
  APPLICATION_ACCEPTED = "APPLICATION_ACCEPTED",
  APPLICATION_ACCEPTED_REQUIRES_CONFIRMATION = "APPLICATION_ACCEPTED_REQUIRES_CONFIRMATION",
  INVITE_ACCEPTED = "INVITE_ACCEPTED",
  NEW_INVITE = "NEW_INVITE",
  SHOW_RESCHEDULED = "SHOW_RESCHEDULED",
  SHOW_PUBLISHED = "SHOW_PUBLISHED",
  SET_UP_PAYOUTS = "SET_UP_PAYOUTS"
}

export interface NotificationResponseAPI {
  id?: string;
  type: NotificationTypes;
  timestamp: any;
}

export interface ParsedNotifications extends NotificationResponseAPI {
  data: {
    showID?: string;
    artistID?: string;
    quantity?: number;
    newTime?: string;
  };
  multiple?: number;
  read?: boolean;
}
