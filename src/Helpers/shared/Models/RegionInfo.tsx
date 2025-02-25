export default interface RegionInfo {
    label: string;
    icon: string | null;
    color: string | null;
    fontColor: string | null;
    locations: Array<string | null>;
    timezone: string;
    active: boolean;
    requests?: Array<{
        location?: string;
        votes?: number;
    } | null>
    featured?: boolean;
    contact?: {
        name: string,
        email: string,
        phone?: string
    }
}