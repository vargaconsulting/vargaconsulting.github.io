
# UDS++ – High-Performance Interprocess Communication

**Proprietary Software – © 2018-2025 Varga Consulting, Toronto, ON, Canada**

## Overview

UDS++ is a lightweight, high-performance library for **interprocess communication (IPC)** over Unix Domain Sockets. It is designed for **low-latency trading systems, data services, and simulation platforms** where predictable performance and efficient message handling are critical.

Unlike generic socket wrappers, UDS++ provides a **specialized protocol layer** with structured headers, typed payloads, and **RAII-based resource safety in C++**, alongside **Python bindings** for rapid prototyping and integration.

The result: a consistent, fast, and fault-tolerant way to connect independent processes in a system where every microsecond counts.

## Why It Exists

* **Unix Domain Sockets are fast, but raw APIs are clumsy.** They require boilerplate, manual epoll/poll integration, and error-prone buffer handling.
* **Structured communication matters.** Trading and simulation workflows rely on typed messages—symbols, subscriptions, trades, errors—sent at very high volume.
* **Consistency across languages.** UDS++ provides both C++ and Python APIs, ensuring production performance with flexible testing.

## Features

| Category                   | Description                                                                  |
| -------------------------- | ---------------------------------------------------------------------------- |
| :fontawesome-solid-down-left-and-up-right-to-center:{.icon} **Low-Latency IPC**      | Built on `SOCK_SEQPACKET` Unix domain sockets for predictable message flow.  |
| :simple-instructure:{.icon} **Structured Protocol** | Typed messages (index, subscribe, unsubscribe, trades, errors) with headers. |
| :material-poll:{.icon} **Epoll Integration**   | Efficient polling mechanism with backpressure handling.                      |
| :material-hand-cycle:{.icon} **Safe Lifecycle**     | RAII wrappers in C++ and thread-safe stop/start in Python.              |
| :material-recycle-variant:{.icon} **Request/Response**    | Synchronous request sending with asynchronous reply dispatch.     |
| :material-hook:{.icon} **Testing Hooks**       | Dry-run and event simulation supported for rapid iteration.                  |
| :material-language-python:{.icon} **Python Bindings**     | Full client support for prototyping and scripting.                       |


## Example Usage

**Python Client**

```python
from uds import UDS
from protocol import index_t

class MyClient(UDS):
    def reply(self, data: bytes, n: int):
        print("Received reply:", data[:n])

client = MyClient("/tmp/uds.sock")
client.start()
client.request(index_t.pack(1, symbols=1, contracts=1))
client.wait_for_sigint()
```

**C++ Integration**

```cpp
uds::server_t server("/tmp/uds.sock");
server.start();

// Structured message dispatch
server.on<protocol::trade_report_t>([](const auto& trade) {
    std::cout << "Trade received: "
              << trade.symbol << " "
              << trade.price << " x "
              << trade.size << std::endl;
});
```

## Use Cases

* **Trading Systems** – ultra-low latency order routing and market data fan-out.
* **Backtesting Engines** – coordinating simulation tasks across distributed processes.
* **Cluster Services** – metadata servers, schedulers, and monitoring agents.

## License

**Proprietary Software**
All rights reserved © 2018–2025 Varga Consulting.
Contact: **[info@vargaconsulting.ca](mailto:info@vargaconsulting.ca)**

