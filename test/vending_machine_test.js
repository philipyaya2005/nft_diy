const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VendingMachines", function () {
  // A common pattern is to declare some variables, and assign them in the
  // `before` and `beforeEach` callbacks.

  let Token;
  let hardhatToken;
  let owner;
  let addr1;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    [owner, addr1] = await ethers.getSigners();
  });

  it("Be able to do snack transactions", async function () {
    const VendingMachine = await ethers.getContractFactory("VendingMachine");
    const initalSnacks = 100;
    const vendingmachine = await VendingMachine.deploy(initalSnacks);
    await vendingmachine.deployed();

    expect(await vendingmachine.getVendingMachineBalance()).to.equal(initalSnacks);

    // puchase 10 snacks
    await vendingmachine.purchaseSnack(10);
    expect(await vendingmachine.getVendingMachineBalance()).to.equal(initalSnacks - 10);

    // restore 10 snacks and check
    // vendingmachine.addValue(ethers.utils.parseEther("20000000000000000000"));
    await vendingmachine.purchaseSnack(10, {value: ethers.utils.parseEther("20000000000000000000")} );
    expect(await vendingmachine.getVendingMachineBalance()).to.equal(initalSnacks - 10);

    await vendingmachine.restockSnacks(10);
    expect(await vendingmachine.getVendingMachineBalance()).to.equal(initalSnacks);
    // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // // wait until the transaction is mined
    // await setGreetingTx.wait();

    // expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
