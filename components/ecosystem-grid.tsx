import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tv, Newspaper, Landmark, ExternalLink, ArrowRight, Gift, Palette, Music } from "lucide-react"
import Link from "next/link"

const ecosystemProjects = [
    {
        id: "creative-tv",
        name: "Creative TV",
        description: "The premier video streaming platform for the creative economy. Watch, create, and earn rewards while engaging with decentralized content.",
        url: "https://tv.creativeplatform.xyz",
        category: "Entertainment",
        status: "Live",
        icon: Tv,
        color: "text-purple-400",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/20",
    },
    {
        id: "dear-creative",
        name: "Dear Creative",
        description: "Your source for the latest news, stories, and insights from the creative world. Stay updated with the pulse of the creator economy.",
        url: "https://news.creativeplatform.xyz",
        category: "Media & News",
        status: "Live",
        icon: Newspaper,
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20",
    },
    {
        id: "creative-bank",
        name: "Creative Bank",
        description: "Comprehensive financial tools and banking services tailored for creators. Manage your assets, payments, and investments in one place.",
        url: "https://bank.creativeplatform.xyz",
        category: "DeFi & Finance",
        status: "Live",
        icon: Landmark,
        color: "text-green-400",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/20",
    },
    {
        id: "bitrewards",
        name: "BitRewards",
        description: "A decentralized loyalty program rewarding engagement and creativity. Earn tokens for your contributions and redeem them for exclusive perks.",
        url: "https://rewards.creativeplatform.xyz",
        category: "Loyalty & Rewards",
        status: "Beta",
        icon: Gift,
        color: "text-orange-400",
        bgColor: "bg-orange-500/10",
        borderColor: "border-orange-500/20",
    },
    {
        id: "create",
        name: "Create",
        description: "Powerful tools for digital creation. Access a suite of resources to bring your artistic visions to life on the blockchain.",
        url: "https://create.creativeplatform.xyz",
        category: "Creator Tools",
        status: "Beta",
        icon: Palette,
        color: "text-pink-400",
        bgColor: "bg-pink-500/10",
        borderColor: "border-pink-500/20",
    },
    {
        id: "beat-me",
        name: "Beat Me",
        description: "Test your music knowledge and compete to win weekly USDC prize pots in this addictive music trivia miniapp.",
        url: "https://beatme.creativeplatform.xyz",
        category: "Gaming",
        status: "Live",
        icon: Music,
        color: "text-cyan-400",
        bgColor: "bg-cyan-500/10",
        borderColor: "border-cyan-500/20",
    },
]

export function EcosystemGrid() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ecosystemProjects.map((project) => (
                    <Card key={project.id} className="stat-card-gradient p-6 dao-card-hover group relative overflow-hidden border-border/50">

                        {/* Hover Gradient Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        <div className="space-y-6 relative z-10">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                                <div className={`p-3 rounded-xl ${project.bgColor} ${project.color} border ${project.borderColor} transition-transform duration-300 group-hover:scale-110`}>
                                    <project.icon className="h-8 w-8" />
                                </div>
                                <Badge variant="outline" className={`${project.bgColor} ${project.color} border-0`}>
                                    {project.status}
                                </Badge>
                            </div>

                            {/* Content */}
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                                    {project.name}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {project.description}
                                </p>
                            </div>

                            {/* Footer */}
                            <div className="pt-4 flex items-center justify-between border-t border-border/50">
                                <span className="text-xs font-medium text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
                                    {project.category}
                                </span>

                                <Button
                                    asChild
                                    variant="ghost"
                                    size="sm"
                                    className="gap-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                                >
                                    <Link href={project.url} target="_blank" rel="noopener noreferrer">
                                        Visit Platform
                                        <ExternalLink className="h-3 w-3" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
