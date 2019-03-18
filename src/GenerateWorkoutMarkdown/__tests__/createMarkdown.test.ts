import { createMarkdown } from '../createMarkdown';
import bike from './__fixtures__/bike.json';
import run from './__fixtures__/run.json';

test('markdown post generation', () => {
  expect(createMarkdown(bike)).toMatchSnapshot();

  expect(createMarkdown(run)).toMatchSnapshot();
});
