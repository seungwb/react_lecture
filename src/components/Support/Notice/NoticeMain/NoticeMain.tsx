import { useLocation } from 'react-router-dom';
import './styled.css';
import axios from 'axios';
import { useEffect } from 'react';

export const NoticeMain = () => {
  const { search } = useLocation();

  useEffect(() => {
    searchList();
  }, [search]);

  // 공지사항 조회를 해주는 함수
  const searchList = (cPage?: number) => {
    cPage = cPage || 1;
    const searchParam = new URLSearchParams(search);
    searchParam.append('currentPage', cPage.toString());
    searchParam.append('pageSize', '5');

    axios.post('/api/support/noticeListBody.do', searchParam);
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
          <tr>
            <td colSpan={4} className="notice-empty-row">
              등록된 공지사항이 없습니다
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
