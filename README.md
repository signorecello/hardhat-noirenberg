<img align="right" width="150" height="150" top="100" src="./assets/banner.jpg">

# Hardhat Noirenberg

Develop [Noir](https://noir-lang.org) projects with the [Barretenberg](https://github.com/AztecProtocol/aztec-packages/tree/master/barretenberg/ts) proving backend within a [Hardhat](https://hardhat.org) project without hassle.

> [!INFO]
> This is a fork of @olehmisar's amazing [hardhat-noir plugin](https://github.com/olehmisar/hardhat-noir) that features a full JS experience interacting with Noir. It's also pretty minimal. If you're looking for a plugin that gives you Nargo workspaces support, CLI tooling installation, `init` commands, and other features, check out Oleh's project!

## What is this

Write programs in Noir, generate Solidity verifiers with Barretenberg, and deploy them with Hardhat.

## Installation

Within your hardhat project, install the plugin:

```bash
npm install hardhat-noirenberg
```

Import it your `hardhat.config.js`:

```js
require("hardhat-noirenberg"); // for cjs, or
import "hardhat-noirenberg"; // for esm
```

Specify the Solidity configuration:

**You must enable Solidity optimizer in order to be able to deploy Solidity verifier contracts.**

```js
const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.27",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  }
};
```

## Prerequisites

To get started, create a Noir circuit in `noir` folder. For example, if you're using [nargo](https://noir-lang.org/docs/getting_started/noir_installation):

```bash
nargo init .
```

It will create `noir/my_noir` folder with the following `src/main.nr`:

```rs
fn main(x: Field, y: pub Field) {
    assert(x != y);
}
```

## Usage

Your instance `noirenberg` now has compatible versions of `NoirJS` and `BB.JS`. Check their reference documentation [here](https://noir-lang.org/docs/reference/NoirJS/noir_js/) and [here](https://github.com/AztecProtocol/aztec-packages/tree/master/barretenberg/ts).

We're now ready to generate proofs. For example, in a hardhat test file or script:

```js
  const { noir, backend } = await hre.noirenberg.compile();
  const { witness } = await noir.execute({ x: 1, y: 2 });
  const proof = await backend.generateProof(witness);
```

Generate a Solidity verifier in the default hardhat `sources` folder:

```js
  await hre.noirenberg.getSolidityVerifier();
```

## Environment extensions

This plugin extends the Hardhat Runtime Environment by adding a `noir` field, and defines the path where your Noir project is. It defaults to a folder called `noir` at the root of the hardhat project.

For example, if you prefer to make it named `circuits`:

```js
export default {
  paths: {
    noir: "circuits",
  },
};
```

## Examples

Refer to the test suite for an E2E example of a hardhat project using Noirenberg.
