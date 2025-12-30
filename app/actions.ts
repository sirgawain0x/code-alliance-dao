'use server'

import { db } from '@/lib/db'

export async function getParentDaoData() {
    try {
        const result = await db.query(`
      SELECT * FROM dao_info 
      WHERE name = 'Creative Organization DAO' 
      LIMIT 1
    `)
        return result.rows[0] || null
    } catch (error) {
        console.error('Failed to fetch parent DAO data:', error)
        return null
    }
}

export async function getMembers(filter: { role?: string; status?: string; search?: string } = {}) {
    try {
        let query = `SELECT * FROM members WHERE 1=1`
        const params: any[] = []
        let paramIndex = 1

        if (filter.role && filter.role !== 'all') {
            query += ` AND role = $${paramIndex}`
            params.push(filter.role)
            paramIndex++
        }

        if (filter.status && filter.status !== 'all') {
            query += ` AND status = $${paramIndex}`
            params.push(filter.status)
            paramIndex++
        }

        if (filter.search) {
            query += ` AND (name ILIKE $${paramIndex} OR wallet_address ILIKE $${paramIndex})`
            params.push(`%${filter.search}%`)
            paramIndex++
        }

        query += ` ORDER BY reputation DESC LIMIT 50`

        const result = await db.query(query, params)
        return result.rows
    } catch (error) {
        console.error('Failed to fetch members:', error)
        return []
    }
}

export async function getMemberStats() {
    try {
        const totalResult = await db.query(`SELECT COUNT(*) as count FROM members`)
        const newMembersResult = await db.query(`
      SELECT COUNT(*) as count FROM members 
      WHERE join_date > NOW() - INTERVAL '1 month'
    `)
        const rolesResult = await db.query(`
      SELECT role, COUNT(*) as count 
      FROM members 
      GROUP BY role
    `)

        return {
            total: parseInt(totalResult.rows[0].count),
            newMembers: parseInt(newMembersResult.rows[0].count),
            roles: rolesResult.rows.map((row: any) => ({
                role: row.role,
                count: parseInt(row.count)
            }))
        }
    } catch (error) {
        console.error('Failed to fetch member stats:', error)
        return null
    }
}

export async function getProposalMetadata(proposalId: string) {
    try {
        const result = await db.query(`
      SELECT * FROM proposal_metadata 
      WHERE proposal_id = $1
    `, [proposalId])
        return result.rows[0] || null
    } catch (error) {
        console.error('Failed to fetch proposal metadata:', error)
        return null
    }
}
