
# :material-language-python:{.icon}**Python Decimal BID Wrapper – High-Precision IEEE 754-2008 in Pure Python**

**Project Goal**
The Python implementation of the Intel **Binary Integer Decimal (BID)** encoding offers an approachable, high-level way to work with IEEE 754-2008 decimal floating point numbers. Unlike binary floating point, decimal types can represent financial and scientific values **exactly**—without introducing rounding errors from binary fractions.

This library encodes and decodes **Decimal64** BID values into Python’s `Decimal` or `float` types and provides conversion routines back into BID integers. It is meant as a **reference, teaching, and prototyping tool** that mirrors the functionality of the C++ wrapper over Intel’s libBID.

**Features**

* **:material-format-section:{.icon} IEEE 754-2008 Compliance**
  Works with **Decimal64** (16 digits, 64-bit BID encoding) and supports proper handling of **NaN**, **±∞**, and signed zero.

* **:material-swap-horizontal:{.icon} Conversions**

  * `to_decimal(int)` → decode a 64-bit BID integer into a `Decimal`
  * `to_float(int)` → decode into a native `float` (with possible precision loss)
  * `from_decimal(Decimal)` → encode a Python `Decimal` into BID format
  * `from_float(float)` → encode a Python `float` into BID format

* **:material-exponent:{.icon} Correct Exponent/Mantissa Decomposition**
  Supports both 53-bit “normal” mantissas and special `100m` encodings with extended precision.

* **:material-eye-plus:{.icon} Context-Aware**
  Uses Python’s `decimal.Context` with precision = 16 digits, exponent range \[−383, +384], matching IEEE Decimal64 constraints.

* **:fontawesome-solid-explosion:{.icon} Special Values**
  Encodes/decodes **NaN**, **+∞**, **−∞** in both `float` and `Decimal` domains.

---

**Example Usage**

```python
from decimal import Decimal
import bid64   # assume module name

# Encode from Python float → BID64
raw = bid64.from_float(-12.2345678)
print(raw)  
# → 12745186945580849358

# Decode BID64 → Python Decimal
val = bid64.to_decimal(raw)
print(val)  
# → -12.2345678

# Round-trip with special values
print(bid64.from_float(float('nan')))
print(bid64.to_float(0x7c << 56))   # +inf
```

---

**Supported Values**

| Value Type      | Python Input        | BID Encoding (hex)    |
| --------------- | ------------------- | --------------------- |
| Normal numbers  | `-12.2345678`       | `0xb0c0000c 62e76b8e` |
| Max coefficient | `9999999999999999`  | `0x6c…ffff`           |
| Min coefficient | `-9999999999999999` | `0xf0…ffff`           |
| NaN             | `float('nan')`      | `0x7c00000000000000`  |
| +∞              | `float('inf')`      | `0x7800000000000000`  |
| −∞              | `float('-inf')`     | `0xf800000000000000`  |

---

**Implementation Notes**

* **Mantissa & Exponent**:
  Mantissas up to 16 digits (`≤ 9,999,999,999,999,999`) are supported.
  Exponents range from **−383 to +384**, encoded with a bias of 398.

* **Masks & Constants**:
  The implementation follows Intel’s BID encoding rules, using discriminant, combination, and sign masks to classify values.

* **Decimal Context**:
  All conversions use a fixed context:

  ```python
  Context(prec=16, Emin=-383, Emax=384, clamp=1)
  ```
**Use Cases**

* :material-chart-line:{.icon}  **Trading Systems** – exact money values, interest rates, tax computations
* :material-ethernet-cable:{.icon} **Encode/Decode** over wire  decimal exponents without binary roundoff
* :material-language-cpp:{.icon} **Interop** – with other languages with confidence
* :octicons-book-24:{.icon} **Reference Implementation** – verify correctness of C++/libBID bindings
* :fontawesome-solid-graduation-cap:{.icon} **Teaching Tool** – explore IEEE 754 decimal encoding in Python

> License: Proprietary © 2018–2024 Varga Consulting
