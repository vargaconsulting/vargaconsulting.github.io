# **H5CPP Compiler – Automated Struct Reflection for HDF5 C++ Templates**

**Project Goal**
The **H5CPP Compiler** is a source-to-source transformation tool designed to eliminate the boilerplate of manual HDF5 compound datatype definitions. It scans your C++ translation unit, identifies all **POD (Plain Old Data)** types used in H5CPP I/O operations, and **automatically generates the HDF5 type descriptors** needed for seamless persistence.

This enables a Python-like experience for C++—structs can be written directly with `h5::write`, `h5::read`, or `h5::create`, and the compiler handles the hard part.

**Features**

* **:fontawesome-solid-explosion:{.icon} AST-Based Code Analysis**
  Builds a full Clang AST of your C++ file to detect all transitive POD types involved in HDF5 I/O.

* **:material-generator-portable:{.icon} Automatic Type Descriptor Generation**
  Outputs a header file with `h5::dt_t<T>` specializations, mapping C++ struct layouts to HDF5 COMPOUND datatypes.

* **:material-submarine:{.icon} Deep Struct Traversal**
  Handles deeply nested structs, multidimensional arrays, and typedefs—even when embedded in STL containers like `std::vector`.

* **:fontawesome-solid-droplet:{.icon} Drop-In Integration with H5CPP**
  Generated headers are guarded and fully compatible with H5CPP's header-only I/O templates.

* **:material-not-equal:{.icon} Ignored/Unsupported Types**
  Skips non-POD types (e.g., `std::string`, classes with constructors) and ignores unused structs entirely.

**How It Works**

Just annotate your code with `h5::write`, `h5::read`, or `h5::create`, like:

```cpp
std::vector<sn::example::Record> vec = h5::utils::get_test_data<sn::example::Record>(20);
h5::write(fd, "orm/partial/vector", vec);  // triggers AST tracing
```

The compiler traces all referenced types top-down:

```cpp
namespace sn::example {
  struct Record {
    MyUInt idx;
    float field_02[7];
    sn::other::Record field_03[5];     // nested structs
    other::Record field_05[3][8];      // multidimensional arrays
  };
}
```

Then generates a header with `h5::dt_t<sn::example::Record>` that you include in your codebase.

**Install**

Only **LLVM 6.0** is currently supported. To compile from source:

```bash
sudo apt install llvm-6.0 llvm-6.0-dev libclang-6.0-dev
make && sudo make install
```

To reduce disk usage after installation:

```bash
sudo apt purge llvm-6.0 libclang-6.0-dev
sudo apt install libllvm6.0 libclang-common-6.0-dev
```

**Usage**

```bash
h5cpp your_translation_unit.cpp -- -std=c++17 -Imy/include/path
```

This emits a file (e.g., `generated.hpp`) containing all required `h5::dt_t<T>` specializations.

> 🔗 **Explore the Project**
> GitHub: [github.com/steven-varga/h5cpp-compiler](https://github.com/steven-varga/h5cpp-compiler)
Build once, persist anywhere. Let your structs speak HDF5.

