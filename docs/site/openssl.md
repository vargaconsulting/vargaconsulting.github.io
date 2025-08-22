# **OpenSSL++ (single-header) — Modern C++ crypto utilities without the ceremony**

**Project goal**
**OpenSSL++** is a single-header, proprietary C++ library that makes everyday cryptography tasks straightforward and safe: key derivation, hashing, signing, signature recovery, and byte/hex conversions—wrapped in modern C++ with RAII, clear errors, and minimal surface area. It’s designed for trading systems, wallets, and infrastructure where correctness and latency both matter.

---

## Why it exists

* **OpenSSL is the most peer-reviewed crypto library**—but it doesn’t offer a direct, ergonomic path for **Ethereum/Bitcoin-style signing and key recovery** out of the box.
* **OpenSSL is powerful but verbose.** The raw API is pointer-heavy and easy to misuse.
* **You need speed and safety.** Clean RAII wrappers, minimal copies, predictable lifetimes.
* **Common flows should be one-liners.** Derive a public key, sign a digest, recover a public key from a signature, convert to an Ethereum address—done.

---

## Features

* **:material-lock-plus:{.icon} RAII resource safety** — deterministic cleanup for all crypto handles.
* **:fontawesome-solid-bitcoin-sign:{.icon} Key operations that matter** — `derive_public_key(...)`, `sign(digest, private_key) → (r,s,v)` with low-s normalization, `ecrecover(digest, r, s, v)`.
* **:fontawesome-solid-handshake-simple:{.icon} Big-integer helpers** — lightweight `bn_t` ops with intuitive comparisons and bitwise operators.
* **:fontawesome-solid-hashtag:{.icon} Hashing primitives** — Keccak-256 and SHA-256; returns raw bytes for pipelines.
* **:material-hexadecimal:{.icon} Hex/byte adapters** — `hex ↔ bytes` and `bn ↔ bytes` helpers for clean boundaries.
* **:fontawesome-brands-ethereum:{.icon} Ethereum utilities** — `publickey2address(pub)`, `privatekey2address(prv)` in one call.
* **:material-water-check:{.icon} Single header, drop-in** — minimal footprint, stable naming, snake\_case API.
* **:material-cursor-default-click:{.icon} Practical defaults** — low-s signatures, parity-aware recovery byte, consistent errors.

---

## Typical outcomes (what you get in a few lines)

* Derive an uncompressed public key from a 32-byte secret and turn it into an Ethereum address.
* Sign a 32-byte digest and ship `(r,s,v)` in canonical form.
* Recover a public key from `(digest, r, s, v)` for audits/forensics.
* Hash arbitrary bytes with Keccak-256 or SHA-256.
* Convert safely between `hex`, `bytes`, and big integers.



## Micro-examples

```cpp
using openssl::bytes_t;

bytes_t pub = openssl::derive_public_key(private_key_bytes); // derive public key
bytes_t addr = ethereum::publickey2address(pub);             // ethereum address from public key
auto [r, s, v] = openssl::sign(digest32, private_key_bytes); // sign digest → (r, s, v)
bytes_t rec_pub = openssl::ecrecover(digest32, v[0], r, s);  // recover public key
```

## Where it fits :material-bitcoin: :material-ethereum:
* **Trading & custody** — deterministic key flows, auditability, low-latency signing.
* **Wallet backends**  — compact primitives for address derivation and ecrecover.
* **Data pipelines** — clean hash/convert helpers for binary boundaries.

Perfect addition 👌 Let’s extend the list and flag **StarkNet**, which is a special case.

## Compatibility Table

<div class="grid cards" markdown style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">

- :simple-ethereum: Ethereum 
- :simple-bitcoin: Bitcoin
- :simple-bnbchain: BNB Smart Chain
- :simple-optimism: Optimism  
- Avalanche (C-Chain)         
- Arbitrum                    
- Tron                         
- zkSync                      
- Cosmos Hub                  
- **StarkNET**                
</div>


## Licensing & availability

* **Proprietary, single-header library.**
* Commercial licensing via **Varga Consulting** (Toronto, Canada).
* Contact: **[info@vargaconsulting.ca](mailto:info@vargaconsulting.ca)**.
