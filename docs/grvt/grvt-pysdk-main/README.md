<p align="center">
  <a href="https://github.com/astral-sh/uv" target="blank"><img src="https://github.com/astral-sh/uv/blob/8674968a17e5f2ee0dda01d17aaf609f162939ca/docs/assets/logo-letter.svg" height="100" alt="uv logo" /></a>
  <a href="https://pre-commit.com/" target="blank"><img src="https://pre-commit.com/logo.svg" height="100" alt="pre-commit logo" /></a>
  <a href="https://github.com/astral-sh/ruff" target="blank"><img src="https://raw.githubusercontent.com/astral-sh/ruff/8c20f14e62ddaf7b6d62674f300f5d19cbdc5acb/docs/assets/bolt.svg" height="100" alt="ruff logo" style="background-color: #ef5552" /></a>
  <a href="https://bandit.readthedocs.io/" target="blank"><img src="https://raw.githubusercontent.com/pycqa/bandit/main/logo/logo.svg" height="100" alt="bandit logo" /></a>
  <a href="https://docs.pytest.org/" target="blank"><img src="https://raw.githubusercontent.com/pytest-dev/pytest/main/doc/en/img/pytest_logo_curves.svg" height="100" alt="pytest logo" /></a>
</p>

<p align="center">
  <a href="https://docs.docker.com/" target="blank"><img src="https://www.docker.com/wp-content/uploads/2022/03/Moby-logo.png" height="60" alt="Docker logo" /></a>
  <a href="https://github.com/features/actions" target="blank"><img src="https://avatars.githubusercontent.com/u/44036562" height="60" alt="GitHub Actions logo" /></a>
</p>

# GRVT Python SDK

[![CodeQL](https://github.com/smarlhens/python-boilerplate/workflows/codeql/badge.svg)](https://github.com/smarlhens/python-boilerplate/actions/workflows/codeql.yml)
[![GitHub CI](https://github.com/smarlhens/python-boilerplate/workflows/ci/badge.svg)](https://github.com/smarlhens/python-boilerplate/actions/workflows/ci.yml)
[![GitHub license](https://img.shields.io/github/license/smarlhens/python-boilerplate)](https://github.com/smarlhens/python-boilerplate)

---

## Table of Contents

- [GRVT Python SDK](#grvt-python-sdk)
  - [Table of Contents](#table-of-contents)
  - [What's in the library](#whats-in-the-library)
    - [Environments](#environments)
    - [Files](#files)
  - [Installation via pip](#installation-via-pip)
    - [Configuration](#configuration)
  - [Usage](#usage)
  - [Contributor's guide](#contributors-guide)
    - [Prerequisites](#prerequisites)
    - [Installation of a source code](#installation-of-a-source-code)
    - [Manually run example files](#manually-run-example-files)
    - [What's in the box ?](#whats-in-the-box-)
      - [uv](#uv)
      - [pre-commit](#pre-commit)
      - [ruff](#ruff)
      - [mypy](#mypy)
      - [bandit](#bandit)
      - [docformatter](#docformatter)
      - [Testing](#testing)
      - [Makefile](#makefile)

---

## What's in the library

GRVT Python SDK library provides Python classes and utility methods for easy access to GRVT API endpoints across all environments.

### Environments

- `prod` - Production environment.
- `testnet` - Testnet environment.
- `staging` - Development Integration environment.
- `dev` - Development environment.

SDK Library provides two types of classes:

1. **Raw** - thin wrapper classes around Rest API.
2. **Ccxt-compatible** - classes with ccxt-like methods. Provide access to both Rest API and WebSockets.

### Files

Raw access:

- `grvt_raw_base.py` - base classes for Rest API access.
- `grvt_raw_env.py` - definitions of environments for raw access.
- `grvt_raw_signing.py` - utility methods for signing orders.
- `grvt_raw_sync.py` - class for raw synchronous calls to Rest API.
- `grvt_raw_async.py` - class for raw asynchronous calls to Rest API.

CCXT-compatible access:

- `grvt_ccxt_utils.py` - utility methods for signing orders.
- `grvt_ccxt_env.py` - definitions of environments for ccxt-like access.
- `grvt_ccxt_base.py` - base class for Rest API access.
- `grvt_ccxt.py` - class for synchronous calls to Rest API.
- `grvt_ccxt_pro.py` - class for asynchronous calls to Rest API.
- `grvt_ccxt_ws.py` - class for WebSocket calls.

## Installation via pip

```bash
pip install grvt-pysdk
```

### Configuration

Setup these environment variables:

```bash
export GRVT_PRIVATE_KEY="`Secret Private Key` in API setup"
export GRVT_API_KEY="`API Key` in API setup"
export GRVT_TRADING_ACCOUNT_ID=<`Trading account ID` in API>
export GRVT_ENV="testnet"
export GRVT_END_POINT_VERSION="v1"
export GRVT_WS_STREAM_VERSION="v1"
```

## Usage

**Examples of how to use various methods to connect to GRVT API:**

- [GRVT CCXT](https://github.com/gravity-technologies/grvt-pysdk/blob/main/tests/pysdk/test_grvt_ccxt.py) - Example of usage of CCXT-compatible Python class `GrvtCcxt` with `synchronous` Rest API calls.
- [GRVT CCXT Pro](https://github.com/gravity-technologies/grvt-pysdk/blob/main/tests/pysdk/test_grvt_ccxt_pro.py) - Example of usage of CCXT.PRO-compatible Python class `GrvtCcxtPro` with `asynchronous` Rest API calls.
- [GRVT CCXT WS](https://github.com/gravity-technologies/grvt-pysdk/blob/main/tests/pysdk/test_grvt_ccxt_ws.py) - Example of usage of CCXT.PRO-compatible Python class `GrvtCcxtWS` with `asynchronous` Rest API calls + Web Socket subscriptions + JSON RPC calls over Web Sockets.
- [GRVT API Sync](https://github.com/gravity-technologies/grvt-pysdk/blob/main/tests/pysdk/test_grvt_raw_sync.py) - Synchronous API client for GRVT
- [GRVT API Async](https://github.com/gravity-technologies/grvt-pysdk/blob/main/tests/pysdk/test_grvt_raw_async.py) - Asynchronous API client for GRVT

## Contributor's guide

### Prerequisites

- [Python](https://www.python.org/downloads/) **>=3.10.0 < 3.13** (_tested with 3.10.15_)
- [pre-commit](https://pre-commit.com/#install)
- [uv](https://docs.astral.sh/uv/getting-started/installation/) **>=0.3.3** (_tested with 0.4.0_)
- [docker](https://docs.docker.com/get-docker/) (_optional_)

### Installation of a source code

1. Clone the git repository

   ```bash
   git clone https://github.com/grvt-technologies/grvt-pysdk.git
   ```

2. Go into the project directory

   ```bash
   cd grvt-pysdk/
   ```

3. Checkout working branch

   ```bash
   git checkout <branch>
   ```

4. Install dependencies

   ```bash
   make install
   ```

5. Enable pre-commit hooks

   ```bash
   pre-commit install
   ```

---

### Manually run example files

Example files run extensive testing of the SDK API classes and log details about details of using GRVT API.

1. Change to tests folder

   ```bash
   cd tests/pysdk
   ```

2. Run example of using synchronous CCXT-compatible calls to `Rest API` via `grvt_ccxt.py`, class `GrvtCcxt`

   ```bash
   uv run python3 test_grvt_ccxt.py
   ```

3. Run example of using asynchronous CCXT-compatible calls to `Rest API` via `grvt_ccxt_pro.py`, class `GrvtCcxtPro`

   ```bash
   uv run python3 test_grvt_ccxt_pro.py
   ```

4. Run example of using WebSockets subscriptions and JSON RPC calls via `grvt_ccxt_ws.py`, class `GrvtCcxtWS`

   ```bash
   uv run python3 test_grvt_ccxt_ws.py
   ```

### What's in the box ?

#### uv

[uv](https://github.com/astral-sh/uv) is an extremely fast Python package and project manager, written in Rust.

**pyproject.toml file** ([`pyproject.toml`](pyproject.toml)): orchestrate your project and its dependencies
**uv.lock file** ([`uv.lock`](uv.lock)): ensure that the package versions are consistent for everyone
working on your project

For more configuration options and details, see the [configuration docs](https://docs.astral.sh/uv/).

#### pre-commit

[pre-commit](https://pre-commit.com/) is a framework for managing and maintaining multi-language pre-commit hooks.

**.pre-commit-config.yaml file** ([`.pre-commit-config.yaml`](.pre-commit-config.yaml)): describes what repositories and
hooks are installed

For more configuration options and details, see the [configuration docs](https://pre-commit.com/).

#### ruff

[ruff](https://github.com/astral-sh/ruff) is an extremely fast Python linter, written in Rust.

Rules are defined in the [`pyproject.toml`](pyproject.toml).

For more configuration options and details, see the [configuration docs](https://github.com/astral-sh/ruff#configuration).

#### mypy

[mypy](http://mypy-lang.org/) is an optional static type checker for Python that aims to combine the benefits of
dynamic (or "duck") typing and static typing.

Rules are defined in the [`pyproject.toml`](pyproject.toml).

For more configuration options and details, see the [configuration docs](https://mypy.readthedocs.io/).

#### bandit

[bandit](https://bandit.readthedocs.io/) is a tool designed to find common security issues in Python code.

Rules are defined in the [`pyproject.toml`](pyproject.toml).

For more configuration options and details, see the [configuration docs](https://bandit.readthedocs.io/).

#### docformatter

[docformatter](https://github.com/PyCQA/docformatter) is a tool designed to format docstrings to
follow [PEP 257](https://peps.python.org/pep-0257/).

Options are defined in the [`.pre-commit-config.yaml`](.pre-commit-config.yaml).

---

#### Testing

We are using [pytest](https://docs.pytest.org/) & [pytest-cov](https://github.com/pytest-dev/pytest-cov) to write tests.

To run tests with coverage:

```bash
make test
```

```text
Name                                      Stmts   Miss  Cover
-------------------------------------------------------------
src/pysdk/__init__.py                         0      0   100%
src/pysdk/grvt_ccxt.py                      238     21    91%
src/pysdk/grvt_ccxt_base.py                 196     57    71%
src/pysdk/grvt_ccxt_env.py                   48     12    75%
src/pysdk/grvt_ccxt_logging_selector.py      15      7    53%
src/pysdk/grvt_ccxt_pro.py                  245     69    72%
src/pysdk/grvt_ccxt_test_utils.py            30      4    87%
src/pysdk/grvt_ccxt_types.py                 41      0   100%
src/pysdk/grvt_ccxt_utils.py                237     89    62%
src/pysdk/grvt_ccxt_ws.py                   275    238    13%
src/pysdk/grvt_raw_async.py                 149    109    27%
src/pysdk/grvt_raw_base.py                  154     69    55%
src/pysdk/grvt_raw_env.py                    27      5    81%
src/pysdk/grvt_raw_signing.py                33     17    48%
src/pysdk/grvt_raw_sync.py                  149    109    27%
src/pysdk/grvt_raw_types.py                1031      0   100%
-------------------------------------------------------------
TOTAL                                      2868    806    72%


=================================================================================================== 8 passed in 58.20s ====================================================================================================
```

#### Makefile

We are using [Makefile](https://www.gnu.org/software/make/manual/make.html) to manage the project.

To see the list of commands:

```bash
make
```

```bash
➜  grvt-pysdk git:(main) ✗ make
help                           Show this help
run                            Run the project
test                           Run the tests
precommit                      Run the pre-commit hooks
lint                           Run the linter
format                         Run the formatter
typecheck                      Run the type checker
security                       Run the security checker
clean                          Clean the project
install                        Install the project
build                          Build the project
publish                        Publish the project
```

---
