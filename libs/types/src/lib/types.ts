export interface RequestParams {
  sort?: 'ID' | 'name';
  order?: 'DESC' | 'ASC';
  offset?: number;
  limit?: number;
  search?: string;
}

export interface ListItemTag {
  ID: number;
  PostID: number;
  name: string;
  description: string;
}
export interface ListItem {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string | null;
  name: string;
  description: string;
  tags: ListItemTag[];
}

export interface User {
  id: string;
}

export interface Paging {
  total: number;
  filtered: number;
}
