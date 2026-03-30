# :material-language-typescript:{.icon} IEX Download

**Automated Access to IEX Historical Market Data**

The Investors Exchange (IEX) provides free access to its historical datasets — including **TOPS** (top-of-book quotes and trades) and **DEEP** (detailed order book with depth-of-market snapshots). While valuable, the official interface forces users to manually click through each file, making large-scale downloads inefficient and error-prone.

The IEX Download project was created to address the challenge of retrieving large volumes of IEX historical data efficiently. It automates the bulk acquisition of packet capture (pcap) files provided by IEX and, when paired with the companion project IEX2H5, transforms these raw datasets into research-ready HDF5 arrays — enabling high-speed time-series analysis and rigorous backtesting at scale.

## Problems & Solutions

* :material-bottle-tonic-plus:{.icon} **Manual bottlenecks** → Automated, scriptable downloads across date ranges.
* :material-select-drag:{.icon} **File selection overhead** → Support for choosing **TOPS** or **DEEP** datasets on demand.
* :material-run-fast:{.icon} **Uncertainty in runs** → Dry-run mode to test queries without downloading.
* :material-approximately-equal-box:{.icon} **Stalled or failed transfers** → Built-in retry logic and progress timeout handling.
* :material-format-paragraph-spacing:{.icon} **Usability gap** → Visual progress bars and flexible download directory settings.

## Features

* **:material-vector-arrange-above:{.icon} Bulk Automation** — Retrieve entire ranges of historical datasets without manual effort.
* **:material-calendar-edit:{.icon} Flexible Date Selection** — Download data across any custom time window.
* **:material-select-multiple:{.icon} Dataset Choice** — Access either **TOPS** (top-of-book) or **DEEP** (depth-of-book) feeds depending on your analysis needs.
* **:material-magnify:{.icon} Preview Mode** — Run queries in dry-run mode to confirm parameters before downloading.
* **:material-format-header-5:{.icon} Custom Storage** — Choose exactly where your datasets are saved.
* **:material-transfer-right:{.icon} Reliable Transfers** — Automatic safeguards against stalled or incomplete downloads.
* **:material-check-all:{.icon} Ready for Analysis** — Designed to work hand-in-hand with **IEX2H5** for seamless conversion to HDF5 arrays.


Do you want me to also rewrite the **Usage section** in the same "feature-first" style, so it reads more like a product capability page rather than a developer tool manual?


> :fontawesome-brands-github:{.icon} **Explore the Project**
> GitHub: [github.com/vargalabs/iex-download](https://github.com/vargalabs/iex-download)
> Docs: [vargalabs.github.io/iex-download](https://vargalabs.github.io/iex-download)

[repo]: https://github.com/vargalabs/iex-download
[docs]: https://vargalabs.github.io/iex-download

The data is provided free of charge by IEX. By accessing or using IEX
Historical Data, you agree to their Terms of Use. For more information,
visit: https://iextrading.com/iex-historical-data-terms/

INSTALLATION:
	npm install ./iex-download-x.y.z.tgz


Options:
  --version                 Show version number  [boolean]
  --deep                    Download IEX DEEP datasets
  --tops                    Download IEX TOPS datasets
  --directory               Location to save downloaded files  [default: "./"]
  --progress_stall_timeout  Timeout duration (in seconds) to detect and handle stalled downloads  [default: 30]
  --max_retry               Number of times to retry downloading the same file before giving up  [default: 5]
  --from                    Date you start downloading from  [default: "2025-08-19"]
  --to                      Last day to download  [default: "2025-08-21"]
  --dry-run                 Skips downloading
  --help                    Show help  [boolean]

Copyright © <2017-2025> Varga Consulting, Toronto, ON. info@vargaconsulting.ca

```

## Licensing & Credits

* Data is provided free of charge by **IEX Exchange**, subject to their [Terms of Use](https://iextrading.com/iex-historical-data-terms/).
* Project © 2017–2025 **Varga Consulting**, Toronto, ON.
