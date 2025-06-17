import { useRecoilState } from 'recoil';
import './styled.css';
import { modalState } from '../../../../stores/modalState';
import { useEffect, useRef, useState, type ChangeEvent, type FC } from 'react';
import axios, { type AxiosResponse } from 'axios';
import type { INoticeDetail } from '../../../../model/Support/INotice';

interface INoticeProps {
  id?: number;
  reSearch: () => void;
}

interface IPostResonse {
  result: 'success' | 'fail';
}

export const NoticeModal: FC<INoticeProps> = ({ id, reSearch }) => {
  const [_, setModal] = useRecoilState(modalState);
  const formRef = useRef<HTMLFormElement>(null);
  const [detail, setDetail] = useState<INoticeDetail>();
  const [imgUrl, setImgUrl] = useState<string>('');

  useEffect(() => {
    id && detailNotice();
  }, []);

  const saveNotice = () => {
    axios
      .post('/api/support/noticeFileSave.do', formRef.current)
      .then((res: AxiosResponse<IPostResonse>) => {
        if (res.data.result === 'success') {
          alert('저장되었습니다.');
          setModal({ isOpen: false });
          reSearch();
        }
      });
  };

  const detailNotice = () => {
    const param = new URLSearchParams();

    param.append('noticeId', `${id}`);

    axios
      .post('/api/support/noticeFileDetail.do', param)
      .then((res: AxiosResponse<{ detailValue: INoticeDetail }>) => {
        const { fileExt, logicalPath } = res.data.detailValue;
        if (fileExt === 'jpg' || fileExt === 'png' || fileExt === 'gif') {
          // logicalPath는 tomcat에서 가져오는 경로인데
          // proxy 설정으로 인해, 포트 번호를 맞출 필요가 있음
          // /api라고 하면 포트가 localhost:80으로 잡히기 때문에
          // 앞에 /api를 작성해서 경로를 맞춰주면 된다.
          setImgUrl(`/api/${logicalPath}`);
          setDetail(res.data.detailValue);
        } else {
          setImgUrl('');
        }
      });
  };

  const updateDetail = () => {
    const formData = new FormData(formRef.current as HTMLFormElement);
    formData.append('noticeId', `${id}`);

    axios
      .post('/api/support/noticeFileUpdate.do', formData)
      .then((res: AxiosResponse<IPostResonse>) => {
        if (res.data.result === 'success') {
          alert('수정되었습니다.');
          setModal({ isOpen: false });
        }
        reSearch();
      });
  };

  const deleteDetail = () => {
    const param = new URLSearchParams({ noticeId: `${id}` });

    axios
      .post('/api/support/noticeFileDelete.do', param)
      .then((res: AxiosResponse<IPostResonse>) => {
        if (res.data.result === 'success') {
          alert('삭제되었습니다.');
          setModal({ isOpen: false });
        }
        reSearch();
      });
  };

  const closeModal = () => {
    setModal({ isOpen: false });
  };

  const handlerFile = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInfo = e.target.files;

    if (fileInfo?.length) {
      const fileInfoSplit = fileInfo[0].name.split('.');
      const fileExt = fileInfoSplit[1].toLowerCase();

      //파일이 이미지일 경우 미리보기가 실행되게 하는 것
      if (fileExt === 'jpg' || fileExt === 'gif' || fileExt === 'png') {
        // 파일에 대한 정보를 가지고 임시 url 생성
        // 이 url로 브라우저에서 이미지의 미리보기 기능 구현
        setImgUrl(URL.createObjectURL(fileInfo[0]));
      } else {
        setImgUrl('');
      }
    }
  };

  const downloadFile = () => {
    const param = new URLSearchParams();
    param.append('noticeId', `${id}`);

    axios
      .post('/api/support/noticeDownload.do', param, {
        responseType: 'blob',
      })
      .then((res: AxiosResponse<Blob>) => {
        const url = window.URL.createObjectURL(res.data);
        const link = document.createElement('a');

        link.href = url;
        link.setAttribute('download', detail?.fileName as string);
        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
  };

  return (
    <div className="modal-overlay">
      <form ref={formRef} className="modal-form modal-container">
        <label>
          제목 :
          <input
            type="text"
            name="fileTitle"
            defaultValue={detail?.noticeTitle}
          />
        </label>
        <label>
          내용 :
          <input
            type="text"
            name="fileContent"
            defaultValue={detail?.noticeContent}
          />
        </label>
        파일 :
        <input type="file" id="fileInput" name="file" onChange={handlerFile} />
        <label className="img-label" htmlFor="fileInput">
          파일 첨부하기
        </label>
        <div onClick={downloadFile}>
          <label>미리보기</label>
          {imgUrl ? (
            <div>
              <img className="preview-image" src={imgUrl} />
            </div>
          ) : (
            <div></div>
          )}
        </div>
        <div className="button-container">
          <button type="button" onClick={!id ? saveNotice : updateDetail}>
            {!id ? '저장' : '수정'}
          </button>
          {!!id && (
            <button type="button" onClick={deleteDetail}>
              삭제
            </button>
          )}
          <button type="button" onClick={closeModal}>
            나가기
          </button>
        </div>
      </form>
    </div>
  );
};
