pragma solidity >=0.5.0;
// variable names should be different from function names or else we will get compilation errors
//reading data from ethereum is free but writing data is costly
// implementing as per ethereum standards
//https://eips.ethereum.org/EIPS/eip-20
// This is a basic ERC-20 TOken Implementation
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

contract EMPToken {
    uint256 private _totalSupply;
    mapping(address => uint256) _balances;
    mapping(address => mapping(address => uint256)) _allowance;
    // first address is approvers, second address is "_spender" and third is how much value are we
    //allowing him to take from our wallet
    string private constant _name = "EmpireHut";
    string private constant _symbol = "EMP";
    uint8 private constant _decimals = 0;
    address private _tokenowner;
    using SafeMath for uint256;
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _tokens,
        string _desc
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    modifier onlyOwner() {
        require(_tokenowner == msg.sender, "Only owner can trigger");
        _;
    }

    //in case you want to use arguments here.the values for this arguments must be passed in the respective
    //contract migration deploy file.
    constructor() public {
        uint256 _initialSupply = 100000;
        _totalSupply = _initialSupply;
        // _balances[msg.sender] = _initialSupply;
        _tokenowner = msg.sender;
        emit Transfer(address(0), msg.sender, _initialSupply, "Initial");
    }

    //“memory” : this is used to hold temporary values.
    //It is erased between (external) function calls and is cheaper to use.
    function name() public pure returns (string memory) {
        return _name;
    }
    function symbol() public pure returns (string memory) {
        return _symbol;
    }
    function decimals() public pure returns (uint8) {
        return _decimals;
    }
    //view simply means “this function is read-only.”
    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }
    function getOwner() public view returns (address) {
        return _tokenowner;
    }
    function balanceOf(address _owner) public view returns (uint256 balance) {
        return _balances[_owner];
    }
    function transfer(address _to, uint256 _value, string memory _desc)
        public
        payable
        returns (bool success)
    {
        //require - if condition is true,go ahead or else throw the string
        require(_balances[msg.sender] >= _value, "Insufficient Funds");
        require(_value >= 0, "Value cannot be less than zero");
        require(_to != address(0), "Address is invalid");
        require(_to != msg.sender, "Both address are same");
        _balances[msg.sender] = _balances[msg.sender].sub(_value);
        _balances[_to] = _balances[_to].add(_value);
        emit Transfer(msg.sender, _to, _value, _desc);
        return true;
    }

    function registerUser(address _user) public payable returns (bool success) {
        uint256 _value;
        require(_balances[_user] == 0, "User already Exists");
        if (_tokenowner == msg.sender) {
            _value = 100000;
            _balances[_user] = _balances[_user].add(_value);
        } else {
            _value = 1000;
            _balances[_user] = _balances[_user].add(_value);
        }
        emit Transfer(msg.sender, _user, _value, "Registration");
        return true;
    }

    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        // we are giving permission to "_spender" to take our
        //tokens and transfer it to someone
        // here msg.sender=owner. he is authorizing "_spender" to take some of his tokens
        // and give to someone.
        //allowance
        _allowance[msg.sender][_spender] = _allowance[msg.sender][_spender].add(
            _value
        );
        //approve event
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value)
        public
        returns (bool success)
    {
        //_from=owner account
        // msg.sender='_spender' who was authorized by owner
        require(_from != address(0), "Address is invalid");
        require(_to != address(0), "Address is invalid");
        // just to check if this function is called by the person who has been approved by the
        //owner in the "approve" function
        //require(_allowance[_from][msg.sender] > 0,"Unauthorized request");
        require(_balances[_from] >= _value, "Insufficient Funds here");
        require(
            _value <= _allowance[msg.sender][_to],
            "Requested transfer is greater than approved"
        );
        _balances[_from] = _balances[_from].sub(_value);
        _balances[_to] = _balances[_to].add(_value);
        _allowance[msg.sender][_to] = _allowance[msg.sender][_to].sub(_value);
        emit Transfer(_from, _to, _value, "Transfer");
        return true;
    }
}
