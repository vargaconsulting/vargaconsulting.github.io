# Varga Consulting

Welcome to the **Varga Consulting umbrella repo**.

This repository only serves as an entry point — all of the polished content, project showcases, and documentation are published on our **GitHub Pages site**:

👉 **[https://vargaconsulting.github.io](https://vargaconsulting.github.io)**

### What you’ll find on the site

* High-performance trading infrastructure (C++, Rust, Julia, Python)
* Market data pipelines (IEX2H5 and more)
* Cryptographic protocol R\&D
* Tools for HPC, data engineering, and distributed systems

**This repo itself won’t contain source code** — it’s just the **front door**. Head to the site for the real content.


# *Python virtual environment for this Website
## Setup
```bash
python3 -m venv .venv           # Create venv (Python 3.10+ recommended)
source .venv/bin/activate       # On Linux / macOS activate the environment
pip install --upgrade pip       # install pip
pip install mkdocs-material     # and material theme
pip install python-frontmatter jinja2 python-dateutil pyyaml
pip freeze > requirements.txt
```

## Run

```bash
source .venv/bin/activate
reset && mkdocs serve --dev-addr=127.0.0.1:9000
python scripts/generate_og_default.py # generate images
mkdocs build -v                       # generate website locally
```


## Test RSS
```bash
reset && mkdocs serve --dev-addr=127.0.0.1:9000     # start mkdocs
curl -s http://localhost:9000/rss.xml  # 
```