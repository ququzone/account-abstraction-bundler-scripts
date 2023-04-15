# Account Abstraction bundler scripts

```
curl -X POST https://bundler.testnet.iotex.io/ -H "Content-Type:application/json" --data '{
    "jsonrpc":"2.0",
                "method":"eth_getUserOperationReceipt",
                "params":["0x1de589ee5aa0fe7fad2e4578168a76043318317a1d17b9b5c4ffc0c2204efc46"],
    "id":1
}'
```