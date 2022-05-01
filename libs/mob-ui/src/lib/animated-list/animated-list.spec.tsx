import React from 'react';
import { render } from '@testing-library/react-native';

import AnimatedList from './animated-list';

describe('AnimatedList', () => {
  it('should render successfully', () => {
    const { container } = render(<AnimatedList />);
    expect(container).toBeTruthy();
  });
});
