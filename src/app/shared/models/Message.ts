export interface Message {
  id?: number;
  callId: number;
  authorId: number;
  authorRole: 'CLIENT' | 'PROVIDER';
  content: string;
  timestamp?: string;

}
