import { cn } from './utils';

describe('cn utility function', () => {
  test('combines class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  test('handles conditional classes', () => {
    const condition = true;
    expect(cn('class1', condition && 'class2')).toBe('class1 class2');
    expect(cn('class1', !condition && 'class2')).toBe('class1');
  });

  test('handles array of classes', () => {
    expect(cn('class1', ['class2', 'class3'])).toBe('class1 class2 class3');
  });

  test('handles object of classes', () => {
    expect(cn('class1', { class2: true, class3: false })).toBe('class1 class2');
  });

  test('handles undefined and null values', () => {
    expect(cn('class1', undefined, null, 'class2')).toBe('class1 class2');
  });

  test('handles empty strings', () => {
    expect(cn('class1', '', 'class2')).toBe('class1 class2');
  });
});
