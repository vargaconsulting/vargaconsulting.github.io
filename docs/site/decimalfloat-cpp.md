
# **:material-language-cpp:{.icon} Intel Decimal Floating Point – High-Precision IEEE 754-2008 Arithmetic in Modern C++**

**Project Goal**
This library brings full-featured IEEE 754-2008 compliant **Decimal Floating Point (DFP)** arithmetic to modern C++, backed by Intel’s **Binary Integer Decimal (BID)** implementation. It wraps Intel’s low-level C APIs in **type-safe, user-friendly C++23 constructs**, and introduces a rich `decimal_t<T>` abstraction for working with **Decimal32, Decimal64, and Decimal128** numbers—with precision, correctness, and expressive syntax.

**Features**

* **:material-decimal:{.icon .lg} IEEE 754-2008 DFP Arithmetic**
  Full support for decimal base arithmetic over 32-, 64-, and 128-bit BID encodings, including proper rounding, quiet comparisons, and classification.

* **:simple-dazhongdianping:{.icon} Native Decimal Types**
  Typed wrappers:
      • `decimal_t<uint32_t>` → 7-digit `Decimal32`
      • `decimal_t<uint64_t>` → 16-digit `Decimal64`
      • `decimal_t<BID_UINT128>` → 34-digit `Decimal128`

* **:fontawesome-solid-explosion:{.icon} Operator Overloads & Formatting**
  Arithmetic, comparison, and stream `<<` operators, along with `std::format` support out of the box.

* **:material-swap-horizontal:{.icon} Bidirectional Conversions**
  Convert between decimal ⇄ binary floating point (float, double, long double), strings, and integers.

* **:material-book:{.icon} Decimal Literals**
  Support for user-defined literals:

  ```cpp
  using namespace math::literals;
  auto pi = 3.14159_dec64;
  ```

* **:fontawesome-solid-code-compare:{.icon} Decomposition Utilities**
  Extract and inspect raw mantissa, exponent, and sign bits:

  ```cpp
  auto [sign, mantissa, exponent] = decompose(value);
  ```

* **:simple-reactiveresume:{.icon} Constants by Precision**
  Predefined constants for each precision class (𝜋, 𝑒, 𝜏, φ, √2, ln10, rad↔deg, etc.), matching the precision of the backing type.

* **:material-exponent:{.icon} Transcendental Math Support**
  Built-in functions like `log`, `exp`, `sqrt`, `sin`, `cosh`, `tgamma`, `cbrt`, `erf`, `asinh`, and more—available for all three widths.

**Example Usage**

```cpp
using namespace math;
decimal_t<uint32_t> a = "123.45";
decimal_t<uint32_t> b = 1.05_dec32;

auto c = a * b;                    // Multiplication with correct rounding
std::cout << "Result: " << c;     // Prints "129.6225"

auto [sign, mantissa, exp] = decompose(c);
```

```cpp
decimal_t<uint64_t> pi = constants<uint64_t>::pi;
decimal_t<uint64_t> two = constants<uint64_t>::one + constants<uint64_t>::one;
auto circumference = two * pi * 10.0_dec64;
```

**Supported Types**

| Type                     | Precision  | Range              | Mantissa Digits |
| ------------------------ | ---------- | ------------------ | --------------- |
| `decimal_t<uint32_t>`    | Decimal32  | ±10⁻⁹⁵ to ±10⁹⁶    | 7               |
| `decimal_t<uint64_t>`    | Decimal64  | ±10⁻³⁸³ to ±10³⁸⁴  | 16              |
| `decimal_t<BID_UINT128>` | Decimal128 | ±10⁻⁶¹⁵⁷ to ±10⁶¹⁶ | 34              |

> License: Custom / Proprietary
> Contact: [info@vargaconsulting.ca](mailto:info@vargaconsulting.ca)
