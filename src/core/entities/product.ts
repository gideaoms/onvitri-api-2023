export class Product {
  public readonly id: string
  public readonly description: string

  public constructor(product: { id: string; description: string }) {
    this.id = product.id
    this.description = product.description
  }
}
