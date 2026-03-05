export function generateMerchantTransactionId(): string {
  const random = Math.floor(Math.random() * 1e12)
  return `TX${random}`.substring(0, 15)
}
