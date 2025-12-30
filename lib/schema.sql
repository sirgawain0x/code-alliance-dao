-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- DAO Info Table
CREATE TABLE IF NOT EXISTS dao_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  mission TEXT,
  vision TEXT,
  total_members INTEGER DEFAULT 0,
  active_subdaos INTEGER DEFAULT 0,
  treasury_value NUMERIC DEFAULT 0,
  governance_score INTEGER DEFAULT 0,
  voter_participation NUMERIC DEFAULT 0,
  proposal_success_rate NUMERIC DEFAULT 0,
  community_engagement NUMERIC DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Members Table
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'Community Member',
  reputation INTEGER DEFAULT 0,
  voting_power INTEGER DEFAULT 0,
  contributions INTEGER DEFAULT 0,
  join_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'active',
  subdaos TEXT[], -- Array of subdao names
  permissions TEXT[] -- Array of permission strings
);

-- Proposal Metadata (for extra off-chain info)
CREATE TABLE IF NOT EXISTS proposal_metadata (
  proposal_id TEXT PRIMARY KEY, -- Matches on-chain ID
  full_description TEXT,
  discussion_link TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Initial Seed Data (Optional - remove if not needed)
INSERT INTO dao_info (name, mission, vision, total_members, active_subdaos, treasury_value, governance_score, voter_participation, proposal_success_rate, community_engagement)
VALUES (
  'Creative Organization DAO',
  'To democratically govern and support innovative projects through a decentralized incubator ecosystem that bridges traditional and blockchain technologies.',
  'To become the leading DAO-governed incubator that empowers diverse teams to build the future of technology through collaborative governance and shared resources.',
  1247, 8, 2400000, 94, 78, 85, 92
) ON CONFLICT DO NOTHING;

INSERT INTO members (wallet_address, name, role, reputation, voting_power, contributions, status, subdaos, permissions)
VALUES 
('0x1234...5678', 'Dr. Alice Chen', 'Core Contributor', 95, 1247, 234, 'active', ARRAY['Innovation Labs DAO', 'AI Research Collective'], ARRAY['governance', 'treasury', 'admin']),
('0x2345...6789', 'Bob Martinez', 'Project Lead', 88, 892, 189, 'active', ARRAY['Innovation Labs DAO', 'DeFi Protocols DAO'], ARRAY['governance', 'projects']),
('0x3456...7890', 'Carol Kim', 'Contributor', 76, 456, 156, 'active', ARRAY['Community Fund DAO'], ARRAY['governance']),
('0x4567...8901', 'David Wilson', 'Community Member', 62, 234, 98, 'inactive', ARRAY['Startup Support Lab', 'Community Fund DAO'], ARRAY['governance']),
('0x5678...9012', 'Eva Rodriguez', 'Council Member', 92, 1567, 312, 'active', ARRAY['Parent DAO', 'Community Fund DAO'], ARRAY['governance', 'treasury', 'admin', 'council']),
('0x6789...0123', 'Frank Thompson', 'Administrator', 98, 2134, 445, 'active', ARRAY['Parent DAO'], ARRAY['governance', 'treasury', 'admin', 'council', 'system'])
ON CONFLICT (wallet_address) DO NOTHING;
