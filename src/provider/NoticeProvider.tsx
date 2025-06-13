import { createContext, useState, type FC } from 'react';

interface INoticeContext {
  searchData: {
    title: string;
    startDate: string;
    endDate: string;
  };
  setSearchData: (params: Partial<INoticeContext['searchData']>) => void;
}

const defaultValue: INoticeContext = {
  searchData: {
    title: '',
    startDate: '',
    endDate: '',
  },
  setSearchData: () => {},
};

// 새로운 context 만드는 것
export const NoticeContext = createContext(defaultValue);

// provider를 통해서 context에 원하는 데이터를 넣어주고, 다른 컴포넌트에서 사용할 수 있게 할거임
export const NoticeProvider: FC<{
  children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
  const [searchData, setSearchData] = useState(defaultValue.searchData);

  // 더 안전하게 상태를 업데이트 하기 위해서
  // 유지보수에 좀 더 용이하다. 추후에 확장 가능
  const updateSearchData = (params: Partial<INoticeContext['searchData']>) => {
    setSearchData((prev) => ({ ...prev, ...params }));
  };

  // provider를 통해서 NoticeContext를 넘겨준다.
  // searchData에는 검색을 하기위한 데이터를 넣고,
  // setSearchData에서는 useState를 사용하여 상태값을 변경시키는 updateSearchData를 담아서 넘긴다.
  return (
    <NoticeContext.Provider
      value={{ searchData: searchData, setSearchData: updateSearchData }}
    >
      {children}
    </NoticeContext.Provider>
  );
};
