pragma solidity 0.4.25;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721MetadataMintable.sol";

/**
 * @title Rewards
 * Rewards - Serverless brandable dapp for minting ERC721 NFT rewards
 * @dev 
 */
contract Rewards is ERC721Full, ERC721MetadataMintable {
    using SafeMath for uint256;

    /*** State Variables ***/
    uint256 private tokenId = 0;
    
    /*** Events ***/

    /* Initializes contract */
    constructor(string name, string symbol) ERC721Full(name, symbol) public { }

    function mintWithTokenURI(address to, string tokenURI) external {
        require(mintWithTokenURI(to, tokenId, tokenURI), "");
        tokenId = tokenId.add(1);
    }
}
