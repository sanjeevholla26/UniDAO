// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 public constant maxSupply = 3000;

    // Mapping to store image URIs associated with each token ID
    mapping(uint256 => string) private _tokenImageURIs;

    constructor() ERC721("MyNFT", "MNFT") {}

    function mintNFT(string memory imageURI)
        public
        onlyOwner
        returns (uint256)
    {
        require(_tokenIds.current() < maxSupply, "Maximum supply reached");

        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);

        // Set the image URI for the newly minted NFT
        _setTokenImageURI(newItemId, imageURI);

        return newItemId;
    }

    function setTokenImageURI(uint256 tokenId, string memory imageURI) public onlyOwner {
        require(_exists(tokenId), "Token ID does not exist");
        _setTokenImageURI(tokenId, imageURI);
    }

    function getTokenImageURI(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "Token ID does not exist");
        return _tokenImageURIs[tokenId];
    }

    function _setTokenImageURI(uint256 tokenId, string memory imageURI) internal {
        _tokenImageURIs[tokenId] = imageURI;
    }
}
