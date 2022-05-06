const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VendingMachines", function () {
  // A common pattern is to declare some variables, and assign them in the
  // `before` and `beforeEach` callbacks.

  // let Token;
  // let hardhatToken;
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
    let snackStocks = 100;
    const vendingmachine = await VendingMachine.deploy(snackStocks);
    await vendingmachine.deployed();

    expect(await vendingmachine.getVendingMachineBalance()).to.equal(snackStocks);

    // purchase 10 snacks
    await vendingmachine.purchaseSnack(10, {value: ethers.utils.parseEther("20")} );
    snackStocks -= 10;

    // purchase then restock snacks
    await vendingmachine.purchaseSnack(10, {value: ethers.utils.parseEther("20")} );
    snackStocks -= 10;
    expect(await vendingmachine.getVendingMachineBalance()).to.equal(snackStocks);

    // restore 10 snacks and check
    await vendingmachine.restockSnacks(10);
    snackStocks += 10;
    expect(await vendingmachine.getVendingMachineBalance()).to.equal(snackStocks);
  });

  it("Test not enough eth", async function () {
    const VendingMachine = await ethers.getContractFactory("VendingMachine");
    const snackStocks = 100;
    const vendingmachine = await VendingMachine.deploy(snackStocks);
    await vendingmachine.deployed();


    // purchase 10 snacks
    const buySnack = vendingmachine.purchaseSnack(1);
    await expect(buySnack).to.be.revertedWith("You must pay at least 2 ether per snack");
    // await vendingmachine.purchaseSnack(10, {value: ethers.utils.parseEther("20")} );
    // snackStocks -= 10;

    // // purchase then restock snacks
    // await vendingmachine.purchaseSnack(10, {value: ethers.utils.parseEther("20")} );
    // snackStocks -= 10;
    // expect(await vendingmachine.getVendingMachineBalance()).to.equal(snackStocks);

    // // restore 10 snacks and check
    // await vendingmachine.restockSnacks(10);
    // snackStocks += 10;
    // expect(await vendingmachine.getVendingMachineBalance()).to.equal(snackStocks);
  });
});
