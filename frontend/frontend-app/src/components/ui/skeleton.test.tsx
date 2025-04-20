import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Skeleton } from './skeleton';

describe('Skeleton Component', () => {
  test('renders with default classes', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass('animate-pulse', 'rounded-md', 'bg-zinc-900/10');
  });

  test('applies additional className', () => {
    const { container } = render(<Skeleton className="h-10 w-20" />);
    expect(container.firstChild).toHaveClass('h-10', 'w-20');
  });

  test('passes additional props', () => {
    const { container } = render(<Skeleton data-testid="test-skeleton" />);
    expect(container.firstChild).toHaveAttribute('data-testid', 'test-skeleton');
  });
});
