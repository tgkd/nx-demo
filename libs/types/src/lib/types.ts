export interface RequestParams {
  groupBy?: 'name' | 'id';
  name?: string;
}

export interface ListItem {
  id: string;
  name: string;
}

export interface Paging {
  page: number;
  totalPages: number;
  nextPage?: number;
  prevPage?: number;
}
