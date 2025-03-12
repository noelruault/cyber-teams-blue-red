import { Hono } from "hono";
import fetch from "node-fetch";

import { db } from "./db/schema.js";

export const app = new Hono();

app.get("/api/alerts", async (c) => {
    try {
        console.log('Attempting to fetch alerts from database');

        const alerts = db.prepare(`
            SELECT timestamp, username, content FROM alerts ORDER BY timestamp DESC LIMIT 10
        `).all();

        console.log('Fetched alerts:', alerts);

        // Ensure we always return an array
        const response = {
            data: alerts.length > 0 ? alerts : [{
                timestamp: new Date().toISOString(),
                username: "system",
                content: "No recent alerts"
            }]
        };

        console.log('Returning alerts:', response);
        return c.json(response);

    } catch (error) {
        console.error('Database error details:', {
            message: error.message,
            stack: error.stack
        });

        return c.json({
            error: "Failed to load activity feed",
            details: error.message
        }, 500);
    }
});

app.get("/api/internal/monitor", async (c) => {
    try {
        const targetUrl = c.req.query('endpoint');
        if (!targetUrl) {
            return c.json({ error: "Missing endpoint parameter" }, 400);
        }

        console.log('Attempting to monitor:', targetUrl);
        const response = await fetch(targetUrl);

        console.log('Monitor response:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.text().then(text => {
            try {
                return JSON.parse(text);
            } catch {
                return text;
            }
        });

        return c.json({
            data,
            internal: true,
            status: response.status
        });

    } catch (error) {
        console.error('Monitor error:', error.message);
        return c.json({
            error: "Monitoring failed",
            message: error.message.replace(/localhost/g, 'internal-service'),
            debug: `Attempted to access: ${c.req.query('endpoint')}`
        }, 500);
    }
});
