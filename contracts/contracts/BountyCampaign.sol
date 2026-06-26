// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BountyCampaign is Ownable {
    using SafeERC20 for IERC20;

    struct Campaign {
        uint256 id;
        address sponsor;
        string title;
        string description;
        uint256 totalReward;
        uint256 deadline;
        uint256 submissionCount;
        bool settled;
    }

    struct Submission {
        uint256 id;
        uint256 campaignId;
        address creator;
        string contentURI;
        uint256 votes;
        uint256 reward;
        bool claimed;
    }

    IERC20 public immutable usdc;
    uint256 public campaignCount;
    uint256 public submissionCount;

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => Submission) public submissions;
    mapping(uint256 => uint256[]) public campaignSubmissions;
    mapping(address => uint256[]) public creatorSubmissions;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event CampaignCreated(uint256 indexed campaignId, address indexed sponsor, uint256 totalReward);
    event SubmissionMade(uint256 indexed campaignId, uint256 indexed submissionId, address indexed creator);
    event Voted(uint256 indexed submissionId, address indexed voter, uint256 weight);
    event Settled(uint256 indexed campaignId, uint256 totalDistributed);
    event RewardClaimed(uint256 indexed submissionId, address indexed creator, uint256 amount);

    constructor(address _usdc, address _owner) Ownable(_owner) {
        usdc = IERC20(_usdc);
    }

    function createCampaign(string calldata title, string calldata description, uint256 totalReward, uint256 duration) external payable {
        require(duration > 0, "Duration must be > 0");
        require(totalReward > 0, "Reward must be > 0");
        uint256 campaignId = ++campaignCount;
        campaigns[campaignId] = Campaign({
            id: campaignId,
            sponsor: msg.sender,
            title: title,
            description: description,
            totalReward: totalReward,
            deadline: block.timestamp + duration,
            submissionCount: 0,
            settled: false
        });
        usdc.safeTransferFrom(msg.sender, address(this), totalReward);
        emit CampaignCreated(campaignId, msg.sender, totalReward);
    }

    function submit(uint256 campaignId, string calldata contentURI) external {
        Campaign storage campaign = campaigns[campaignId];
        require(block.timestamp < campaign.deadline, "Campaign ended");
        require(bytes(contentURI).length > 0, "Empty URI");
        uint256 submissionId = ++submissionCount;
        submissions[submissionId] = Submission({
            id: submissionId,
            campaignId: campaignId,
            creator: msg.sender,
            contentURI: contentURI,
            votes: 0,
            reward: 0,
            claimed: false
        });
        campaign.submissionCount++;
        campaignSubmissions[campaignId].push(submissionId);
        creatorSubmissions[msg.sender].push(submissionId);
        emit SubmissionMade(campaignId, submissionId, msg.sender);
    }

    function vote(uint256 submissionId, uint256 weight) external {
        Submission storage sub = submissions[submissionId];
        Campaign storage campaign = campaigns[sub.campaignId];
        require(block.timestamp >= campaign.deadline, "Voting not started");
        require(!campaign.settled, "Already settled");
        require(!hasVoted[submissionId][msg.sender], "Already voted");
        require(weight > 0 && weight <= 5, "Weight 1-5");
        sub.votes += weight;
        hasVoted[submissionId][msg.sender] = true;
        emit Voted(submissionId, msg.sender, weight);
    }

    function settle(uint256 campaignId) external {
        Campaign storage campaign = campaigns[campaignId];
        require(block.timestamp >= campaign.deadline, "Not ended");
        require(!campaign.settled, "Already settled");
        campaign.settled = true;
        uint256[] memory subIds = campaignSubmissions[campaignId];
        uint256 totalVotes = 0;
        for (uint256 i = 0; i < subIds.length; i++) {
            totalVotes += submissions[subIds[i]].votes;
        }
        if (totalVotes == 0) {
            usdc.safeTransfer(campaign.sponsor, campaign.totalReward);
            emit Settled(campaignId, 0);
            return;
        }
        uint256 distributed = 0;
        for (uint256 i = 0; i < subIds.length; i++) {
            Submission storage sub = submissions[subIds[i]];
            if (sub.votes > 0) {
                sub.reward = (campaign.totalReward * sub.votes) / totalVotes;
                distributed += sub.reward;
            }
        }
        if (distributed < campaign.totalReward) {
            usdc.safeTransfer(campaign.sponsor, campaign.totalReward - distributed);
        }
        emit Settled(campaignId, distributed);
    }

    function claimReward(uint256 submissionId) external {
        Submission storage sub = submissions[submissionId];
        require(sub.creator == msg.sender, "Not creator");
        require(!sub.claimed, "Already claimed");
        require(sub.reward > 0, "No reward");
        sub.claimed = true;
        usdc.safeTransfer(msg.sender, sub.reward);
        emit RewardClaimed(submissionId, msg.sender, sub.reward);
    }

    function getCampaign(uint256 campaignId) external view returns (Campaign memory) { return campaigns[campaignId]; }
    function getSubmission(uint256 submissionId) external view returns (Submission memory) { return submissions[submissionId]; }
    function getCampaignSubmissions(uint256 campaignId) external view returns (uint256[] memory) { return campaignSubmissions[campaignId]; }
    function getCreatorSubmissions(address creator) external view returns (uint256[] memory) { return creatorSubmissions[creator]; }
}
