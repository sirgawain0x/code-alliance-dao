// DAO Queries
export const LIST_ALL_DAOS = `
  query ListAllDaos($first: Int!, $skip: Int!, $orderBy: String!, $orderDirection: String!) {
    daos(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      createdAt
      name
      safeAddress
      activeMemberCount
      totalShares
      totalLoot
      gracePeriod
      votingPeriod
      proposalOffering
      quorumPercent
      sponsorThreshold
      minRetentionPercent
    }
  }
`;

export const LIST_SINGLE_DAO = `
  query ListSingleDao($daoid: String!) {
    daos(where: { id: $daoid }) {
      id
      createdAt
      name
      safeAddress
      activeMemberCount
      totalShares
      totalLoot
      gracePeriod
      votingPeriod
      proposalOffering
      quorumPercent
      sponsorThreshold
      minRetentionPercent
    }
  }
`;

export const FIND_DAO = `
  query FindDao($daoid: String!) {
    dao(id: $daoid) {
      id
      createdAt
      createdBy
      txHash
      safeAddress
      lootPaused
      sharesPaused
      gracePeriod
      votingPeriod
      proposalOffering
      quorumPercent
      sponsorThreshold
      minRetentionPercent
      shareTokenName
      shareTokenSymbol
      sharesAddress
      lootTokenName
      lootTokenSymbol
      lootAddress
      totalShares
      totalLoot
      latestSponsoredProposalId
      proposalCount
      activeMemberCount
      existingSafe
      delegatedVaultManager
      forwarder
      referrer
      name
    }
  }
`;

export const SEARCH_DAOS = `
  query SearchDaos($first: Int!, $skip: Int!, $orderBy: String!, $orderDirection: String!, $name: String!) {
    daos(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: { name_contains_nocase: $name }
    ) {
      id
      createdAt
      name
      safeAddress
      activeMemberCount
      totalShares
      totalLoot
      gracePeriod
      votingPeriod
      proposalOffering
      quorumPercent
      sponsorThreshold
      minRetentionPercent
    }
  }
`;

export const LIST_ALL_DAOS_FOR_ADDRESS = `
  query ListAllDaosForAddress($first: Int!, $skip: Int!, $orderBy: String!, $orderDirection: String!, $memberAddress: String!) {
    members(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: { memberAddress: $memberAddress }
    ) {
      id
      createdAt
      memberAddress
      shares
      loot
      dao {
        id
        name
        safeAddress
        activeMemberCount
        totalShares
        totalLoot
        gracePeriod
        votingPeriod
        proposalOffering
        quorumPercent
        sponsorThreshold
        minRetentionPercent
      }
    }
  }
`;

// Member Queries
export const LIST_ALL_DAO_MEMBERS = `
  query ListAllDaoMembers($first: Int!, $skip: Int!, $orderBy: String!, $orderDirection: String!, $daoid: String!) {
    members(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: { dao: $daoid }
    ) {
      id
      createdAt
      updatedAt
      memberAddress
      shares
      loot
      isActive
      dao {
        id
        name
      }
    }
  }
`;

export const FIND_MEMBER = `
  query FindMember($memberid: String!) {
    member(id: $memberid) {
      id
      createdAt
      memberAddress
      shares
      loot
      dao {
        id
        name
        safeAddress
        activeMemberCount
        totalShares
        totalLoot
        gracePeriod
        votingPeriod
        proposalOffering
        quorumPercent
        sponsorThreshold
        minRetentionPercent
      }
    }
  }
`;

// Proposal Queries
export const LIST_ALL_DAO_PROPOSALS = `
  query ListAllDaoProposals($first: Int!, $skip: Int!, $orderBy: String!, $orderDirection: String!, $daoid: String!) {
    proposals(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: { dao: $daoid }
    ) {
      id
      createdAt
      title
      description
      contentURI
      contentURIType
      sponsored
      processed
      processedBy
      passed
      actionFailed
      selfSponsor
      votingStarts
      votingEnds
      graceEnds
      expiration
      yesVotes
      noVotes
      yesBalance
      noBalance
      maxTotalSharesAndLootAtYesVote
      cancelled
      cancelledBy
      dao {
        id
        name
        totalShares
        quorumPercent
        minRetentionPercent
      }
      votes {
        id
        createdAt
        approved
        balance
        member {
          id
          memberAddress
        }
      }
    }
  }
`;

export const FIND_PROPOSAL = `
  query FindProposal($proposalid: String!) {
    proposal(id: $proposalid) {
      id
      createdAt
      title
      description
      contentURI
      contentURIType
      sponsored
      processed
      processedBy
      passed
      actionFailed
      selfSponsor
      votingStarts
      votingEnds
      graceEnds
      expiration
      yesVotes
      noVotes
      yesBalance
      noBalance
      maxTotalSharesAndLootAtYesVote
      cancelled
      cancelledBy
      dao {
        id
        name
        safeAddress
        activeMemberCount
        totalShares
        totalLoot
        gracePeriod
        votingPeriod
        proposalOffering
        quorumPercent
        sponsorThreshold
        minRetentionPercent
      }
      votes {
        id
        createdAt
        approved
        balance
        member {
          id
          memberAddress
        }
      }
    }
  }
`;

// Yeeter Queries
export const LIST_OPEN_YEETERS = `
  query ListOpenYeeters($now: String!) {
    yeeters(
      where: { 
        isActive: true
        endTime_gt: $now
      }
      orderBy: createdAt
      orderDirection: desc
    ) {
      id
      createdAt
      updatedAt
      dao {
        id
        name
        safeAddress
      }
      startTime
      endTime
      goal
      balance
      isShares
      isMaxGuild
      isMinGuild
      minTribute
      maxTribute
      multiplier
      isActive
    }
  }
`;

export const LIST_CLOSED_YEETERS = `
  query ListClosedYeeters($now: String!) {
    yeeters(
      where: { 
        isActive: false
        OR: [
          { endTime_lte: $now }
        ]
      }
      orderBy: createdAt
      orderDirection: desc
    ) {
      id
      createdAt
      updatedAt
      dao {
        id
        name
        safeAddress
      }
      startTime
      endTime
      goal
      balance
      isShares
      isMaxGuild
      isMinGuild
      minTribute
      maxTribute
      multiplier
      isActive
    }
  }
`;

export const LIST_ALL_YEETERS = `
  query ListAllYeeters {
    yeeters(
      orderBy: createdAt
      orderDirection: desc
    ) {
      id
      createdAt
      updatedAt
      dao {
        id
        name
        safeAddress
      }
      startTime
      endTime
      goal
      balance
      isShares
      isMaxGuild
      isMinGuild
      minTribute
      maxTribute
      multiplier
      isActive
    }
  }
`;

export const FIND_YEETER = `
  query FindYeeter($yeeterid: String!) {
    yeeter(id: $yeeterid) {
      id
      createdAt
      dao {
        id
        name
        safeAddress
        activeMemberCount
        totalShares
        totalLoot
        gracePeriod
        votingPeriod
        proposalOffering
        quorumPercent
        sponsorThreshold
        minRetentionPercent
      }
      startTime
      endTime
      goal
      balance
      isShares
      isMaxGuild
      isMinGuild
      minTribute
      maxTribute
      multiplier
      isActive
    }
  }
`;

export const FIND_YEETER_PROFILE = `
  query FindYeeterProfile($yeeterid: String!) {
    yeeter(id: $yeeterid) {
      id
    }
  }
`;

export const LIST_YEETS = `
  query ListYeets($first: Int!, $skip: Int!, $orderBy: String!, $orderDirection: String!, $yeeterid: String!) {
    yeets(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: { yeeter: $yeeterid }
    ) {
      id
      createdAt
      amount
      shares
      loot
      yeeter {
        id
        dao {
          id
          name
        }
      }
      member {
        id
        memberAddress
      }
    }
  }
`;

export const LIST_YEETS_FOR_ADDRESS = `
  query ListYeetsForAddress($first: Int!, $skip: Int!, $orderBy: String!, $orderDirection: String!, $memberAddress: String!) {
    yeets(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: { member: $memberAddress }
    ) {
      id
      createdAt
      amount
      shares
      loot
      yeeter {
        id
        dao {
          id
          name
        }
      }
      member {
        id
        memberAddress
      }
    }
  }
`;

// Record Queries
export const LIST_RECORDS = `
  query ListRecords($first: Int!, $skip: Int!, $orderBy: String!, $orderDirection: String!, $daoid: String!) {
    records(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: { dao: $daoid }
    ) {
      id
      createdAt
      updatedAt
      title
      description
      contentURI
      contentURIType
      dao {
        id
        name
      }
      member {
        id
        memberAddress
      }
    }
  }
`;

export const LAST_RECORD = `
  query LastRecord($daoid: String!) {
    records(
      first: 1
      orderBy: createdAt
      orderDirection: desc
      where: { dao: $daoid }
    ) {
      id
      createdAt
      updatedAt
      title
      description
      contentURI
      contentURIType
      dao {
        id
        name
      }
      member {
        id
        memberAddress
      }
    }
  }
`;

// Exit Queries
export const LIST_ALL_EXITS = `
  query ListAllExits($first: Int!, $skip: Int!, $orderBy: String!, $orderDirection: String!, $daoid: String!) {
    exits(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: { dao: $daoid }
    ) {
      id
      createdAt
      memberAddress
      shares
      loot
      dao {
        id
        name
      }
    }
  }
`;