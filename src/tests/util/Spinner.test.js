import { render } from '@testing-library/react';
import Spinner from '../../components/util/Spinner';

test('Render Spinner Component', () => {
  const { container } = render(<Spinner />)
  expect(container.firstChild.classList.contains('loading')).toBe(true)
}, 5000);
