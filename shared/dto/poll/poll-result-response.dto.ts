export interface PollResultResponseDto {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  creatorName: string;
  isAnonymous: boolean;
  isMultipleChoice: boolean;
  allowCustomOptions: boolean;
  type: 'VOTE' | 'APPLICATION' | 'OPINION';
  status: 'ACTIVE' | 'CLOSED';
  closedAt: Date | null;
  totalVotes: number;
  submissions: VoteSubmissionDto[] | ApplicationSubmissionDto[];
}

export interface VoteResultResponseDto extends PollResultResponseDto {
  type: 'VOTE';
  submissions: VoteSubmissionDto[];
}

export interface ApplicationResultResponseDto extends PollResultResponseDto {
  type: 'APPLICATION' | 'OPINION';
  submissions: ApplicationSubmissionDto[];
}

export type VoteSubmissionDto = {
  value: string;
  count: number;
  voters: string[];
  rank: number;
};

export type ApplicationSubmissionDto = {
  content: string;
  nickname: string;
};
