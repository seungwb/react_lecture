export interface INotice {
  noticeId: number;
  loginId: string;
  noticeTitle: string;
  regDate: string;
}

export interface INoticeDetail extends INotice {
  noticeContent: string;
  fileName: string;
  fileExt: string;
  fileSize: number;
  physicalPath: string;
  logicalPath: string;
}

export interface INoticeResponse {
  count: number;
  list: INotice[];
}
