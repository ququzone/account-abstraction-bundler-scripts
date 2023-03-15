import { HttpRpcClient, SimpleAccountAPI } from "@account-abstraction/sdk"
import { EntryPoint__factory
} from '@account-abstraction/contracts'
import { providers, utils, Wallet } from "ethers"

async function main() {
  const sigingKey = process.env.PRIVATE_KEY
  const provider = new providers.JsonRpcProvider(`http://localhost:8545`)

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const owner = new Wallet(sigingKey!, provider)
  const entryPointAddress = "0x0576a174D229E3cFA37253523E645A78A0C91B57"
  const factoryAddress = "0x4130EF9f86854245D6A18B24868580B3C896f116"
  const paymasterAPI = undefined
  const index = 0

  const wallet = new SimpleAccountAPI({
    provider,
    entryPointAddress,
    owner,
    factoryAddress,
    paymasterAPI,
    index,
  })

  const account = await wallet.getAccountAddress()
  const entryPoint = EntryPoint__factory.connect(entryPointAddress, owner)
  const stakedBalance = await entryPoint.balanceOf(account)
  if (stakedBalance.toString() === "0") {
    console.log(`staking gas for ${account}...`)
    const stakeTx = await entryPoint.depositTo(account, {value: utils.parseEther("1.0")})
    await stakeTx.wait()
  }

  const op = await wallet.createSignedUserOp({
    target: "0x8896780a7912829781f70344ab93e589dddb2930",
    data: "0x",
    value: 0,
    maxFeePerGas: "1000000000000",
    maxPriorityFeePerGas: "1000000000000"
  })

  const client = new HttpRpcClient('http://localhost:4337', entryPointAddress, 31337)
  const opHash = await client.sendUserOpToBundler(op)
  console.log(`UserOpHash: ${opHash}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })