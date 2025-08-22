# **TinyCrypto.jl – Exploring Cryptography in Small Prime Fields**

**Project Goal**
**TinyCrypto** is an educational Julia package that implements foundational cryptographic primitives over *tiny prime fields* (𝔽ₚ) to make cryptography transparent, auditable, and fun. It’s designed for researchers, teachers, and curious developers who want to explore cryptographic ideas without the distraction of big-number arithmetic or opaque black boxes.

**Why TinyCrypto?**
Cryptographic libraries are often hard to follow, optimized for performance or security. **TinyCrypto** flips that on its head—emphasizing readability, symbolic clarity, and small, verifiable parameters. It’s a sandbox for learning ECC, field arithmetic, and key management interactively, using simple types and Unicode-rich output.

**Features**

* **:material-pi:{.icon} Finite Field Arithmetic**
  Type-safe modular arithmetic via `Fp{T,P}`, supporting `+, -, *, /, ^, inv`, with automatic reduction modulo P.

* **:material-chart-bell-curve:{.icon} Elliptic Curves**
  Supports multiple curve forms:
  – **Weierstrass**: `y² = x³ + ax + b`
  – **Montgomery**: `By² = x³ + Ax² + x`
  – **Edwards & Twisted Edwards**: `ax² + y² = 1 + dx²y²`
  Includes point addition, doubling, identity detection, and scalar multiplication.

* **:fontawesome-solid-signature:{.icon} ECDSA & Signatures**
  Full keypair generation, message signing, signature verification, and public key recovery (ecrecover).

* **:fontawesome-solid-user-secret:{.icon} Secret Sharing** *(in progress)*
  Implements Shamir’s Secret Sharing for secure split/reconstruction of secrets with `(k, n)` threshold.

* **:material-unicode:{.icon} Symbolic Output**
  Pretty-printed Unicode math: `𝔽ₚ` for field primes, `𝔾(x,y)` for group generators, `∞` for identity points.

* **:simple-julia:{.icon} Written in Julia**
  Lightweight, high-performance, and idiomatic Julia package with modular structure and type safety throughout.

* **:fontawesome-solid-graduation-cap:{.icon} Teaching Focus**
  Operates over small fields (e.g. 𝔽₃₁, 𝔽₉₇), enabling full manual verification and didactic experimentation.

**Example Workflows**

```julia
using TinyCrypto

curve = Edwards(50:100, 1:20, max_cofactor=8)
𝔾 = curve.G                # Generator of the group G
2𝔾 == 𝔾 + 𝔾               # true

priv, pub = genkey(curve) # Generate ECDSA keypair
sig = sign(curve, priv, "hello")
verify(curve, pub, sig, "hello")     # true
pub == ecrecover(curve, "hello", sig) # true
```

You can generate curves with:

```julia
Weierstrass(97:103, 10:15, 2:7)      # y² = x³ + ax + b
Montgomery(30:40, 8:40, 3:40)
TwistedEdwards(50:100, 1:20, 1:20)
```

And work symbolically with:

```julia
const 𝔽₃₁ = Fp{UInt8, 31}
Weierstrass{𝔽₃₁}(6, 9, 37, 1, (0,3))
```

> :fontawesome-solid-graduation-cap:{.icon} **Learn More and Contribute**
> GitHub: [github.com/vargaconsulting/tiny-crypto](https://github.com/vargaconsulting/tiny-crypto)
> Docs: [vargaconsulting.github.io/tiny-crypto](https://vargaconsulting.github.io/tiny-crypto)
> License: MIT 
