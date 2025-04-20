import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';

describe('Card Components', () => {
  test('renders Card with children', () => {
    const { container } = render(<Card>Card Content</Card>);
    expect(container.firstChild).toHaveClass('rounded-xl', 'border', 'bg-white');
    expect(container.textContent).toBe('Card Content');
  });

  test('renders CardHeader with children', () => {
    const { container } = render(<CardHeader>Header Content</CardHeader>);
    expect(container.firstChild).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6');
    expect(container.textContent).toBe('Header Content');
  });

  test('renders CardTitle with children', () => {
    const { container } = render(<CardTitle>Title Content</CardTitle>);
    expect(container.firstChild).toHaveClass('font-semibold', 'leading-none', 'tracking-tight');
    expect(container.textContent).toBe('Title Content');
  });

  test('renders CardDescription with children', () => {
    const { container } = render(<CardDescription>Description Content</CardDescription>);
    expect(container.firstChild).toHaveClass('text-sm', 'text-zinc-500');
    expect(container.textContent).toBe('Description Content');
  });

  test('renders CardContent with children', () => {
    const { container } = render(<CardContent>Content</CardContent>);
    expect(container.firstChild).toHaveClass('p-6', 'pt-0');
    expect(container.textContent).toBe('Content');
  });

  test('renders CardFooter with children', () => {
    const { container } = render(<CardFooter>Footer Content</CardFooter>);
    expect(container.firstChild).toHaveClass('flex', 'items-center', 'p-6', 'pt-0');
    expect(container.textContent).toBe('Footer Content');
  });

  test('applies additional className to Card', () => {
    const { container } = render(<Card className="test-class">Card Content</Card>);
    expect(container.firstChild).toHaveClass('test-class');
  });
});
