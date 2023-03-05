// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFT is ERC721 {
    mapping(uint256 => string) public colorsName;
    mapping(string => bool) _colorExists;

    using Counters for Counters.Counter;
    Counters.Counter private tokenIds;

    constructor() ERC721("ColorToken", "CT") {}

    function getTokenCount() public view returns (uint256) {
        return tokenIds.current();
    }

    function createToken(string memory colorCode) public {
        require(!_colorExists[colorCode]);

        tokenIds.increment();
        uint256 tokenId = tokenIds.current();
        colorsName[tokenId] = colorCode;

        _colorExists[colorCode] = true;

        _mint(msg.sender, tokenId);
    }
}

contract NFTMarket is NFT, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter public itemIds;

    address payable owner;
    uint256 listingPrice = 0.025 ether;

    constructor() {
        owner = payable(msg.sender);
    }

    struct MarketItem {
        uint256 itemId;
        uint256 tokenId;
        address payable seller;
        bool sold;
    }

    mapping(uint256 => MarketItem) public idToMarketItem;

    function getItemCount() public view returns (uint256) {
        return itemIds.current();
    }

    /* Places an item for sale on the marketplace */
    function putNFTOnSale(uint256 tokenId) public payable nonReentrant {
        require(msg.sender == ownerOf(tokenId));
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );

        approve(address(this), tokenId);

        itemIds.increment();
        uint256 itemId = itemIds.current();

        idToMarketItem[itemId] = MarketItem(
            itemId,
            tokenId,
            payable(msg.sender),
            false
        );
    }

    /* Creates the sale of a marketplace item */
    /* Transfers ownership of the item, as well as funds between parties */
    function finalizeSale(uint256 itemId) public payable nonReentrant {
        uint256 tokenId = idToMarketItem[itemId].tokenId;
        require(msg.sender != ownerOf(tokenId));
        require(
            msg.value == 1 ether,
            "Please submit the asking price in order to complete the purchase"
        );

        idToMarketItem[itemId].seller.transfer(msg.value);
        IERC721(address(this)).transferFrom(
            idToMarketItem[itemId].seller,
            msg.sender,
            tokenId
        );
        idToMarketItem[itemId].sold = true;
        payable(owner).transfer(listingPrice);
    }
}
