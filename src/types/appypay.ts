export interface AppypayCallbackPayload {
  merchantTransactionId: string
  ekwanzaTransactionId: number
  operationStatus: number
  operationData: {
    amount: number
    merchantIdentifier: string
    referenceType: "GPO" | "REF"
  }
}
