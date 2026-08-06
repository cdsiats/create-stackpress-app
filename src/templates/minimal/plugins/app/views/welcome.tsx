import { useLanguage } from 'stackpress';

export default function Welcome() {
  const { _ } = useLanguage();
  return (
    <h1>{_('Welcome to Stackpress!')}</h1>
  );
};