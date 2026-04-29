# Chapter 9 — MCP (AI Integration)

> **Goal:** Make any AI-powered IDE a full ZEN peer. Your editor stores data in the decentralized graph, syncs with other peers, and exposes every ZEN crypto and graph API to AI agents.

---

## 9.1 What is MCP?

MCP (Model Context Protocol) is the standard protocol for connecting AI assistants in IDEs to external tools and data sources. ZEN's MCP server (`lib/mcp.js`) turns your IDE into a full ZEN P2P peer — not a thin client.

When you start the MCP server:

- A ZEN node starts in your IDE process
- It connects to `wss://peer0.akao.io` and `wss://peer1.akao.io` (or `$ZEN_PEERS`)
- LAN peers are discovered via IPv4/IPv6 multicast on `233.255.255.255:8420` / `ff02::1:8420`
- Graph data is persisted at `~/.local/share/zen/mcp` (XDG standard)
- Every write propagates to all connected peers; every peer contributes to routing

---

## 9.2 Quick start

### Cursor

Add to `~/.cursor/mcp.json` (global) or `.cursor/mcp.json` (project):

```json
{
  "mcpServers": {
    "zen": {
      "command": "npx",
      "args": ["-y", "-p", "@akaoio/zen", "mcp"]
    }
  }
}
```

### VSCode / GitHub Copilot

Add to `~/.copilot/mcp-config.json`:

```json
{
  "mcpServers": {
    "zen": {
      "command": "npx",
      "args": ["-y", "-p", "@akaoio/zen", "mcp"]
    }
  }
}
```

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "zen": {
      "command": "npx",
      "args": ["-y", "-p", "@akaoio/zen", "mcp"]
    }
  }
}
```

No ZEN installation needed — `npx` downloads `@akaoio/zen` automatically on first use.

---

## 9.3 Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `ZEN_PEERS` | `wss://peer0.akao.io,wss://peer1.akao.io` | Comma-separated bootstrap peer URLs |
| `XDG_DATA_HOME` | `~/.local/share` | Data directory root (graph stored at `$XDG_DATA_HOME/zen/mcp`) |

---

## 9.4 Tool reference

All tools map 1:1 to the ZEN JavaScript API. All parameters are strings.

### `get` — read a value

| Param | Required | Description |
|-------|----------|-------------|
| `soul` | ✓ | Soul (node ID) |
| `key`  | ✓ | Key within the node |

Returns the current value or `null`.

```
get(soul="profile", key="name") → "Alice"
```

---

### `put` — write a value

| Param | Required | Description |
|-------|----------|-------------|
| `soul`  | ✓ | Soul (node ID) |
| `key`   | ✓ | Key within the node |
| `value` | ✓ | Value to write (string) |

Returns `{"ok":true}` on success.

```
put(soul="profile", key="name", value="Alice") → {"ok":true}
```

---

### `on` — read current state

Same params as `get`. Returns current value (reads from local graph state, equivalent to `.once()`).

---

### `pair` — generate a key pair

| Param | Required | Description |
|-------|----------|-------------|
| `curve` | — | `"secp256k1"` (default) or `"p256"` |
| `seed`  | — | Deterministic seed string |
| `priv`  | — | Existing private key (for additive child derivation) |
| `epriv` | — | Existing encryption private key (for additive child derivation) |
| `pub`   | — | Existing public key (for public-only child derivation) |
| `epub`  | — | Existing encryption public key (for public-only child derivation) |

Returns a key pair object with `{ pub, priv, epub, epriv }`.

```
pair() → { pub: "0Abc...", priv: "0Xyz...", epub: "0Def...", epriv: "0Uvw..." }
pair(seed="my-app") → same pair every time
pair(curve="p256") → P-256/secp256r1 key pair
pair(priv="0...", seed="child") → additive child key pair (HD derivation)
```

---

### `sign` — sign data

| Param | Required | Description |
|-------|----------|-------------|
| `data` | ✓ | Data to sign |
| `priv` | ✓ | Private signing key |
| `pub`  | ✓ | Public key matching `priv` |

Returns a signed string (`ZEN{...}|{m,s,v}` format). The `v` recovery bit is included.

---

### `verify` — verify a signature

| Param | Required | Description |
|-------|----------|-------------|
| `signed` | ✓ | Signed string from `sign` |
| `pub`    | ✓ | Signer's public key |

Returns the original data if valid, or `null`.

---

### `encrypt` — encrypt data

| Param | Required | Description |
|-------|----------|-------------|
| `data` | ✓ | Plaintext to encrypt |
| `epub` | ✓ | Recipient's encryption public key |

Returns an encrypted ciphertext object `{ ct, iv, s }`.

---

### `decrypt` — decrypt data

| Param | Required | Description |
|-------|----------|-------------|
| `enc`   | ✓ | Encrypted object from `encrypt` |
| `epriv` | ✓ | Your encryption private key |

Returns the original plaintext.

---

### `secret` — ECDH shared secret

| Param | Required | Description |
|-------|----------|-------------|
| `epub`  | ✓ | Other party's encryption public key |
| `epriv` | ✓ | Your encryption private key |

Returns a base62 shared secret string that both parties can independently derive.

```
secret(epub=alice.epub, epriv=bob.epriv) === secret(epub=bob.epub, epriv=alice.epriv)
```

---

### `hash` — hash data

| Param | Required | Description |
|-------|----------|-------------|
| `data`       | ✓ | Data to hash |
| `name`       | — | Algorithm: `"SHA-256"`, `"KECCAK-256"`, `"HKDF"`, or omit for PBKDF2 |
| `salt`       | — | Salt string (PBKDF2/HKDF) |
| `encode`     | — | Output encoding: `"base62"` (default), `"hex"`, `"base64"` |
| `iterations` | — | PBKDF2 iteration count (default: 100000) |
| `pow`        | — | Mining config JSON string: `{"unit":"0","difficulty":3}` |

Default (no `name`): PBKDF2 with 100k iterations — correct for password hashing.

```
hash(data="hello", name="SHA-256") → "0YpdjLkGyb..."
hash(data="hello", name="KECCAK-256") → "0Yv0XcI4sx..."
hash(data="password", salt="random-salt") → PBKDF2 stretched hash
hash(data="mykey", name="SHA-256", pow='{"unit":"0","difficulty":3}') → {hash, nonce, proof}
```

---

### `certify` — issue a write-access certificate

| Param | Required | Description |
|-------|----------|-------------|
| `pub`        | ✓ | Recipient public key (or JSON array of keys) |
| `policy`     | ✓ | Policy JSON string, e.g. `{"write":"*"}` |
| `priv`       | ✓ | Issuer private key |
| `expiry`     | — | Expiry timestamp (ms since epoch) |

Returns a signed certificate string that can be passed as `cert` in authenticated writes.

```
certify(pub="0Abc...", policy='{"write":"*"}', priv="0Xyz...") → "ZEN{...}"
```

---

### `recover` — recover signer public key

| Param | Required | Description |
|-------|----------|-------------|
| `signed` | ✓ | Signed string from `sign` (must contain `v` recovery bit) |

Returns the signer's public key without needing it as input. Useful for verifying ownership when only the signed data is available.

```
recover(signed="ZEN{...}") → "0Abc..."
```

---

## 9.5 Architecture

```
┌─────────────────────────────────────────┐
│  IDE (Cursor / VSCode / Claude Desktop) │
│                                         │
│  AI Agent ─── MCP protocol ───► zen     │
│                  (stdio JSON-RPC 2.0)   │
└────────────────────┬────────────────────┘
                     │
              lib/mcp.js
         (ZEN peer + MCP server)
                     │
         ┌───────────┼───────────┐
         │           │           │
    ZEN graph   XDG storage   P2P mesh
    get/put/on  ~/.local/share  WebSocket
                zen/mcp/       + multicast
```

The MCP server is a real ZEN peer:
- Imports `index.js` — the full Node.js stack (rfs, axe, multicast, websocket)
- Every `put` propagates to connected peers; every `get` reads from the merged graph
- Your IDE's data is part of the same decentralized graph as relay nodes

---

## 9.6 Coexistence with a relay

If you run a ZEN relay on port 8420 on the same machine, the MCP server connects to it as a WebSocket peer. No port conflict — the MCP server is a client, not a server on that port.

Set `ZEN_PEERS` to point at your local relay:

```json
{
  "mcpServers": {
    "zen": {
      "command": "npx",
      "args": ["-y", "-p", "@akaoio/zen", "mcp"],
      "env": {
        "ZEN_PEERS": "ws://localhost:8420/zen,wss://peer0.akao.io"
      }
    }
  }
}
```

---

## 9.7 Running directly

```bash
# Without install (npx)
npx -p @akaoio/zen mcp

# From a cloned repo
node lib/mcp.js

# With custom peers
ZEN_PEERS=wss://my-relay.example.com node lib/mcp.js
```

The server speaks JSON-RPC 2.0 over `stdin`/`stdout`. Logs go to `stderr`.
