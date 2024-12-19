export interface MetaData {
  total: number;
  limit: number;
  page: number;
  totalPage?: number; // Add this line
}


export const returnWithMeta = <T>(metaData: MetaData, data: T): { meta: MetaData; data: T } => {
  return {
    meta: {
      total: metaData.total,
      limit: metaData.limit,
      page: metaData.page,
      totalPage: metaData.totalPage
    },
    data,
  };
};
