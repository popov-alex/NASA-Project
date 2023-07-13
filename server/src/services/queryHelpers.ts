import QueryString from 'qs';

const DEFAULT_PAGE_NUM = 1;
const DEFAULT_PAGE_SIZE = 10;

type ArgsType =
  | string
  | QueryString.ParsedQs
  | string[]
  | QueryString.ParsedQs[];

type ReturnObject = {
  pageSkip: number;
  pageSize: number;
};

export const getPagination = (size: ArgsType, num: ArgsType): ReturnObject => {
  const pageSize = Number(size) || DEFAULT_PAGE_SIZE;
  const pageNum = Number(num) || DEFAULT_PAGE_NUM;

  const pageSkip = (pageNum - 1) * pageSize;

  return {
    pageSkip,
    pageSize,
  };
};
