import { Hono } from "hono";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
export const app = new Hono();

app.post("/api/ping", async (c) => {
    try {
        const body = await c.req.json();
        const { host } = body;
        const command = `ping -c 1 ${host}`;

        const { stdout, stderr } = await execAsync(command);
        if (command.includes("nc") && stderr.includes("succeeded")) {
            return c.json({ output: stderr });
        }

        return c.json({
            output: stdout,
            error: stderr
        });
    } catch (error) {
        console.error(error)

        c.status(500);
        return c.json({ error: error.message });
    }
});
