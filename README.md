# greenwood-demo-adapter-vercel

A demonstration repo for using Greenwood with Vercel Serverless and Edge functions.

> ⚠️ _**Note**: Currently this repo is a WIP_

A demonstration repo for using Greenwood with Vercel Serverless and Edge functions for APIs and SSR pages and used in part of crafting the design for [introducing platform "adapters" into Greenwood](https://github.com/ProjectEvergreen/greenwood/issues/1008).  It also takes reference from [this repo / presentation](https://github.com/thescientist13/web-components-at-the-edge/) for some earlier prototypes for server rendering Web Components.

## Setup

To run locally
1. Clone the repo
1. Run `npm ci`

You can now run these npm scripts
- `npm run dev` - Start the demo with Greenwood local dev server
- `npm run serve` - Start the demo with a production Greenwood build
- `npm run serve:vercel` - Generate a production build and start a local Vercel server with the [Vercel CLI](https://vercel.com/docs/cli) for local testing. (Greenwood live reload not supported)

> 👉 **Note**: _If deploying to your own Vercel instance, make sure you set the NodeJS version to `18.x` in your Vercel project's General settings_.

## Demo

This repo aims to demonstrate a couple of Greenwood's features ([API Routes](https://www.greenwoodjs.io/docs/api-routes/) and [SSR pages](https://www.greenwoodjs.io/docs/server-rendering/#routes)) leveraging Netlify's serverless and edge function capabilities, focused on using Web Components (WCC) and Web Standards to deliver the content for the demo.

## Status

|Feature    |Greenwood |Serverless|Edge|
|---------- |----------|----------|----|
|API Routes |   ✅     |  ✅       | ❓ |
|SSR Pages  |   ✅     |  ❓       | ❓ |

You can see the live demo at [https://greenwood-demo-adapter-vercel.vercel.app/](https://greenwood-demo-adapter-vercel.vercel.app/).

## Serverless

The serverless demos include the following examples:

### API Routes

- ✅  [`/api/greeting?name{xxx}`](https://greenwood-demo-adapter-vercel.vercel.app/api/greeting) - An API that returns a JSON response and optionally uses the `name` query param for customization.  Otherwise returns a default message.
- ✅ [`/api/fragment`](https://greenwood-demo-adapter-vercel.vercel.app/api/fragment) - An API for returning fragments of server rendered Web Components as HTML, that are then appended to the DOM.  The same card component used in SSR also runs on the client to provide interactivity, like event handling.

### SSR Pages

- ✅ [`/artists`](https://greenwood-demo-adapter-vercel.vercel.app/artists) - SSR page for rendering Greenwood pages.  This implementation does not work because of `import.meta.url` (see above section on APIs)

## Edge

TODO

### API Routes

TODO

### SSR page

TODO

## Adapter Implementation Thoughts / Questions

1. [ ] Will need to generate the _api/_ folder on-demand / as part of the build instead of hardcoding, likely from _manifest.json_
1. [ ] How to manage vercel configuration (e.g. redirects for pages)?  Auto generate, auto merge into _vercel.json_?
1. [ ] How to best manage local dev (runtime "compliance")
    - proxy vercel cli dev option?
    - should use _src/_ or _public/_?  depends on dev vs production mode?  Interestingly, the manual way only worked deployed when using _public/_
1. [ ] Make sure to spread all headers / response properties in netlify functions adapter output
1. [ ] Keep it as an experimental feature for 1.0 (or per platform?)