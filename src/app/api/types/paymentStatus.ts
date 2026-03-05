export interface AppyPayChargeResponse {
  payment: {
    id: string
    merchantTransactionId: string
    type: string
    operation: string
    amount: number
    currency: string
    status: "Pending" | "Success" | "Failed"
    description: string
    disputes: boolean
    applicationFeeAmount: number
    paymentMethod: string
    createdDate: string
    updatedDate: string
    options: string[]
    reference: {
      referenceNumber: string
      dueDate: string
      entity: string
    }
    eletronicReceipt: string | null
    transactionEvents: TransactionEvent[]
  }
}

export interface TransactionEvent {
  id: number
  transactionId: string
  type: string
  providerTransactionId: string | null
  merchantReceipt: string | null
  customerReceipt: string | null
  actionStatus: boolean
  createdDate: string
  responseStatus: {
    successful: boolean
    code: number
    message: string
    source: string
    sourceDetails: {
      attempt: number
      type: string
      code: string
      message: string
    }
  }
}
