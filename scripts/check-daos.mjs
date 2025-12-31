import { JsonRpcProvider, Contract } from "ethers";

const OP_RPC = "https://mainnet.optimism.io";
const ETH_RPC = "https://cloudflare-eth.com";

const DAOS = [
    { chainId: 10, address: "0x4281f0f00bbe9bfa54cf414a193711e17e7f1f02", name: "Creative Kidz OP", rpc: OP_RPC },
    { chainId: 1, address: "0x5da6ae3d2cce42dd0b805b0bc3befeab0e0b9cca", name: "Creative Kidz Eth", rpc: ETH_RPC },
];

const ABI = [
    "function totalSupply() view returns (uint256)",
    "function proposalCount() view returns (uint256)",
    "function owner() view returns (address)",
    "function governor() view returns (address)",
    "function treasury() view returns (address)",
    "function auction() view returns (address)",
];

async function checkDaos() {
    for (const dao of DAOS) {
        console.log(`Checking ${dao.name} (${dao.address})...`);
        try {
            const provider = new JsonRpcProvider(dao.rpc);
            const contract = new Contract(dao.address, ABI, provider);

            // Members (Token Supply)
            try {
                const supply = await contract.totalSupply();
                console.log("  [Token] Total Supply (Members):", supply.toString());
            } catch (e) { console.log("  [Token] totalSupply() failed"); }

            // Try to find other addresses
            let governorAddr = null;
            let treasuryAddr = null;

            try {
                const owner = await contract.owner();
                console.log("  [Token] Owner:", owner);
                // Owner might be Treasury or DAO Executor
                treasuryAddr = owner;
            } catch (e) { }

            try {
                const gov = await contract.governor();
                console.log("  [Token] Governor:", gov);
                governorAddr = gov;
            } catch (e) { }

            try {
                const auct = await contract.auction();
                console.log("  [Token] Auction:", auct);
            } catch (e) { }

            // Check Treasury Balance if found
            if (treasuryAddr) {
                const bal = await provider.getBalance(treasuryAddr);
                console.log(`  [Treasury?] (${treasuryAddr}) ETH Balance:`, bal.toString());
            }

            // Check Governor Proposal Count if found
            if (governorAddr) {
                try {
                    const govContract = new Contract(governorAddr, ABI, provider);
                    const count = await govContract.proposalCount();
                    console.log(`  [Governor] (${governorAddr}) Proposal Count:`, count.toString());
                } catch (e) {
                    console.log("  [Governor] proposalCount failed on", governorAddr);
                }
            } else if (treasuryAddr) {
                // Sometimes Treasury IS the governor/executor? Unlikely for proposalCount but let's check
                try {
                    const govContract = new Contract(treasuryAddr, ABI, provider);
                    const count = await govContract.proposalCount();
                    console.log(`  [Treasury?] (${treasuryAddr}) Proposal Count:`, count.toString());
                } catch (e) { }
            }

        } catch (e) {
            console.error(`  Error checking ${dao.name}:`, e.message);
        }
        console.log("---");
    }
}

checkDaos();
