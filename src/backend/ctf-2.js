import { Hono } from "hono"
import { db } from "./db/schema.js"

export const app = new Hono()

app.post("/api/accounts/search", async (c) => {
    try {
        const body = await c.req.json()
        const { username } = body

        const query = `
            SELECT username, account_number, balance
            FROM bank_accounts WHERE username LIKE '${username}'
        `
        const results = db.prepare(query).all()

        return c.json(results)
    } catch (error) {
        c.status(500)
        return c.json({ error: error.message })
    }
})
