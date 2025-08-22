# **Generics (C++23) — One set of numeric utilities for all your containers**

**Project goal**
A tiny, header-only C++23 library that gives you **uniform numeric utilities**—`fill`, `zeros`, `ones`, `nans`, `resize`, `round`, `ceil`, `floor`, `zeros2nans`—that **just work** across STL vectors, Armadillo vectors/matrices, and scalars. Concepts and `if constexpr` pick the right implementation at compile time, so you write one call and move on.

## Why it exists

* **Stop writing the same loops.** Filling, rounding, resizing, and NaN-munging are boilerplate across types.
* **One API, many backends.** STL, Armadillo, your custom container—no overload clutter.
* **Zero-footgun, zero-negotiation.** If a type can’t be handled, you get a **compile-time** error, not a surprise at runtime.

## Features

* **🧮 Uniform fill/initialization**
  `fill(v, x...)`, `zeros(x...)`, `ones(x...)` work for STL containers, Armadillo matrices/vectors, and scalars.

* **🧊 NaN utilities**
  `nans(x...)` for floating-point containers; `zeros2nans(x...)` to turn sentinel zeros into `NaN`.

* **📏 Shape control**
  `resize(n, vec...)` for 1-D; `resize(r, c, mat...)` for Armadillo-like matrices (`set_size` under the hood).

* **🔢 Elementwise transforms**
  `round<P>(x...)`, `ceil(x...)`, `floor(x...)` over any **element\_wise\_mathable** container.

* **🧩 Variadic**
  All APIs accept multiple containers in one call—**consistent bulk ops**.

* **🧰 Concepts-first**
  `arma_mat_like`, `arma_vector_like`, `iterable_mutable`, `floating_point_container`, etc., keep overload resolution clean and **zero-overhead**.

* **📦 Header-only, MIT**
  Drop it in; no build system changes.

## Example

```cpp
/**
 * @brief Quick demo of generics utilities on STL + Armadillo
 * @ingroup examples
 */
#include <vector>
#include <armadillo>
#include "generics.hpp"

using vec_f_t = std::vector<float>;
using vec_d_t = arma::vec;   // 1-D double
using mat_d_t = arma::mat;   // 2-D double

int main() {
    vec_f_t x; vec_d_t y; mat_d_t A;

    // Resize several containers in one call
    generics::resize(5UL, x, y);
    generics::resize(3UL, 4UL, A);

    // Initialize
    generics::zeros(x, y, A);     // fill all with 0
    generics::ones(x);            // x := 1
    generics::nans(y);            // y := NaN

    // Replace zeros with NaN (useful for masking)
    generics::zeros2nans(A);

    // Rounding utilities
    generics::round<3>(x);        // 3 decimal places
    generics::ceil(y);
    generics::floor(A);

    return 0;
}
```

## API (at a glance)

```cpp
// Initialization
template <class T, class... C> void fill(T value, C&... c);
template <class... C> void zeros(C&... c);
template <class... C> void ones(C&... c);
template <generics::floating_point_container C, class... R> void nans(C& head, R&... tail);

// Shape
template <class C> void resize(size_t n, C& c);                      // 1-D
template <class C, class... R> void resize(size_t n, C& head, R&...);
template <generics::arma_mat_like C, class... R>
void resize(size_t rows, size_t cols, C& head, R&... tail);          // 2-D (Armadillo-like)

// Elementwise transforms
template <int precision, class... C> void round(C&... c);
template <class... C> void ceil(C&... c);
template <class... C> void floor(C&... c);

// Data cleaning
template <generics::nan_assignable_iterable C, class... R>
void zeros2nans(C& head, R&... tail);
```

## What it works with

* **STL**: `std::vector<T>` and similar containers exposing `value_type`, `resize`, `assign`/`fill`, and iteration.
* **Armadillo**: `arma::vec`, `arma::mat`, `arma::Col`, `arma::Row`, etc. (`set_size`, `fill`).
* **Scalars**: arithmetic types for simple `fill`.
* **Your types**: provide `value_type` + either `fill`/`assign` + `resize` (1-D) or `set_size` (2-D) and they’ll fit right in.

## Guarantees & behavior

* **Compile-time checks**: unsupported types fail with a clear `static_assert`.
* **No hidden allocations**: operations use container APIs; compilers can auto-vectorize loops.
* **No RTTI or exceptions for control flow**: failures are compile-time; runtime errors remain your domain.

## Typical uses

* **Pre/post-processing** in pipelines: quick shaping and cleaning before algebra.
* **Data imputation**: `zeros2nans` to mask padded regions before statistics.
* **Batch ops**: apply the same transform to N containers with one call.
* **Glue** between libraries: keep your STL + Armadillo code uniform.

**License**
MIT 
© 2017–2025 Varga Consulting, Toronto, ON, Canada — [info@vargaconsulting.ca](mailto:info@vargaconsulting.ca).
