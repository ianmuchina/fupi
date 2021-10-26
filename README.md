# fupi

A minimal url shortener made with cloudflare workers.

No Javascript required on frontend.

[demo](https://fupi.muchina.workers.dev/)

Links expire after one hour. 

## Setup 

Clone this repo first.

Install the dependencies.
```
npm install
```

## Local testing

Install [miniflare](https://github.com/cloudflare/miniflare).
```bash
npm i -g miniflare
```

Run miniflare.
```bash
miniflare 
```
```bash
# Output
#✨  Built successfully, built project size is 2 KiB.
#[mf:inf] Build succeeded
#[mf:inf] Worker reloaded! (4.09KiB)
#[mf:inf] Listening on :8787
#[mf:inf] - http://127.0.0.1:8787
```

## Deploying to a workers.dev subdomain

[Sign up for a workers account](https://dash.cloudflare.com/sign-up/workers)

Install the wrangler cli
```
npm install -g @cloudflare/wrangler
```

Login to cloudflare workers
```
wrangler login
```

Create KV Namespace
```
wrangler kv:namespace create "fupi"
wrangler kv:namespace create "fupi" --preview
```

Copy the contents of the command to `wrangler.toml`

Publish to workers.dev
```
wrangler publish
```

## Acknowledgements

[github.com/mm/cf-shortener](https://github.com/mm/cf-shortener)