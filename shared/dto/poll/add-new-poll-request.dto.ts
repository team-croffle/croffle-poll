export interface AddNewPollRequestDto {
  title: string;
  description?: string;
  isAnonymous: boolean;
  isMultipleChoice: boolean;
  allowCustomOptions: boolean;
  type: 'VOTE' | 'APPLICATION' | 'OPINION';
  status?: 'ACTIVE' | 'CLOSED';
  closedAt?: Date;
  options: { content: string }[];
}
