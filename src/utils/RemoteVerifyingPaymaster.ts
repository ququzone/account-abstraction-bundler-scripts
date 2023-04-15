import { UserOperationStruct } from '@account-abstraction/contracts'
import { ethers } from 'ethers'
import { JsonRpcProvider } from '@ethersproject/providers'
import { PaymasterAPI } from "@ququzone-account-abstraction/sdk"
import { deepHexlify } from '@account-abstraction/utils'
import { resolveProperties } from 'ethers/lib/utils'

export class RemoteVerifyingPaymasterAPI extends PaymasterAPI {
    private readonly provider: JsonRpcProvider

    constructor(rpc: string) {
        super()
        this.provider = new ethers.providers.JsonRpcProvider(rpc)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async getPreVerificationGas(_userOp: Partial<UserOperationStruct>): Promise<number> {
        return 50000
    }

    public async getPaymasterAndData(userOp: Partial<UserOperationStruct>): Promise<string | undefined> {
        const hexifiedUserOp = deepHexlify(await resolveProperties(userOp))
        return await this.provider.send('eth_signVerifyingPaymaster', [hexifiedUserOp])
    }
}
