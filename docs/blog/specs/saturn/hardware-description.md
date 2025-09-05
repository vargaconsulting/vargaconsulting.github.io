??? example ":material-information:{.example} System Specs — Single Desktop Workstation (ZFS-backed)"

    This entire pipeline was executed on a **single desktop workstation** — no cluster, no GPU, no cloud — just efficient C++ and smart data layout:

    * :octicons-cpu-24: **CPU**: Intel Core i7‑11700K @ 3.60 GHz (8 cores / 16 threads)
    * :material-memory: **RAM**: 64 GiB DDR4
    * :material-integrated-circuit-chip: **Scratch Disk**: 3.6 TB NVMe SSD (`/mnt`)
    * :fontawesome-solid-floppy-disk: **Main Archive**: 15 TB ZFS pool (`/lake`), spanned 2× 8 TB HDDs 
        * Pool name: `lake`, Dataset: `lake/stock`, Compression: **off** (default), Recordsize: **128K** (default), Deduplication: **off**
    * 🐧 **OS**: Ubuntu 22.04 LTS

    ??? example ":material-speedometer-slow:{.example} Read performance of ZFS based Lake **254MB/s** sustained "
        ```bash
        --8<-- "saturn/zfs-sequential-read.fio"
        ```
    ??? example ":material-speedometer:{.example} Read performance of NVME scratch disk **4GB/s** sustained"
        ```bash
        --8<-- "saturn/nvme-sequential-read.fio"
        ```
    ??? example ":material-speedometer-medium:{.example} Write performance of NVME scratch disk **2GB/s** sustained"
        ```bash
        --8<-- "saturn/nvme-sequential-write.fio"
        ```