// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ERC721.sol";

contract NFT is ERC721 {
    mapping(address => bool) isOwner;
    uint256 nftCount = 0;

    constructor() ERC721("HashTag", "HT") {
        isOwner[msg.sender] = true;
        _mint(msg.sender, nftCount);
    }

    modifier onlyOwner() {
        require(isOwner[msg.sender]);
        _;
    }

    function MintNFT(address mintAddress) public onlyOwner {
        nftCount = nftCount + 1;
        _mint(mintAddress, nftCount);
    }

    function changeTokenURI(string memory newURI) public onlyOwner {
        _baseURI = newURI;
    }

    function addOwner(address ownerAddress) public onlyOwner {
        isOwner[ownerAddress] = true;
    }

    function removeOwner(address ownerAddress) public onlyOwner {
        isOwner[ownerAddress] = false;
    }
}
