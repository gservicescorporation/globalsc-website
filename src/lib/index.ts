import dataSource from "./typeorm"

export async function initDataSource() {
  if (!dataSource.isInitialized) {
    await dataSource.initialize()
  }
  return dataSource
}
