import { betterAuth } from "better-auth";
import crypto from "crypto";
import pg from "pg";
import Database from "better-sqlite3";
import logger from "../utils/logger.js";

const makeAppleClientSecret = ({ clientId, teamId, keyId, key }) => {
    const header = {
        alg: "ES256",
        kid: keyId,
        typ: "JWT"
    };
    
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 86400 * 180; // 180 days (max 6 months)
    
    const payload = {
        iss: teamId,
        iat,
        exp,
        aud: "https://appleid.apple.com",
        sub: clientId
    };
    
    const base64UrlEncode = (obj) => {
        return Buffer.from(JSON.stringify(obj)).toString("base64url");
    };
    
    const headerStr = base64UrlEncode(header);
    const payloadStr = base64UrlEncode(payload);
    const signingInput = `${headerStr}.${payloadStr}`;
    
    const sign = crypto.createSign("SHA256");
    sign.update(signingInput);
    
    const signature = sign.sign({
        key,
        dsaEncoding: "ieee-p1363"
    }, "base64url");
    
    return `${signingInput}.${signature}`;
};

const { Pool } = pg;

let dbConfig;

if (process.env.DATABASE_URL) {
    logger.info("Initializing Better Auth database with PostgreSQL");
    dbConfig = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_URL.includes("localhost") || process.env.DATABASE_URL.includes("127.0.0.1")
            ? false
            : { rejectUnauthorized: false }
    });
} else {
    logger.info("Initializing Better Auth database with SQLite (sqlite.db)");
    dbConfig = new Database("./sqlite.db");
}

const getAppleClientSecret = () => {
    if (process.env.APPLE_CLIENT_SECRET) {
        return process.env.APPLE_CLIENT_SECRET;
    }
    if (process.env.APPLE_CLIENT_ID && process.env.APPLE_TEAM_ID && process.env.APPLE_KEY_ID && process.env.APPLE_PRIVATE_KEY) {
        try {
            return makeAppleClientSecret({
                clientId: process.env.APPLE_CLIENT_ID,
                teamId: process.env.APPLE_TEAM_ID,
                keyId: process.env.APPLE_KEY_ID,
                key: process.env.APPLE_PRIVATE_KEY
            });
        } catch (err) {
            logger.error("Failed to generate Apple client secret:", err);
        }
    }
    return "development-placeholder-secret";
};

export const auth = betterAuth({
    database: dbConfig,
    basePath: "/auth",
    emailAndPassword: {
        enabled: true,
        autoSignIn: true
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "development-placeholder-client-id",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "development-placeholder-secret"
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID || "development-placeholder-client-id",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "development-placeholder-secret"
        },
        apple: {
            clientId: process.env.APPLE_CLIENT_ID || "development-placeholder-client-id",
            clientSecret: getAppleClientSecret()
        },
        microsoft: {
            clientId: process.env.MICROSOFT_CLIENT_ID || "development-placeholder-client-id",
            clientSecret: process.env.MICROSOFT_CLIENT_SECRET || "development-placeholder-secret"
        }
    },
    secret: process.env.BETTER_AUTH_SECRET || "development-fallback-secret-key-32-characters-long",
    // In production, the URL is set via environment variable. In dev, we can fallback.
    trustedOrigins: [
        process.env.FRONTEND_URL || "http://localhost:3000",
        "http://localhost:3001"
    ]
});
