// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.27;

import {UltraVerifier} from "../noir2/target/my_circuit.sol";

contract MyContract {
  UltraVerifier public verifier;

  constructor(UltraVerifier _verifier) {
    verifier = _verifier;
  }
}
