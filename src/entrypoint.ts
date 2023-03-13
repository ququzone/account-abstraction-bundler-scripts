// import { ethers, providers } from "ethers"
// import { SimpleAccountFactory__factory } from "../../../typechain"

async function main() {
  // const provider = new providers.JsonRpcProvider(`http://localhost:4337`)
  // const factory = SimpleAccountFactory__factory.connect("tokenAddress", provider)
  // const nonce = 0
  // const account = await factory.getAddress(owner.address, nonce)
  // const code = await ethers.provider.getCode(account)
  // if (code !== "0x") {
  //     console.log(`account ${account} already created`)
  //     return
  // }
  // console.log(`entrypoints address: ${entrypoints}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
