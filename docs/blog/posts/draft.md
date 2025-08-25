---
title: "Draft"
date: 2025-05-12
slug: draft

tags:
  - julia
  - cryptography
  - elliptic-curves
  - ecdsa
  - ethereum
summary: |
  A hands-on guide for generating elliptic curves and producing Ethereum-style
  ECDSA signatures using TinyCrypto.jl. Learn how to find secure curves,
  perform point arithmetic, and recover public keys—all with a minimal and
  type-safe cryptography library in Julia.
---

## 🔐 Background: What is ECDSA?

The **Elliptic Curve Digital Signature Algorithm (ECDSA)** is a cryptographic signature scheme widely used in blockchain systems such as Bitcoin and Ethereum. It relies on the hardness of the **Elliptic Curve Discrete Logarithm Problem (ECDLP)**.

ECDSA operates over a **finite field elliptic curve group**. In the most common form, the curve is defined by the **Weierstrass equation**:$ E: y^2 = x^3 + ax + b \mod p$

where $a$, $b$ are curve parameters, and \$p\$ is a prime defining the field \$\mathbb{F}\_p\$.

---

### 🔑 Key Components

* A **private key** is an integer \$d\$ chosen uniformly at random in $\[1, n-1]\$, where \$n\$ is the order of the generator point \$\mathbb{G}\$.
* The **public key** is computed as:

  $$
  Q = d \cdot \mathbb{G}
  $$

---

### ✍️ Signing a Message

To sign a message \$m\$, the signer:

1. Hashes the message to an integer \$z\$ (e.g. using Keccak256 in Ethereum).

2. Picks a fresh ephemeral private key \$k\$ at random from $\[1, n-1]\$.

3. Computes the curve point:

   $$
   (x_1, y_1) = k \cdot \mathbb{G}
   $$

4. Computes the signature values:

   $$
   r = x_1 \mod n
   $$

   $$
   s = k^{-1} (z + r \cdot d) \mod n
   $$

The signature is the pair \$(r, s)\$. Optionally, a **recovery id** \$v\$ is also included for public key recovery.

---

### ✅ Verifying a Signature

To verify a signature \$(r, s)\$ on message \$m\$ using public key \$Q\$:

1. Hash the message to \$z\$.

2. Compute:

   $$
   w = s^{-1} \mod n
   $$

   $$
   u_1 = z \cdot w \mod n,\quad u_2 = r \cdot w \mod n
   $$

3. Evaluate:

   $$
   (x_2, y_2) = u_1 \cdot \mathbb{G} + u_2 \cdot Q
   $$

4. Accept the signature if \$r \equiv x\_2 \mod n\$.

---

### 🔄 Recovering the Public Key

Ethereum includes a recovery id \$v \in {27, 28}\$ (or \${0, 1}\$), which makes it possible to **recover \$Q\$ from \$(r, s, v, m)\$** without prior knowledge of the public key.

---

Let me know if you’d like to add diagrams, ECC intuition (like scalar multiplication visualizations), or reduce to 1–2 paragraphs for more casual readers.
