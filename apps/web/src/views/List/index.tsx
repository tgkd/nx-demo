import React, { useEffect } from 'react';
import { useStore } from 'effector-react';

import { $list, $paging, pagingChanged } from '@nx-demo/store';

export function ListPage() {
  const list = useStore($list);
  const paging = useStore($paging);

  useEffect(() => {
    pagingChanged({ ...paging, page: 1 });
  });

  return (
    <div>
      {list.map((p) => (
        <div>{p.name}</div>
      ))}
    </div>
  );
}
