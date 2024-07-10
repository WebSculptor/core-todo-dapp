import { ethers } from "hardhat";

async function main() {
  const TodoList = await ethers.deployContract("TodoList");

  await TodoList.waitForDeployment();

  console.log(`The contract is deployed to ${TodoList.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
