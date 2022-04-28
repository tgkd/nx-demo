import { AxiosResponse } from 'axios';

import { ListItem, Paging, RequestParams } from '@nx-demo/types';

import { Api } from './instance';

type ListResponse = Promise<
  AxiosResponse<{
    error?: string;
    payload: ListItem[];
    paging: Paging;
  }>
>;

export async function getList(params: RequestParams): ListResponse {
  return Api.get('/list', { params });
}
