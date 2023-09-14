// import { cssBundleHref } from '@remix-run/css-bundle';
import type { LinksFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';

import GlobalNav, { globalNavLinks } from '~/components/GlobalNav';
import globalStyles from '~/styles/global.css';
import faStyles from '~/styles/fontawesome/css/fontawesome.min.css';
import faSolidStyles from '~/styles/fontawesome/css/solid.min.css';

export const links: LinksFunction = () => [
  // ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
  { rel: 'stylesheet', href: globalStyles },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Signika:wght@300;600&display=swap',
  },
  { rel: 'stylesheet', href: faStyles },
  { rel: 'stylesheet', href: faSolidStyles },
  ...globalNavLinks(),
];

export default function App() {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        <GlobalNav />
        <main>
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
