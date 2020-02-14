pragma solidity >=0.5.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721Enumerable.sol";

contract AssetToken is ERC721Enumerable{

    address tokenOwner;
    //string[] tokensStr;
    //event createAssetEvent(address creator, uint256 _assettoken);

     // Mapping from token ID to owner
    mapping (uint256 => address) private _tokenOwner;

    constructor() public{
        tokenOwner = msg.sender;
    }

     function ownerOf(uint256 tokenId) public view returns (address) {
        address owner = _tokenOwner[tokenId];
        require(owner != address(0), "ERC721: owner query for nonexistent token");
        return owner;
    }

    function tokenCount(address _owner) public view returns(uint){
       // address _to = "0x52Ba9079f9c5b315988EaCE3b2001A8d17fBCA54";
       uint[] memory co = _tokensOfOwner(_owner);
       return co.length;
    }

    function createAsset(bytes32 _tokenStr) public returns(uint){
        //require(tokensStr[_tokenStr],'Token already exists');
        //Keccak-256 in Solidity returns a 32 byte array (which could also be represented as a 256 bit string)
      //_mint(msg.sender, bytesToUInt(keccak256(abi.encodePacked(_tokenStr))));

      _mint(msg.sender, uint(_tokenStr));
      //add generated token to _tokenOwner 
      _tokenOwner[uint(_tokenStr)] = msg.sender;
      return uint(_tokenStr);
    }

    // /// @dev Converts a numeric string to it's unsigned integer representation.
    // /// @param v The string to be converted.
    // function bytesToUInt(bytes32 v) private pure returns (uint ret) {
    //     if (v == 0x0) {
    //         revert('error');
    //     }

    //     uint digit;

    //     for (uint i = 0; i < 32; i++) {
    //         digit = uint((uint(v) / (2 ** (8 * (31 - i)))) & 0xff);
    //         if (digit == 0) {
    //             break;
    //         }
    //         else if (digit < 48 || digit > 57) {
    //             revert('error');
    //         }
    //         ret *= 10;
    //         ret += (digit - 48);
    //     }
    //     return ret;
    // }

    function ownedTokensOfUser(address _user) public view returns (uint256[] memory)
    {
        return _tokensOfOwner(_user);
    }
}