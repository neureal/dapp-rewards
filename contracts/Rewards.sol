pragma solidity 0.5.0;

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
    constructor(string memory name, string memory symbol) ERC721Full(name, symbol) public { }

    function mintWithTokenURI(address to, string calldata tokenURI) external {
        require(mintWithTokenURI(to, tokenId, tokenURI), "");
        tokenId = tokenId.add(1);
    }
}
