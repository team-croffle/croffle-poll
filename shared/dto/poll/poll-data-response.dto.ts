export interface PollDataResponse {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  creatorName: string;
  isAnonymous: boolean;
  isMultipleChoice: boolean;
  allowCustomOptions: boolean;
  type: string;
  status: string;
  closedAt: Date | null;
  options: PollOptionResponse[];
}

export interface PollOptionResponse {
  id: string;
  pollId: string;
  creatorName: string;
  content: string;
}
