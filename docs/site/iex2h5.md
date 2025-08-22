# **IEX2H5: From Raw Packets to Research-Ready Prices**

**Project Goal**
IEX2H5 transforms raw IEX exchange data—captured as PCAP files—into clean, compressed, and query-efficient HDF5 arrays. It bridges the gap between archival tick data and quantitative strategy development, making large-scale time-series analysis as simple as invoking a single command.

**The Problem**
Tick-level market data is voluminous, noisy, and stored in low-level binary formats. Traditional ingestion pipelines are:

* :material-speedometer-slow:{.icon} Slow: parsing millions of messages per second is non-trivial.
* :fontawesome-regular-floppy-disk:{.icon} Heavy: inefficient storage formats result in bloated datasets.
* :fontawesome-solid-puzzle-piece:{.icon} Fragmented: transforming PCAPs into research-grade datasets typically requires a pipeline of tools with fragile glue code.

**The Solution**
**IEX2H5** implements a minimal-dependency, high-performance C++ application that:

* :material-brain:{.icon} **Understands IEX**: parses native IEX DEEP/TOPS protocols at the packet level.
* :material-harddisk-plus:{.icon} **Stores efficiently**: compresses billions of events into structured, schema-aware HDF5 datasets.
* :material-timer-10:{.icon} **Resamples on the fly**: extracts OHLCV bars, real-time snapshots, and trade stats—directly during import.
* :material-rabbit:{.icon} **Performs**: demonstrated ingest speed of **65M events/sec**, reducing 40 GiB of raw data into <600 MiB.
* :simple-portableappsdotcom:{.icon} **Supports reproducibility**: deterministic, portable `.h5` output files with nanosecond precision timestamps.

**Why It Matters**
IEX2H5 enables researchers, quants, and infrastructure teams to store and process tick data **once**, and analyze **forever**. It’s built to reduce friction between data acquisition and insight.

Whether you want to build a custom factor model, simulate an HFT strategy, or just explore market microstructure—the data’s ready.
> :fontawesome-brands-internet-explorer:{.icon} **Explore the Project**
> GitHub: [github.com/vargaconsulting/iex2h5](https://github.com/vargaconsulting/iex2h5)
> Docs: [vargaconsulting.github.io/iex2h5](https://vargaconsulting.github.io/iex2h5)

[repo]: https://github.com/vargaconsulting/iex2h5
[docs]: https://vargaconsulting.github.io/iex2h5