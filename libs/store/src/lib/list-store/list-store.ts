import {
  createStore,
  createEvent,
  sample,
  attach,
  forward,
  combine,
  createEffect,
} from 'effector';

import { RequestParams, ListItem, Paging } from '@nx-demo/types';
import { getList } from '@nx-demo/api';

type Query = Omit<RequestParams, 'limit' | 'offset'>;

interface StorePaging {
  page: number;
  total: number;
  limit: number;
}

export const fetchListFx = createEffect({
  async handler(requestParams: RequestParams) {
    const res = await getList(requestParams);
    console.log('>>>', res.data.data)

    if (res.data.error) {
      throw new Error(res.data.error);
    }

    const { paging, data } = res.data;

    return { paging, data };
  },
});

/* paging */
export const pagingChanged = createEvent<StorePaging>();
export const resetPaging = createEvent();
const updatePaging = createEvent<Paging>();

export const $paging = createStore<StorePaging>({
  page: 0,
  total: 0,
  limit: 20,
})
  .on(pagingChanged, (_, paging) => paging)
  .on(updatePaging, (state, { total }) => ({
    ...state,
    total: total ?? state.total,
  }))
  .reset(resetPaging);

/* query */
export const queryChanged = createEvent<Query>({});
export const resetQuery = createEvent();

export const $query = createStore<Query>({})
  .on(queryChanged, (_, query) => query)
  .reset([resetQuery]);

const $listFilter = combine({
  paging: $paging,
  query: $query,
});

sample({
  clock: fetchListFx.done,
  source: fetchListFx.done,
  fn: ({ result: { paging } }) => paging,
  target: updatePaging,
});

const searchWithQueryFx = attach({
  effect: fetchListFx,
  source: $listFilter,
  mapParams: (query: Query, { paging }) => ({
    ...query,
    limit: paging.limit,
    offset: paging.limit * paging.page,
  }),
});

sample({
  source: $query,
  target: searchWithQueryFx,
  clock: queryChanged,
});

const searchWithPageFx = attach({
  effect: fetchListFx,
  source: $listFilter,
  mapParams: (paging: StorePaging, filters) => ({
    ...filters.query,
    limit: paging.limit,
    offset: paging.limit * paging.page,
  }),
});

sample({
  source: $paging,
  target: searchWithPageFx,
  clock: pagingChanged,
});

forward({
  from: queryChanged,
  to: resetPaging,
});

/* data store */
const resetListStore = createEvent();

forward({
  from: resetPaging,
  to: resetListStore,
});

export const $list = createStore<ListItem[]>([])
  .on(fetchListFx.done, (state, { result }) => {
    return Array.isArray(result.data) ? [...state, ...result.data] : state;
  })
  .reset([resetListStore]);

export const $listError = createStore<Error | string | null>(null)
  .on(fetchListFx.fail, (_, { error }) => error)
  .reset(resetListStore);
