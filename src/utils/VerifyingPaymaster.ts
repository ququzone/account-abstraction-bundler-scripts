import { PaymasterAPI } from "@ququzone-account-abstraction/sdk"
import { UserOperationStruct, VerifyingPaymaster } from '@account-abstraction/contracts'
import { Signer } from "ethers"
import { arrayify, defaultAbiCoder, hexConcat } from "ethers/lib/utils"

export class VerifyingPaymasterAPI extends PaymasterAPI {
    private signer: Signer
    private paymaster: VerifyingPaymaster

    constructor(signer: Signer, paymaster: VerifyingPaymaster) {
        super()
        this.signer = signer
        this.paymaster = paymaster
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async getPreVerificationGas (_userOp: Partial<UserOperationStruct>): Promise<number> {
        return 50000
    }

    public async getPaymasterAndData(userOp: Partial<UserOperationStruct>): Promise<string | undefined> {
        userOp.paymasterAndData = hexConcat([
            this.paymaster.address,
            defaultAbiCoder.encode(["uint48", "uint48"], [0, 0]),
            "0x" + "00".repeat(65),
        ])
        userOp.signature = "0x"

        const validAfter = Math.floor(new Date().getTime() / 1000)
        const validUntil = validAfter + 86400 // one day
        // @ts-ignore
        const pendingOpHash = await this.paymaster.getHash(userOp, validUntil, validAfter)

        const paymasterSignature = await this.signer.signMessage(arrayify(pendingOpHash))
        return hexConcat([
            this.paymaster.address,
            defaultAbiCoder.encode(["uint48", "uint48"], [validUntil, validAfter]),
            paymasterSignature,
        ])
    }
}
