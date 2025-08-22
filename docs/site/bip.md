# **BIP32/BIP39++ (single-header) — Deterministic wallet keys without the footguns**

**Project goal**
A compact, proprietary C++ header that implements **BIP-39 seed derivation** and **BIP-32 child-key derivation** with clean types and predictable behavior. It gives you hardened/normal CKD, path parsing (BIP-44 style), public-key fingerprints, and smooth interop with your secp256k1 stack—ideal for Cosmos/EVM backends, HSM shims, and test harnesses.

---

## Why it exists

* **HD wallets are easy to get subtly wrong.** Off-by-one indices, endianness, or mixing hardened/normal steps will bite you.
* **You want minimal, auditable code.** Single header, clear return types, no build gymnastics.
* **Common flows should be one-liners.** *Mnemonic → seed → master (k,c) → path → child key → (optional) address.*

---

## Features

* **:material-seed:{.icon} BIP-39 → seed**
  `mnemonic2seed(mnemonic, passphrase)` using PBKDF2-HMAC-SHA512 (2048 iters).

* **:material-lock-check:{.icon} BIP-32 CKD (private)**
  `ckd_priv(k_parent, c_parent, index)` returns `{k_child, c_child}`; supports **hardened** (index ≥ `0x80000000`) and **normal** derivation.

* **:octicons-rel-file-path-16:{.icon} BIP-44 path parser**
  `path2indices("m/44'/118'/0'/0/0")` → `std::vector<uint32_t>` with hardened bits set; works for any coin path (`60'` for Ethereum, `118'` for Cosmos, etc.).

* **:material-key:{.icon} Master key derivation**
  `derive_master_key(seed)` → `{key, chain_code}` per BIP-32 (“Bitcoin seed”).

* **:fontawesome-solid-fingerprint:{.icon} Fingerprints**
  `fingerprint(compressed_pubkey)` → 4-byte parent fingerprint (SHA-256 → RIPEMD-160).

* **:octicons-file-binary-16:{.icon} Bytes/BN interop**
  Helpers like `ser_32`, `ser_256`, `parse256` align with CKD spec notation; plays nicely with your existing secp256k1/EVP wrappers.

* **:material-format-header-increase:{.icon} Single header, exception-based errors**
  Clear failure modes; integrates in minutes.

## Example workflows

### 1) Mnemonic → Cosmos account key (default BIP-44 path)

```cpp
#include "bip32_bip39.hpp"  // your single header

std::string mnemonic =
  "gravity machine north sort system female filter attitude volume fold club stay feature office ecology stable narrow fog";

openssl::bytes_t prv = bip39::mnemonic2private_key(mnemonic, "m/44'/118'/0'/0/0"); // Cosmos
```

### 2) Ethereum key at `m/44'/60'/0'/0/0` and address

```cpp
using bytes_t = openssl::bytes_t;

bytes_t seed      = bip39::mnemonic2seed(mnemonic);
auto [k, c]       = bip32::derive_master_key(seed);
for (uint32_t i : bip32::path2indices("m/44'/60'/0'/0/0"))
  std::tie(k, c) = bip32::ckd_priv(k, c, i);

// derive compressed/uncompressed pubkey as needed, then address (EVM)
bytes_t pub       = w3::derive_public_key(k, /*compressed=*/false);
bytes_t address   = ethereum::publickey2address(pub);          // last 20 bytes of keccak(pub[1:])
```

### 3) Parent fingerprint (for xpub/xprv hierarchies)

```cpp
bytes_t pub_c = w3::derive_public_key(k, /*compressed=*/true);
bytes_t fpr   = bip32::fingerprint(pub_c);   // 4 bytes
```

## Supported conventions (examples)

* **Cosmos**: `m/44'/118'/0'/0/0`
* **Ethereum / EVM chains**: `m/44'/60'/0'/0/0`
* **Bitcoin-style**: `m/44'/0'/0'/0/0`

> Any **SLIP-44** coin type works; pass the path you need and iterate with `ckd_priv`.

## Security & correctness notes

* **Deterministic** HMAC/CKD per BIP-32/BIP-39; hardened vs. normal indices handled by spec.
* **Endianness safe** helpers (`ser_32`, `ser_256`) match the notation in the original BIP-32 text.
* Use high-entropy mnemonics and secure passphrases; guard seeds/keys in memory, and clear when appropriate.
* Public-key serialization (compressed/uncompressed) is caller-selectable to match downstream protocol requirements.

## Minimal API (at a glance)

```cpp
namespace bip39 {
  openssl::bytes_t mnemonic2seed(const std::string& mnemonic,
                                 const std::string& passphrase = "mnemonic");
  openssl::bytes_t mnemonic2private_key(const std::string& mnemonic,
                                        std::string path = "m/44'/118'/0'/0/0");
}

namespace bip32 {
  std::pair<openssl::bytes_t, openssl::bytes_t> derive_master_key(const openssl::bytes_t& seed);
  std::pair<openssl::bytes_t, openssl::bytes_t> ckd_priv(const openssl::bytes_t& kpar,
                                                          const openssl::bytes_t& cpar,
                                                          uint32_t index);
  std::vector<uint32_t> path2indices(const std::string& path);
  openssl::bytes_t fingerprint(const openssl::bytes_t& compressed_pubkey);
}
```

**Licensing & availability**
Proprietary, single-header library. Commercial licensing via **Varga Consulting** (Toronto, Canada).
Contact: **[info@vargaconsulting.ca](mailto:info@vargaconsulting.ca)**.
