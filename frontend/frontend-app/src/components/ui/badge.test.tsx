import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Badge } from './badge';

describe('Badge Component', () => {
  test('renders with default variant', () => {
    const { container } = render(<Badge>Test Badge</Badge>);
    expect(container.firstChild).toHaveClass('bg-zinc-900');
    expect(container.textContent).toBe('Test Badge');
  });

  test('renders with secondary variant', () => {
    const { container } = render(<Badge variant="secondary">Secondary Badge</Badge>);
    expect(container.firstChild).toHaveClass('bg-zinc-100');
    expect(container.textContent).toBe('Secondary Badge');
  });

  test('renders with destructive variant', () => {
    const { container } = render(<Badge variant="destructive">Destructive Badge</Badge>);
    expect(container.firstChild).toHaveClass('bg-red-500');
    expect(container.textContent).toBe('Destructive Badge');
  });

  test('renders with outline variant', () => {
    const { container } = render(<Badge variant="outline">Outline Badge</Badge>);
    expect(container.firstChild).toHaveClass('text-zinc-950');
    expect(container.textContent).toBe('Outline Badge');
  });

  test('applies additional className', () => {
    const { container } = render(<Badge className="test-class">Custom Badge</Badge>);
    expect(container.firstChild).toHaveClass('test-class');
    expect(container.textContent).toBe('Custom Badge');
  });
});
