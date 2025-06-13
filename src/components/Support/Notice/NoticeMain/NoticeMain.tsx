import { useLocation } from 'react-router-dom';
import './styled.css';
import axios, { type AxiosResponse } from 'axios';
import { useContext, useEffect, useState } from 'react';
import { PageNavigation } from '../../../common.componets/PageNavigation/PageNavigation';
import type {
  INotice,
  INoticeResponse,
} from '../../../../model/Support/INotice';
import { NoticeContext } from '../../../../provider/NoticeProvider';

export const NoticeMain = () => {
  // const { search } = useLocation();
  const [noticeList, setNoticeList] = useState<INotice[]>([]);
  const [noticeCnt, setNoticeCnt] = useState<number>(0);
  const { searchData } = useContext(NoticeContext);

  useEffect(() => {
    searchList();
  }, [searchData]);

  // 공지사항 조회를 해주는 함수
  const searchList = (cPage?: number) => {
    cPage = cPage || 1;
    const searchParam = new URLSearchParams(searchData);
    searchParam.append('currentPage', cPage.toString());
    searchParam.append('pageSize', '5');

    axios
      .post('/api/support/noticeListBody.do', searchParam)
      .then((res: AxiosResponse<INoticeResponse>) => {
        setNoticeList(res.data.list);
        setNoticeCnt(res.data.count);
      });

    //axios를 통해 받은 데이터를 받아야 함.
    // 문제1. axios 서버로 갔다가 와야하는데, 이것은 시간이 오래걸림
  };

  return (
    <div className="notice-main-container">
      <table className="notice-table">
        <thead className="notice-table-header">
          <tr>
            <th>공지번호</th>
            <th>공지 제목</th>
            <th>공지 날짜</th>
            <th>작성자</th>
          </tr>
        </thead>
        <tbody>
          {noticeList.length > 0 ? (
            noticeList.map((notice) => {
              return (
                <tr key={notice.noticeId} className="notice-table-row">
                  <td className="notice-cell">{notice.noticeId}</td>
                  <td className="notice-cell cursor-pointer text-blue-600 hover:text-blue-800">
                    {notice.noticeTitle}
                  </td>
                  <td className="notice-cell">{notice.regDate}</td>
                  <td className="notice-cell">{notice.loginId}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={4} className="notice-empty-row">
                등록된 공지사항이 없습니다
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <PageNavigation
        totalItems={noticeCnt}
        itemsPerPage={5}
        onPageChange={searchList}
      />
    </div>
  );
};
