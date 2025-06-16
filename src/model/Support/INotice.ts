export interface INotice {
  noticeId: number;
  loginId: string;
  noticeTitle: string;
  regDate: string;
}

export interface INoticeDetail extends INotice {
  noticeContent: string;
}

export interface INoticeResponse {
  count: number;
  list: INotice[];
}
