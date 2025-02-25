export interface Venue {
  uid: string;
  _key: string;
  name: string;
  description: string;
  avatar?: string;
  banner?: string;
  type: "venue";
  meta: any;
  themeColor?: string;
  capacity?: string;
  performanceAgreement?: any;
  hasTextContactEnabled?: boolean;
  customBackline?: string;
  min_age?: number;
  address?: string;
  location?: any;
  contact?: any;
  about?: string;
  phone?: string;
  email?: string;
  images?: any[];
  socials?: any;
  venueFee?: string;
  media?: string;
  stripe?: any;
  terminalLocation?: string;
  dealProfiles?: { [key: string]: any };
}
