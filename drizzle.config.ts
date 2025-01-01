import { defineConfig } from 'drizzle-kit'

// via connection params
export default defineConfig({
    dialect: "postgresql",
    dbCredentials: {
        host: "pgdb",
        port: 5432,
        user: "gaz",
        password: "cybergaz",
        database: "cybergaz",
    },
    schema: ["./src/models/*"]
})
