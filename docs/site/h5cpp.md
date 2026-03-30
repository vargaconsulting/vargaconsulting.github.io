
# **H5CPP – Easy-to-Use HDF5 Templates for Serial and Parallel C++ I/O**

**Project Goal**
**H5CPP** provides a high-level, modern C++ interface for HDF5, supporting both serial and parallel backends. Built around C++17 templates, it offers **seamless persistence of STL containers, Eigen, Armadillo, Blaze, and more**, while remaining interoperable with the native HDF5 C-API. Whether you're building scientific applications, HPC workflows, or financial time series systems, H5CPP lets you write expressive, safe, and fast I/O code—without ceremony.

**Features**

* **:simple-matrix:{.icon} Dataset Templates**
  Templates like `h5::create<T>()`, `h5::read<T>()`, and `h5::write<T>()` support STL containers, linear algebra types (Armadillo, Eigen3, etc.), and plain-old data (POD) structs.

* **:simple-typeorm:{.icon} Custom Data Types**
  You can pass an explicit `h5::dt_t<T>` to handle custom encodings—UTF-8 strings, opaque structs, unions, or any exotic binary layout.

* **:material-harddisk-plus:{.icon} Compiler-Assisted I/O**
  Optional LLVM-based code generation transforms annotated C++ headers into HDF5 struct descriptors, enabling seamless persistence of complex types.

* **:material-view-parallel:{.icon} Parallel HDF5 Support**
  Drop-in MPI support via `h5::mpiio(...)`, with support for both `h5::collective` and `h5::independent` data transfer modes.

* **:material-waves:{.icon} Appendable Streams**
  Write streaming time series or logging data with `h5::append()` to unlimited-size chunked datasets (with optional compression).

* **:material-lightbulb-on:{.icon} Expression Templates for I/O Policies**
  Compose I/O properties with `|` syntax:
      `h5::chunk{1024} | h5::gzip{9}`

* **:material-handshake-outline:{.icon} Native HDF5 C-API Interop**
  All H5CPP types (`fd_t`, `ds_t`, `dt_t`, etc.) support implicit conversion to `hid_t`, so you can mix C++ and C HDF5 calls freely.

* **:fontawesome-regular-share-from-square:{.icon} RAII-Based Resource Management**
  Every descriptor (file, dataset, dataspace, datatype) cleans up automatically via RAII, with no need for manual `H5*close()` calls.

* **:fontawesome-solid-explosion:{.icon} Tested Field Types**
  Extensive support for:
  – `std::vector<T>`
  – Armadillo: `Mat`, `Col`, `Cube`
  – Eigen3: `Matrix`, `Array`, dynamic shapes
  – Blitz++, Blaze, IT++, Dlib, uBLAS
  – C/C++ structs and `std::string`


**Example: Appending to a Chunked Dataset**

```cpp
auto pt = h5::create<my_struct>(fd, "data/stream", h5::max_dims{H5S_UNLIMITED},
                                h5::chunk{1000} | h5::gzip{9});
h5::append(pt, record); // record is of type my_struct
```

**Parallel HDF5: MPI-Enabled**

```cpp
#include <h5cpp/parallel>
h5::mpiio mpi_config{MPI_COMM_WORLD, MPI_INFO_NULL};

auto ds = h5::create<my_struct>(fd, "mpi/data", h5::mpiio{mpi_config},
                                h5::max_dims{H5S_UNLIMITED}, h5::chunk{1024});
```

---

**Supported Types**

✔ `std::vector<T>`
✔ Armadillo: `Mat`, `Col`, `Cube`, ...
✔ Eigen3: `Matrix`, `Array`, dynamic sizes
✔ Blaze, Blitz++, IT++, Dlib, uBLAS
✔ C/C++ structs with or without compiler-assist
✔ `std::string`, variable-length UTF-8 strings

**Use Cases**

* :material-format-superscript:{.icon} HPC simulation with MPI & HDF5
* :simple-matrix:{.icon} Persisting matrix operations from LINALG libraries
* :material-chart-line:{.icon .pulsate} High-frequency trading datasets with `append()`
* :material-swap-horizontal-bold:{.icon} Transparent C/C++ struct serialization
* :fontawesome-solid-graduation-cap:{.icon} Teaching HDF5 via modern C++


> 🔗 **Explore the Project**
> GitHub: [github.com/vargalabs/h5cpp](https://github.com/vargalabs/h5cpp)
> 💬 Featured on [The HDF Group Blog](https://blog.hdfgroup.org/) and presented at ISC’19 & EHUG.

