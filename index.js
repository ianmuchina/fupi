import { Router } from 'itty-router'
// import * as pq from 'proquint'
import { customAlphabet } from 'nanoid'

// now let's create a router (note the lack of "new")
const app = Router()

const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  6,
)

const html = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shortener</title>

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@exampledev/new.css@1/new.min.css">

</head>

<body>
    <style>
        /* Center The Form*/

        main {
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            min-height: 90vh;
        }

        label {
            text-align: start;
        }

        form {
            width: 80vw;
        }

        header {
            display: flex;
            justify-content: space-evenly;
        }
    </style>

    <main>
        <form action="/shorten" method="post">
            <label for="url">Url</label>
            <br>
            <input type="url" required name="url" id="url" placeholder="https://example.com">
            <button type="submit">Shorten</button>
        </form>
    </main>

</body>

</html>`

function htmlResult(shortenedUrl) {
  let result = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shortener</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@exampledev/new.css@1/new.min.css">

</head>

<body>
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            min-height: 80vh;
        }
    </style>
    <main>
        <p>Your Shortened Link</p>
        <a href="${shortenedUrl}">${shortenedUrl}</a>
    </main>
</body>
</html>
`
  return result
}

// GET collection index
app.get(
  '/',
  () =>
    new Response(html, {
      headers: { 'content-type': 'text/html' },
      status: 200,
    }),
)

// POST to the collection (we'll use async here)
app.post('/shorten', async request => {
  //Get form data
  let fdata = await request.formData()
  let url = fdata.get('url')

  let origin = new URL(request.url).origin

  //Create Random UID
  let slug = nanoid()

  // Add To KV Store, expires in 24 hours
  await fupi.put(slug, url, { expirationTtl: 3600 })

  let shortenedUrl = `${origin}/${slug}`
  return new Response(htmlResult(shortenedUrl), {
    headers: { 'content-type': 'text/html' },
    status: 200,
  })
})

//redirect if slug exists
app.get('/:slug', async request => {
  let link = await fupi.get(request.params.slug)

  if (link) {
    return new Response(null, {
      headers: { Location: link },
      status: 301,
    })
  } else {
    return new Response('404: Not found', {
      status: 404,
    })
  }
})

// 404 for everything else
app.all('*', () => new Response('404: Not Found.', { status: 404 }))

// attach the router "handle" to the event handler
addEventListener('fetch', event => event.respondWith(app.handle(event.request)))
