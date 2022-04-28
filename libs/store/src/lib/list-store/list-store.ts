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

type Query = Pick<RequestParams, 'groupBy' | 'name'>;

export const fetchListFx = createEffect({
  async handler(requestParams: RequestParams) {
    const res = await getList(requestParams);

    if (res.data.error) {
      throw new Error(res.data.error);
    }

    const { paging, payload } = res.data;

    return { paging, payload };
  },
});

/* paging */
export const pagingChanged = createEvent<Paging>();
export const resetPaging = createEvent();

const updatePaging = createEvent<Paging | undefined>();

export const $paging = createStore<Paging>({
  page: 1,
  totalPages: 0,
})
  .on(pagingChanged, (_, paging) => paging)
  .on(updatePaging, (state, paging) => paging ?? state)
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
  mapParams: (query: Query, filters) => ({
    page: filters.paging.page,
    ...query,
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
  mapParams: (paging: Paging, filters) => ({
    page: paging.page,
    ...filters.query,
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
    return Array.isArray(result.payload)
      ? [...state, ...result.payload]
      : state;
  })
  .reset([resetListStore]);

export const $listError = createStore<Error | string | null>(null)
  .on(fetchListFx.fail, (_, { error }) => error)
  .reset(resetListStore);
