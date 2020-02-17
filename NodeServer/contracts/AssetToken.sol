pragma solidity >=0.5.0;

//import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721Enumerable.sol";
library SafeMath {
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
}

contract AssetToken {
    // Mapping from owner to list of owned token IDs
    mapping(address => uint256[]) private _ownedTokens;

    // Mapping from token ID to owner
    mapping(uint256 => address) private _tokenOwner;

    // Mapping from token ID to index of the owner tokens list
    mapping(uint256 => uint256) private _ownedTokensIndex;

    // Array with all token ids, used for enumeration
    uint256[] private _allTokens;

    // Mapping from token id to position in the allTokens array
    mapping(uint256 => uint256) private _allTokensIndex;

    address private _contractOwner;

    //tokenID to its transaction history
    mapping(uint => uint[]) private _tokenHistory;

    using SafeMath for uint256;

    event Create(address indexed _from, uint256 _tokenID);
    event AssetTransfer(address indexed _from, address indexed _to,uint256 _tokenID);

    constructor() public {
        _contractOwner = msg.sender;
    }

    modifier onlyOwner() {
        require(_contractOwner == msg.sender, "Only owner can trigger");
        _;
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        address owner = _tokenOwner[tokenId];
        require(
            owner != address(0),
            "ERC721: owner query for nonexistent token"
        );
        return owner;
    }

    function tokenCount(address _owner) public view returns (uint256) {
        // address _to = "0x52Ba9079f9c5b315988EaCE3b2001A8d17fBCA54";
        uint256[] memory co = _tokensOfOwner(_owner);
        return co.length;
    }
    //below is a system function or ERC-721 contract function
    function _tokensOfOwner(address owner)
        private
        view
        returns (uint256[] storage)
    {
        return _ownedTokens[owner];
    }

    function createAsset(bytes32 _tokenStr) public onlyOwner returns (uint256) {
        address to = msg.sender;
        _tokenOwner[uint256(_tokenStr)] = to;
        _ownedTokensIndex[uint256(_tokenStr)] = _ownedTokens[to].length;
        _ownedTokens[to].push(uint256(_tokenStr));

        _allTokensIndex[uint256(_tokenStr)] = _allTokens.length;
        _allTokens.push(uint256(_tokenStr));

        emit Create(msg.sender, uint256(_tokenStr));
        return uint256(_tokenStr);
    }

    function ownedTokensOfUser(address _user)
        public
        view
        returns (uint256[] memory)
    {
        return _tokensOfOwner(_user);
    }

    function transferAsset(address _from, address _to, uint256 tokenID) public {
        _removeTokenFromOwnerEnumeration(_from, tokenID);
        _removeTokenFromAllTokensEnumeration(tokenID);
        _addTokenToOwnerEnumeration(_to, tokenID);
        _addTokenToAllTokensEnumeration(tokenID);
        _tokenOwner[tokenID] = _to;
        emit AssetTransfer(_from,_to,tokenID);
    }
    function _removeTokenFromAllTokensEnumeration(uint256 tokenId) private {
        // To prevent a gap in the tokens array, we store the last token in the index of the token to delete, and
        // then delete the last slot (swap and pop).

        uint256 lastTokenIndex = _allTokens.length.sub(1);
        uint256 tokenIndex = _allTokensIndex[tokenId];

        // When the token to delete is the last token, the swap operation is unnecessary. However, since this occurs so
        // rarely (when the last minted token is burnt) that we still do the swap here to avoid the gas cost of adding
        // an 'if' statement (like in _removeTokenFromOwnerEnumeration)
        uint256 lastTokenId = _allTokens[lastTokenIndex];

        _allTokens[tokenIndex] = lastTokenId; // Move the last token to the slot of the to-delete token
        _allTokensIndex[lastTokenId] = tokenIndex; // Update the moved token's index

        // Delete the contents at the last position of the array
        _allTokens.pop();

        _allTokensIndex[tokenId] = 0;
    }

    function _removeTokenFromOwnerEnumeration(address from, uint256 tokenId)
        private
    {
        // To prevent a gap in from's tokens array, we store the last token in the index of the token to delete, and
        // then delete the last slot (swap and pop).

        uint256 lastTokenIndex = _ownedTokens[from].length.sub(1);
        uint256 tokenIndex = _ownedTokensIndex[tokenId];

        // When the token to delete is the last token, the swap operation is unnecessary
        if (tokenIndex != lastTokenIndex) {
            uint256 lastTokenId = _ownedTokens[from][lastTokenIndex];

            _ownedTokens[from][tokenIndex] = lastTokenId; // Move the last token to the slot of the to-delete token
            _ownedTokensIndex[lastTokenId] = tokenIndex; // Update the moved token's index
        }

        // Deletes the contents at the last position of the array
        _ownedTokens[from].pop();

        // Note that _ownedTokensIndex[tokenId] hasn't been cleared: it still points to the old slot (now occupied by
        // lastTokenId, or just over the end of the array if the token was the last one).

    }
    function _addTokenToOwnerEnumeration(address to, uint256 tokenId) private {
        _ownedTokensIndex[tokenId] = _ownedTokens[to].length;
        _ownedTokens[to].push(tokenId);
    }

    function _addTokenToAllTokensEnumeration(uint256 tokenId) private {
        _allTokensIndex[tokenId] = _allTokens.length;
        _allTokens.push(tokenId);
    }
}
