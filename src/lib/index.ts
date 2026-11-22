import dataSource from "./typeorm"

let initializing: Promise<typeof dataSource> | null = null

/** Inicializa a ligação uma única vez (seguro em pedidos concorrentes). */
export async function initDataSource() {
	if (dataSource.isInitialized) return dataSource
	if (!initializing) {
		initializing = dataSource.initialize().catch((err) => {
			initializing = null
			throw err
		})
	}
	return initializing
}

export function hasDatabase() {
	return Boolean(process.env.DATABASE_URL)
}
