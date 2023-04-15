import { HttpRpcClient, SimpleAccountAPI } from "@ququzone-account-abstraction/sdk"
import { EntryPoint__factory} from '@account-abstraction/contracts'
import { providers, Wallet } from "ethers"
import { formatEther } from "ethers/lib/utils"
import { RemoteVerifyingPaymasterAPI } from "./utils/RemoteVerifyingPaymaster"

async function main() {
  const sigingKey = process.env.PRIVATE_KEY
  const provider = new providers.JsonRpcProvider(`https://babel-api.testnet.iotex.io`)

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const owner = new Wallet(sigingKey!, provider)
  const entryPointAddress = "0x521D1Ba1E5FAD3aC53ADDd692c801503CE7c6124"
  const factoryAddress = "0x6Fee351E155c695ab6656f58a348705f52Dad651"
  const paymasterAPI = new RemoteVerifyingPaymasterAPI("http://localhost:8888")
  const index = 2

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
  console.log(`account ${account} staked balance: ${formatEther(stakedBalance)}`)

  const op = await wallet.createSignedUserOp({
    target: "0x8896780a7912829781f70344ab93e589dddb2930",
    data: "0x",
    value: 0,
    maxFeePerGas: "1000000000000",
    maxPriorityFeePerGas: "1000000000000"
  })

  const err = await entryPoint.callStatic.simulateValidation(op).catch((e) => e)
  if (err.errorName === "FailedOp") {
    console.error(`simulate op error ${err.errorArgs.at(-1)}`)
    return
  } else if (err.errorName !== "ValidationResult") {
    console.error(`unknow error ${err}`)
    return
  }

  const client = new HttpRpcClient('http://localhost:4337', entryPointAddress, 4690)
  const opHash = await client.sendUserOpToBundler(op)
  console.log(`UserOpHash: ${opHash}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })