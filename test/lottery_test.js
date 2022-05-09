const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lottery", function () {
  let owner;
  let addr1;
  let addr2;
  let addr3;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
  });

  it("Lottery basic", async function () {
    const LotteryFac = await ethers.getContractFactory("Lottery");
    const lottery = await LotteryFac.deploy();
    await lottery.deployed();

    // nothing in the pool now
    expect(await lottery.getBalance()).to.equal(0);

    // 3 people enters lottery
    lottery.enter({value: ethers.utils.parseEther("2")});
    lottery.enter({value: ethers.utils.parseEther("1")});
    lottery.enter({value: ethers.utils.parseEther("0.5")});

    expect(await lottery.getBalance()).to.equal(ethers.utils.parseEther("3.5"));

    // draw lottery
    // expect(await lottery.getBalance()).to.equal(0);
    expect(await lottery.pickWinnder()).to.changeEtherBalance(ethers.utils.parseEther("3.5"));
    expect(await lottery.getBalance()).to.equal(0);
  });
});
