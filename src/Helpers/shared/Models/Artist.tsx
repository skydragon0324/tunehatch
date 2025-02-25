export type ArtistPerformances = {
  id?: string;
  uid?: string;
  count?: number;
  venueID?: string;
};

export interface ArtistObject {
  _key: string;
  firstname?: string;
  lastname?: string;
  stagename?: string;
  avatar?: string;
  hometown?: string;
  performances?: ArtistPerformances[];
  contactNumber?: string;
  spotifyScore?: number;
  instagramFollowers?: number;
  tikTokLikes?: number;
  stripeEnabled?: boolean;
}
