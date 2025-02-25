export interface Conversation{
    _key: string;
    participants: Array<string>;
    seenBy?: Array<string>;
    messages?: Array<{
        sender: string;
        content: string;
        timestamp: string
    }>
}