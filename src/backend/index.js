// index.js
// This is the main entry point of the server-side code.
// It initializes the Hono app, sets up the middlewares, and routes the requests to the respective modules.

import { Hono } from "hono"
import { cors } from "hono/cors"
import { csrf } from "hono/csrf"

import * as ctf1 from "./ctf-1.js"
import * as ctf2 from "./ctf-2.js"
import * as ctf3 from "./ctf-3.js"
import * as ctf4 from "./ctf-4.js"
import * as ctf5 from "./ctf-5.js"

// Initializing Hono
const app = new Hono()

// Custom middleware
app.use(async (c, next) => {
	console.log(c.req.method, c.req.url)
	await next()
})

// // CSRF protection middleware
// app.use("*",csrf({
// 	origin:      (origin, c) => {
// 		return origin === c.env.HOST ? origin : ""
// 	},
// })
// )

// // Enhanced CORS middleware to include same-origin policy
// app.use("/*",cors({
// 	// credentials: true,
// 	origin:      (origin, c) => {
// 		return origin === c.env.HOST ? origin : ""
// 	},
// })
// )

app.use("*", cors());

app.get("/", (c) => {
	return c.json({
		status:         "ok",
	})
})

// app.route("/", ctf3.app)
// Use CTF-3's fetch handler directly for file paths
// app.all("/api/files/*", async (c) => {
//     return ctf3.fetch(c.req.raw)
// })

app.route("/", ctf1.app)
app.route("/", ctf2.app)
app.route("/", ctf3.app)
app.route("/", ctf4.app)
app.route("/", ctf5.app)

export default {
    port: 3000,
    fetch: app.fetch,
}
