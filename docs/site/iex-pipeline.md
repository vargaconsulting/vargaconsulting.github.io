# **IEX Pipeline: From Exchange to Analysis**

**Project Goal**

The **IEX Pipeline** is a two-stage, high-performance data pipeline that bridges the gap between free exchange data and quantitative research. It combines a **Rust downloader** that fetches terabytes of market data with a **C++23 converter** that transforms raw PCAP packets into compressed, query-efficient HDF5 arrays — ready for Julia, Python, MATLAB, or C++ analysis.

Together, these tools demonstrate what VargaLabs engineering looks like in practice: **fast, reliable, and built for researchers who need raw truth data without vendor lock-in.**

---

## **The Pipeline**

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  iex-download   │────▶│     iex2h5      │────▶│   Researcher    │
│  (Rust fetcher) │     │ (C++ converter) │     │ (Julia/Python)  │
│   ~340 LOC      │     │   ~4,500 LOC    │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                        │
        ▼                        ▼
   IEX HTTPS API            HDF5 / CSV / JSON
   .pcap.gz files           / REDIS output
```

**Stage 1 — Download:** `iex-download` fetches IEX historical datasets (TOPS, DEEP, DEEP+) using a PEG-based date parser and resilient HTTP transfers.

**Stage 2 — Convert:** `iex2h5` parses raw IEX-TP packet captures at wire speed and writes structured, compressed HDF5 datasets with nanosecond precision.

**Stage 3 — Analyze:** Open the resulting `.h5` file in Julia, Python, MATLAB, or R and query billions of ticks with sub-second latency.

---

## **Why This Matters**

IEX provides **17.5 TB of free historical tick data** spanning 2016–2025. For quantitative researchers, this is a goldmine — but only if you can actually get it into a usable format.

Traditional approaches are fragile:

* :material-cloud-download:{.icon} **Manual downloads** force you to click through thousands of files
* :material-file-question:{.icon} **Raw PCAPs** are binary, uncompressed, and hard to query
* :material-puzzle:{.icon} **Glue scripts** break when the feed format changes

The IEX Pipeline solves this end-to-end: **one command to fetch, one command to convert, one file to analyze.**

---

## **Performance**

| Stage | Metric | Value |
|-------|--------|-------|
| **Download** | Total dataset | **17.5 TB** across 4,984 files |
| **Download** | Binary size | **3.5 MB** single ELF (Rust, zero runtime deps) |
| **Convert** | Ingest speed | **65M events/sec** (HDF5 backend) |
| **Convert** | Compression | 40 GiB raw PCAP → **<600 MiB** HDF5 |
| **Convert** | Latency | **0.017 µs/tick** (HDF5 → HDF5) |

> **Platform:** Linux Mint 22.1, g++ 14.2.0, ThinkPad X1 Carbon Gen 12 (Intel Core Ultra 5 125U)

---

## **Tech Stack**

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Downloader** | Rust (edition 2021) | Fast, safe, portable HTTP fetching |
| **Converter** | C++23 | Zero-copy parsing, SIMD-friendly |
| **Storage** | HDF5 + h5cpp | Compressed, hierarchical, portable arrays |
| **Protocol** | IEX-TP | Native packet-level parsing (no libpcap dependency) |
| **Build** | CMake + Ninja | Cross-platform, reproducible builds |
| **CI** | GitHub Actions | Matrix testing across GCC/Clang × Ubuntu |

---

## **In Action**

<div id="asciicast-iex-download-demo" class="hidden md:block asciicast-player border border-solid border-gray-3 rounded-lg shadow-lg w-1/2 overflow-hidden mb-2 ml-4 float-right text-[9px]"></div>
--8<-- "iex-download-demo.script"

Watch the downloader in action — fetching terabytes with a progress bar that actually means something.

??? example ":fontawesome-solid-terminal:{.example} Step 1 — Download TOPS for 2025"
    ```bash
    iex-download --tops --directory ./data 2025-01-01..2025-01-31
    ```

??? example ":fontawesome-solid-terminal:{.example} Step 2 — Convert to HDF5"
    ```bash
    iex2h5 --convert all --output market-2025.h5 ./data/*.pcap.gz
    ```

??? example ":fontawesome-solid-terminal:{.example} Step 3 — Analyze in Python"
    ```python
    import h5py
    with h5py.File('market-2025.h5', 'r') as f:
        print(f['/time'][:10])  # first 10 timestamps
    ```

---

## **From the Blog**

* :material-newspaper:{.icon} [**I Analyzed 6TB of Raw Stock Market Data**](/blog/longest-active-stocks-from-iex-pcap/) — uncovering the 30 most consistently traded stocks on IEX (2025-09-05)
* :material-newspaper:{.icon} [**A Week of Market History Vanished**](/blog/iex-timestamp-glitch-wireshark/) — debugging an undocumented IEX timestamp sentinel (2025-09-12)
* :material-newspaper:{.icon} [**IEX-DOWNLOAD: Rust, Tick Data, and 13TB of Fun**](/blog/iex-download-rust/) — the story behind the Rust rewrite (2025-09-25)

---

## **Links**

> :fontawesome-brands-github:{.icon} **iex-download** — GitHub: [vargalabs/iex-download](https://github.com/vargalabs/iex-download) | Docs: [vargalabs.github.io/iex-download](https://vargalabs.github.io/iex-download) | DOI: [10.5281/zenodo.17188420](https://doi.org/10.5281/zenodo.17188420)

> :fontawesome-brands-github:{.icon} **iex2h5** — GitHub: [vargalabs/iex2h5](https://github.com/vargalabs/iex2h5) | Docs: [vargalabs.github.io/iex2h5](https://vargalabs.github.io/iex2h5) | DOI: [10.5281/zenodo.15677290](https://doi.org/10.5281/zenodo.15677290)

> :material-cube-outline:{.icon} **Powered by** [h5cpp](/site/h5cpp/) — the C++17 header-only HDF5 library that makes this possible.
