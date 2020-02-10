pragma solidity >=0.5.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721Enumerable.sol";

contract AssetToken is ERC721Enumerable{

    address tokenOwner;
    //string[] tokensStr;

    constructor() public{
        tokenOwner = msg.sender;
    }

    function tokenCount(address _owner) public view returns(uint){
       // address _to = "0x52Ba9079f9c5b315988EaCE3b2001A8d17fBCA54";
       uint[] memory co = _tokensOfOwner(_owner);
       return co[0];
    }

    function createAsset(string memory _tokenStr) public payable returns(bool){
        //require(tokensStr[_tokenStr],'Token already exists');
        //Keccak-256 in Solidity returns a 32 byte array (which could also be represented as a 256 bit string)
        _mint(msg.sender, uint(keccak256(abi.encodePacked(_tokenStr))));
        return true;
    }

    function ownedTokensOfUser(address _user) public view returns (uint256[] memory)
    {
        return _tokensOfOwner(_user);
    }
}