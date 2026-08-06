import { setViewProps } from 'stackpress';
import { action } from 'stackpress/server';

export default action(async function Welcome({ req, res, ctx }) {
  res.results({
    message: 'Welcome to Stackpress!'
  });
  setViewProps(req, res, ctx);
});