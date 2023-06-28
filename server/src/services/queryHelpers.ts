const DEFAULT_PAGE_NUM = 1;
const DEFAULT_PAGE_SIZE = 0;

export const getPagination = (size, num) => {
  const pageSize = Number(size) || DEFAULT_PAGE_SIZE;
  const pageNum = Number(num) || DEFAULT_PAGE_NUM;

  const pageSkip = (pageNum - 1) * pageSize;

  return {
    pageSkip,
    pageSize,
  };
};
