# dapp-rewards
Serverless, brandable dapp for minting ERC721 NFT rewards.

Compatible with OpenSea https://opensea.io/

## Usage

`https://cloudflare-ipfs.com/ipfs/<dapp-version>/?contract=<minted-contract-address>&ipfs=<backup-ipfs-gateway>`

Example

https://cloudflare-ipfs.com/ipfs/QmcMuQQqhL92p8YajC2NDEmcrApVJaCtsYWqnbmaVxistE/?contract=0x50110689F821af743f855D6D03408a1C1d9db590

## Development Requirements

https://embark.status.im/docs/installation.html
- install the latest stable, ie `npm -g install embark`
- make sure to install local IPFS

`npm install`

## Development

Run with local development blockchain and webserver

`embark run`

Run all code tests

`embark test`

Deploy to public testnet (Rinkeby + IPFS)
- must be running `ipfs daemon` in seperate console
- `embark upload testnet`
- `ipfs pin add -r <your-site-ipfs-hash>/`
- access at https://cloudflare-ipfs.com/ipfs/\<your-site-ipfs-hash>

