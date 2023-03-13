import { providers } from 'ethers'

async function main() {
  const provider = new providers.JsonRpcProvider(`http://localhost:4337`)
  const entrypoints = await provider.send('eth_supportedEntryPoints', [])

  console.log(`entrypoints address: ${entrypoints}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
