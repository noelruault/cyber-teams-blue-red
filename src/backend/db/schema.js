import { Database } from "bun:sqlite";

const db = new Database("game.db");

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    team TEXT
  );
`);

db.run(`
  CREATE TABLE IF NOT EXISTS flags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location TEXT,
    captured BOOLEAN DEFAULT 0
  );
`);

db.run(`
  CREATE TABLE IF NOT EXISTS actions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER,
    action_type TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

db.run(`
  CREATE TABLE IF NOT EXISTS stages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    difficulty INTEGER,
    puzzle_data TEXT,
    solved BOOLEAN DEFAULT 0
  );
`);

db.run(`
    CREATE TABLE IF NOT EXISTS bank_accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        account_number TEXT UNIQUE,
        balance DECIMAL(10,2) DEFAULT 1000.00
    );
`)

db.run(`
  CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    content TEXT
  );
`);

const initData = () => {
  const flags = db.prepare("SELECT COUNT(*) as count FROM flags").get();
  if (flags.count === 0) {
    db.prepare(`
      INSERT INTO flags (location) VALUES
      ('Room A'),
      ('Room B'),
      ('Secret Vault'),
      ('Underground Lab'),
      ('Control Room')
    `).run();
  }

  const users = db.prepare("SELECT COUNT(*) as count FROM users").get();
  if (users.count === 0) {
    db.prepare(`
      INSERT INTO users (name, team) VALUES
      ('Alice', 'blue'),
      ('Bob', 'red'),
      ('Charlie', 'blue'),
      ('David', 'red')
    `).run();
  }
};

const initBankData = () => {
    const accounts = db.prepare("SELECT COUNT(*) as count FROM bank_accounts").get();
    if (accounts.count === 0) {
        const stmt = db.prepare(`
            INSERT INTO bank_accounts (username, account_number, balance) VALUES (?, ?, ?)
        `);
        // Add sample accounts
        stmt.run('alice', 'ACC-' + Math.random().toString(36).substring(2, 9), 1500.00);
        stmt.run('bob', 'ACC-' + Math.random().toString(36).substring(2, 9), 2500.00);
        stmt.run('admin', 'ACC-' + Math.random().toString(36).substring(2, 9), 9999.99);
    }
};

const initAlerts = () => {
    const alerts = db.prepare("SELECT COUNT(*) as count FROM alerts").get();
    if (alerts.count === 0) {
        const stmt = db.prepare(`
            INSERT INTO alerts (username, content) VALUES (?, ?)
        `);

        stmt.run('system', 'System initialization complete');
        stmt.run('admin', 'New security update deployed');
        stmt.run('monitor', 'Performance check passed');
    }
};

initData();
initBankData();
initAlerts();

export { db };
