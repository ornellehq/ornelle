import { RouterProvider, createRouter } from "@tanstack/react-router"
import ReactDOM from "react-dom/client"

import { QueryClientProvider } from "@tanstack/react-query"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import qs from "qs"
import { queryClient } from "./core/network"
import { routeTree } from "./generated/routeTree.js"
import "./index.css"

dayjs.extend(relativeTime)
// Create a new router instance
export const router = createRouter({
  routeTree,
  parseSearch: (searchStr) =>
    qs.parse(searchStr, {
      depth: 3,
      ignoreQueryPrefix: true,
      parameterLimit: 20,
    }),
  stringifySearch: (searchObj) =>
    qs.stringify(searchObj, { addQueryPrefix: true, encode: false }),
})

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

const root = document.getElementById("root")

if (root)
  ReactDOM.createRoot(root).render(
    // <React.StrictMode>
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </>,
    // </React.StrictMode>,
  )

// <style
//       // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
//       dangerouslySetInnerHTML={{
//         __html: `@media screen {
//         /* Leading rule */
//         html {
//           -webkit-filter: invert(100%) hue-rotate(180deg) contrast(90%) !important;
//         } /* Contrary rule */
//         img,
//         video,
//         :not(object):not(body) > embed,
//         object,
//         iframe,
//         svg image,
//         [style*=\'background:url\'],
//         [style*=\'background-image:url\'],
//         [style*=\'background: url\'],
//         [style*=\'background-image: url\'],
//         [background],
//         twitterwidget,
//         .ms-ColorPicker, .color-preview::before {
//           -webkit-filter: invert(100%) hue-rotate(180deg) !important;
//         }
//         [style*=\'background:url\'] *,
//         [style*=\'background-image:url\'] *,
//         [style*=\'background: url\'] *,
//         [style*=\'background-image: url\'] *,
//         input,
//         [background] * {
//           -webkit-filter: none !important;
//         }
//         /*iframe:not([title=\'Disqus\']):not([src*=\'ihlenndgcmojhcghmfjfneahoeklbjjh\']) {
//           background: white !important;
//         }*/ /* Text contrast */
//         html {
//           text-shadow: 0 0 0 !important;
//         } /* Full screen */
//         *:-webkit-full-screen,
//         *:-webkit-full-screen * {
//           -webkit-filter: none !important;
//         } /* Custom rules */
//         #disqus_thread > :first-child {
//           background: black !important;
//         }
//       }`,
//       }}
//     />
