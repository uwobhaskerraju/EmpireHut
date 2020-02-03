pragma solidity >=0.5.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721Enumerable.sol";

contract AssetToken is ERC721Enumerable{

    constructor() public{
        address _to = 0x52Ba9079f9c5b315988EaCE3b2001A8d17fBCA54;
        _mint(_to,1);
    }

    function tokenCount(address _owner) public view returns(uint){
       // address _to = "0x52Ba9079f9c5b315988EaCE3b2001A8d17fBCA54";
       uint[] memory co = _tokensOfOwner(_owner);
       return co[0];
    }

}