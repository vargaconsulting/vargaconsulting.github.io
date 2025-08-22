# **Sigma — High-Performance Order Book & Market Simulator**

**Project Goal**
The **Sigma system** is a proprietary high-performance **order book engine and trading simulator**, designed for institutional-grade research, strategy backtesting, and low-latency market infrastructure. It combines realistic market mechanics with modular extensibility, enabling quants and developers to test, refine, and deploy strategies under production-like conditions.

## Why it exists

* **Latency matters** — Traditional simulators often collapse under HFT-scale workloads. Sigma is designed from the ground up for **nanosecond-precision event processing**.
* **Realism matters** — Supports full **limit/market/IOC/FOK/GTC** order semantics, with matching and queue priority that reflect actual exchange rules.
* **Flexibility matters** — Whether you are backtesting a single pair or simulating cross-venue arbitrage, Sigma adapts with modular components.

## Features

* **⚡ Nanosecond Event Engine**
  Deterministic, timestamp-driven core built for throughput and reproducibility.

* **📚 Full Order Types**
  Market, Limit, IOC, FOK, and GTC orders supported with queue-based matching.

* **📈 Price/Quantity Precision**
  Backed by custom decimal types ensuring **lossless financial math**.

* **🔄 Simulation + Live Mode**
  Switch between historical replay, synthetic order flow, or live gateway integration.

* **🧩 Modular Architecture**
  Plug-in components for contract management, Redis-backed symbol maps, and mock gateways.

* **🧪 Strategy Sandbox**
  Run strategies against full order book depth, slippage models, and liquidity stress tests.

* **🛠️ Extensible API**
  Designed in modern **C++23** with concepts and CRTP-based customizations.


## Example Flow

```cpp
#include "order_book.hpp"
#include "simulator.hpp"

sigma::order_book_t book;
sigma::simulator_t sim(book);

// Insert limit and market orders
book.add_limit("ETH/USD", 2500.00, 5.0, sigma::side_t::buy);
book.add_market("ETH/USD", 10.0, sigma::side_t::sell);

// Advance simulator clock
sim.step();

// Query top of book
auto [bid, ask] = book.top("ETH/USD");
std::cout << "Bid: " << bid << " Ask: " << ask << "\n";
```

## Typical Uses

* **Strategy Backtesting** — Replay historical tick streams into a full book.
* **Market Microstructure Research** — Study slippage, queue priority, and latency arbitrage.
* **Exchange Connectivity Testing** — Validate FIX/REST/gRPC gateways against a synthetic market.
* **Risk Modeling** — Stress portfolios under varying liquidity regimes.

## Performance Profile

* **Engineered in modern C++23** with concepts, templates, and RAII-based safety.
* Scales from **single-threaded micro-benchmarks** to **distributed simulation clusters**.
* Precision timekeeping via custom nanosecond datetime system.

## Licensing & Availability

Sigma is a **proprietary system** developed by **Varga Consulting** (Toronto, Canada).
For commercial licensing or research partnerships, please contact:
📧 **[info@vargaconsulting.ca](mailto:info@vargaconsulting.ca)**

