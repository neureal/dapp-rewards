# dapp-rewards
Serverless, brandable dapp for minting ERC721 NFT rewards.

Compatible with OpenSea https://opensea.io/

## Usage

`https://cloudflare-ipfs.com/ipfs/<dapp-version>/?contract=<minted-contract-address>&ipfs=<backup-ipfs-gateway>`

Example

https://cloudflare-ipfs.com/ipfs/QmcJLSEYXJuJFrKahYTXnmJbXartdxDAmRWZmCrqvcp25i/?contract=0x101b37738Ddf06d53A65d09d112731900eE46E74

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

