import { useState } from 'react';
import type { ServerConfigPageProps, ServerPageProps } from 'stackpress/view/client';
import { LayoutBlank, useLanguage } from 'stackpress/view/client';

export function Head(props: ServerPageProps) {
  const { styles = [] } = props;

  return (
    <>
      <title>Welcome to Stackpress!</title>
      <meta name="description" content="A new Stackpress application." />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  );
}

export function Body() {
  const { _ } = useLanguage();
  const [ count, setCount ] = useState(0);

  return (
    <main className="min-h-full grid place-items-center px-6 py-16 bg-gradient-to-br from-slate-50 via-indigo-50 to-cyan-50">
      <section className="w-full max-w-xl text-center rounded-3xl border border-slate-200/80 bg-white/85 px-8 py-12 shadow-2xl shadow-slate-900/10 backdrop-blur">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-950 text-3xl font-black text-white shadow-lg shadow-slate-950/20">
          S
        </div>

        <h1 className="m-0 text-4xl font-extrabold leading-tight text-slate-950 sm:text-5xl">
          {_('Welcome to Stackpress!')}
        </h1>

        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-slate-600">
          Edit this page and start building your app.
        </p>

        <button
          type="button"
          onClick={() => setCount(count + 1)}
          className="mt-8 inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-600/20"
        >
          Count is {count}
        </button>
      </section>
    </main>
  );
}

export default function Page(props: ServerConfigPageProps) {
  const { data, session, request, response } = props;

  return (
    <LayoutBlank
      data={data}
      session={session}
      request={request}
      response={response}
    >
      <Body />
    </LayoutBlank>
  );
}