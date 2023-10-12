# greenwood-demo-adapter-vercel

A demonstration repo for deploying a full-stack [**Greenwood**](https://www.greenwoodjs.io/) app with Vercel static hosting and Serverless + Edge functions.

## Setup

To run locally
1. Clone the repo
1. Run `npm ci`

You can now run these npm scripts
- `npm run dev` - Start the demo with Greenwood local dev server
- `npm start` - Start the demo with a production Greenwood build

> 👉 **Note**: _If deploying to your own Vercel instance, make sure you set the NodeJS version to `18.x` in your Vercel project's General settings_.

## Demo

This repo aims to demonstrate a couple of Greenwood's features ([API Routes](https://www.greenwoodjs.io/docs/api-routes/) and [SSR pages](https://www.greenwoodjs.io/docs/server-rendering/#routes)) leveraging Vercel's serverless and edge function capabilities, focused on using Web Components (WCC) and Web Standards to deliver the content for the demo.

## Status

|Feature    |Greenwood |Serverless|Edge|
|---------- |----------|----------|----|
|API Routes |   ✅     |  ✅       | ❓ |
|SSR Pages  |   ✅     |  ✅       | ❓ |

You can see the live demo at [https://greenwood-demo-adapter-vercel.vercel.app/](https://greenwood-demo-adapter-vercel.vercel.app/).

## Serverless

The serverless demos include the following examples:

### API Routes

- ✅  [`/api/greeting?name{xxx}`](https://greenwood-demo-adapter-vercel.vercel.app/api/greeting) - An API that returns a JSON response and optionally uses the `name` query param for customization.  Otherwise returns a default message.
- ✅ [`/api/fragment`](https://greenwood-demo-adapter-vercel.vercel.app/api/fragment) - An API for returning fragments of server rendered Web Components as HTML, that are then appended to the DOM.  The same card component used in SSR also runs on the client to provide interactivity, like event handling.

### SSR Pages

- ✅ [`/products/`](https://greenwood-demo-adapter-vercel.vercel.app/products/) - SSR page for rendering Greenwood pages.

## Edge

TODO

### API Routes

TODO

### SSR page

TODO

## Adapter Implementation Thoughts / Questions

1. [x] Will need to generate the _api/_ folder on-demand / as part of the build instead of hardcoding, likely from _manifest.json_
1. [x] How to manage vercel configuration (e.g. redirects for pages)?  Auto generate, auto merge into _vercel.json_?
1. [x] How to best manage local dev (runtime "compliance") - just for production builds
    - proxy vercel cli dev option?
    - should use _src/_ or _public/_?  depends on dev vs production mode?  Interestingly, the manual way only worked deployed when using _public/_
1. [x] Make sure to spread all headers / response properties in Vercel functions adapter output
1. [ ] Keep it as an experimental feature for 1.0 (or per platform?)
1. [ ] Will SSR pages need access to the request object?