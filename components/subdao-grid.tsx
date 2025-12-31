import { Button } from "./ui/button"
import { FEATURED_DAOS_CONFIG } from "../utils/featured-daos"
import { DaoCard } from "./featured-daos"

export function SubDAOGrid() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">All SubDAOs</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="transition-all duration-200 hover:scale-105 active:scale-95">
            Filter
          </Button>
          <Button variant="outline" size="sm" className="transition-all duration-200 hover:scale-105 active:scale-95">
            Sort
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURED_DAOS_CONFIG.map((dao) => (
          <DaoCard
            key={`${dao.chainId}-${dao.address}`}
            {...dao}
            showManageButton={true}
            description={dao.description}
          />
        ))}
      </div>
    </div>
  )
}

