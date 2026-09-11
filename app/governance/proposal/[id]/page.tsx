import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ProposalDetail } from "@/components/proposal-detail"
import { getProposalMetadata } from "@/app/actions"
import { createSiteMetadata, SITE_NAME } from "@/lib/site-metadata"
import type { Metadata } from "next"

function getProposalShortId(proposalId: string): string {
  const segments = proposalId.split("-")
  return segments[segments.length - 1] ?? proposalId
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const metadata = await getProposalMetadata(id)
  const shortId = getProposalShortId(id)
  const title = `Proposal ${shortId} | ${SITE_NAME}`
  const description =
    metadata?.full_description?.slice(0, 160) ??
    `View proposal ${shortId} on Creative Organization DAO governance.`

  return createSiteMetadata({
    title,
    description,
    path: `/governance/proposal/${id}`,
    openGraphTitle: title,
  })
}

export default async function ProposalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const metadata = await getProposalMetadata(id)

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 min-w-0 relative z-0">
        <div className="pt-16 md:pt-0">
          <DashboardHeader />
          <div className="p-4 sm:p-6">
            <ProposalDetail proposalId={id} initialMetadata={metadata} />
          </div>
        </div>
      </main>
    </div>
  )
}
