pragma solidity 0.5.2;

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
    uint256 private _tokenId = 0; // Unique ID of an NFT
    function tokenId() external view returns (uint256) { return _tokenId; }
    uint256 private _maxSupply = 0; // Maimum possible number of tokens that can be minted
    function maxSupply() external view returns (uint256) { return _maxSupply; }
    
    /*** Events ***/

    /* Initializes contract */
    constructor(uint256 mintcap, string memory name, string memory symbol) ERC721Full(name, symbol) public {
        _maxSupply = mintcap;
    }

    function mintWithTokenURI(address to, string calldata tokenURI) external {
        require(_tokenId < _maxSupply); // Contract is finished, everything is minted
        _tokenId = _tokenId.add(1);
        require(mintWithTokenURI(to, _tokenId, tokenURI), "");
    }
}
