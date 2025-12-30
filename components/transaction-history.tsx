import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpRight, ArrowDownLeft, Search, Filter } from "lucide-react"

const transactions = [
  {
    id: "tx-001",
    type: "outgoing",
    description: "SubDAO Funding - Innovation Labs DAO",
    amount: 50000,
    asset: "USDC",
    recipient: "0x1234...5678",
    timestamp: "2024-04-20 14:30",
    status: "completed",
    category: "SubDAO Funding",
    txHash: "0xabcd...efgh",
  },
  {
    id: "tx-002",
    type: "incoming",
    description: "Treasury Yield - Compound Protocol",
    amount: 2150,
    asset: "USDC",
    sender: "0x9876...5432",
    timestamp: "2024-04-20 09:15",
    status: "completed",
    category: "Yield",
    txHash: "0xijkl...mnop",
  },
  {
    id: "tx-003",
    type: "outgoing",
    description: "Community Grant - Education Initiative",
    amount: 15000,
    asset: "USDC",
    recipient: "0x2468...1357",
    timestamp: "2024-04-19 16:45",
    status: "completed",
    category: "Grants",
    txHash: "0xqrst...uvwx",
  },
  {
    id: "tx-004",
    type: "incoming",
    description: "Token Sale Proceeds",
    amount: 125000,
    asset: "ETH",
    sender: "0x1357...2468",
    timestamp: "2024-04-19 11:20",
    status: "completed",
    category: "Revenue",
    txHash: "0xyzab...cdef",
  },
  {
    id: "tx-005",
    type: "outgoing",
    description: "Operational Expenses - Q1 2024",
    amount: 35000,
    asset: "USDC",
    recipient: "0x8642...9753",
    timestamp: "2024-04-18 13:10",
    status: "completed",
    category: "Operations",
    txHash: "0xghij...klmn",
  },
  {
    id: "tx-006",
    type: "pending",
    description: "DeFi Protocol Investment",
    amount: 75000,
    asset: "USDC",
    recipient: "0x5555...4444",
    timestamp: "2024-04-21 10:00",
    status: "pending",
    category: "Investment",
    txHash: "0xopqr...stuv",
  },
]

export function TransactionHistory() {
  return (
    <Card className="stat-card-gradient p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Transaction History</h3>
          <div className="hidden sm:flex space-x-2">
            <Button variant="outline" size="sm">
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="relative flex-1 max-w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search transactions..." className="pl-10 bg-muted border-border" />
          </div>

          <div className="flex gap-2 sm:gap-3">
            <Select>
              <SelectTrigger className="flex-1 sm:w-32 bg-muted border-border">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="incoming">Incoming</SelectItem>
                <SelectItem value="outgoing">Outgoing</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="flex-1 sm:w-40 bg-muted border-border">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="subdao">SubDAO Funding</SelectItem>
                <SelectItem value="grants">Grants</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
                <SelectItem value="investment">Investment</SelectItem>
                <SelectItem value="yield">Yield</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Transaction List */}
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx.id} className="border border-border rounded-lg p-3 md:p-4 dao-card-hover cursor-pointer">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
                {/* Left side: Icon and Details */}
                <div className="flex items-start md:items-center gap-3 md:gap-4 min-w-0 flex-1">
                  <div
                    className={`p-2 rounded-full flex-shrink-0 ${tx.type === "incoming"
                      ? "bg-green-500/10"
                      : tx.type === "outgoing"
                        ? "bg-red-500/10"
                        : "bg-yellow-500/10"
                      }`}
                  >
                    {tx.type === "incoming" ? (
                      <ArrowDownLeft className="h-4 w-4 text-green-400" />
                    ) : tx.type === "outgoing" ? (
                      <ArrowUpRight className="h-4 w-4 text-red-400" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-yellow-400" />
                    )}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-medium text-foreground text-sm md:text-base truncate">{tx.description}</h4>
                      <Badge variant="outline" className="text-xs flex-shrink-0">
                        {tx.category}
                      </Badge>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
                      <span className="flex-shrink-0">{tx.timestamp}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="font-mono truncate max-w-[120px] sm:max-w-[150px]">{tx.txHash}</span>
                      <span className="hidden md:inline">•</span>
                      <span className="truncate hidden md:block">
                        {tx.type === "incoming" ? "From" : "To"}: {tx.type === "incoming" ? tx.sender : tx.recipient}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side: Amount and Status */}
                <div className="flex items-center justify-between md:flex-col md:items-end md:justify-center gap-2 md:text-right flex-shrink-0">
                  <div
                    className={`font-medium text-sm md:text-base ${tx.type === "incoming"
                      ? "text-green-400"
                      : tx.type === "outgoing"
                        ? "text-red-400"
                        : "text-yellow-400"
                      }`}
                  >
                    {tx.type === "incoming" ? "+" : tx.type === "outgoing" ? "-" : ""}${tx.amount.toLocaleString()}{" "}
                    {tx.asset}
                  </div>
                  <Badge
                    className={
                      tx.status === "completed"
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : tx.status === "pending"
                          ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                    }
                  >
                    {tx.status}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center pt-4">
          <Button variant="outline">Load More Transactions</Button>
        </div>
      </div>
    </Card>
  )
}
