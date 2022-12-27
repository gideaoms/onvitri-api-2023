type StoreRepository = {
  findMany(page: number): Promise<void>
}

export { StoreRepository }
