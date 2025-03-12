import { Hono } from "hono"
import { db } from "./db/schema.js"

export const app = new Hono()

app.post("/api/accounts/create", async (c) => {
    try {
        const body = await c.req.json()
        const { username, balance } = body

        const accountNumber = 'ACC-' + Math.random().toString(36).substring(2, 9)
        const query = `INSERT INTO bank_accounts (username, account_number, balance)
            VALUES ('${username}', '${accountNumber}', ${balance || 0})`
        db.prepare(query).run()

        return c.json({
            success: true,
            message: "Account created successfully",
            account: { username, accountNumber, balance }
        })
    } catch (error) {
        c.status(500)
        return c.json({ error: error.message })
    }
})
