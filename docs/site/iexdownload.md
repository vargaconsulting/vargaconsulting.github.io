
# **IEX-DOWNLOAD: Rust-Powered Access to IEX Historical Data**

**Project Goal**
IEX-DOWNLOAD is a robust command-line utility, written in pure Rust, for retrieving **IEX TOPS, DEEP, and DEEP+ historical datasets**. It provides fast, reliable downloads from the official IEX historical feed, making it trivial to bootstrap your research pipeline with **over 13 TB of market data (4,600+ files) spanning 2016–2025**.

It succeeds the original **Node.js IEX Download project**, preserving its automation features while adding the **performance, safety, and reliability of Rust**.

**The Problem**
Obtaining historical tick-level data from exchanges is often messy and error-prone:

* :material-cloud-download:{.icon} Manual: the official interface forces tedious, one-by-one downloads.
* :material-cancel:{.icon} Unreliable: network hiccups and partial transfers force restarts.
* :material-file-question:{.icon} Unstructured: managing thousands of files across years of trading days is cumbersome.


**The Solution**
**IEX-DOWNLOAD** brings together the **automation of the original Node.js version** with the **performance of Rust**:

* :material-lightning-bolt:{.icon} **Performs**: Rust delivers speed, safety, and reliability at scale.
* :material-calendar-edit:{.icon} **Flexible date ranges**: download a single day or entire multi-year spans in one command.
* :material-select-multiple:{.icon} **Dataset choice**: selectively fetch **TOPS**, **DEEP**, or **DEEP+** feeds.
* :material-magnify:{.icon} **Dry-run mode**: preview download size and files before committing.
* :material-transfer-right:{.icon} **Reliable transfers**: built-in retries, resumable downloads, and graceful handling of stalled connections.
* :material-folder-multiple:{.icon} **Organized output**: automatically stores datasets by feed and date, consistent with IEX conventions.
* :fontawesome-solid-terminal:{.icon} **Simple CLI**: no fragile scripts, just a single command.
* :material-history:{.icon} **Complete coverage**: supports all available feeds since December 2016.

**Why It Matters**
Market researchers, quants, and engineers need **raw truth data** to test ideas and power analytics. With IEX-DOWNLOAD, you don’t just get a handful of samples—you unlock the **entire IEX historical feed, 13+ terabytes strong**, reliably and reproducibly, without wrestling with brittle tooling.

Paired with **IEX2H5**, the Rust downloader + C++ converter form a complete pipeline:
:material-vector-arrange-above:{.icon} **download terabytes of PCAPs** → :material-database:{.icon} **convert into compressed HDF5 arrays** → :material-brain:{.icon} **analyze at scale**.

> :fontawesome-brands-github:{.icon} **Explore the Project**
> GitHub: [github.com/vargaconsulting/iex-download](https://github.com/vargaconsulting/iex-download)
> Docs: [vargaconsulting.github.io/iex-download](https://vargaconsulting.github.io/iex-download)

[repo]: https://github.com/vargaconsulting/iex-download
[docs]: https://vargaconsulting.github.io/iex-download
