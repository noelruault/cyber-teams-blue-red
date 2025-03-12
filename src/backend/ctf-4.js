import { Hono } from "hono"

export const app = new Hono()

let balance = 1000
let transactions = []

app.get("/api/bank-info", (c) => {
    return c.json({
        balance,
        transactions
    });
});

app.post("/api/transfer", async (c) => {
    try {
        const body = await c.req.json();
        const { to, amount } = body;
        const transferAmount = Number(amount);

        if (!to || !amount) {
            c.status(400);
            return c.json({ error: "Recipient and amount are required" });
        }

        if (isNaN(transferAmount) || transferAmount <= 0) {
            c.status(400);
            return c.json({ error: "Invalid amount" });
        }

        if (transferAmount > balance) {
            c.status(400);
            return c.json({ error: "Insufficient funds" });
        }

        balance -= transferAmount;
        const tx = `Transferred €${transferAmount.toLocaleString()} to ${to}`;
        transactions.unshift(tx);
        console.log(tx);

        return c.json({ success: true });
    } catch (error) {
        console.error("Transfer error:", error);
        c.status(500);
        return c.json({ error: "Transfer failed. Please try again." });
    }
});
