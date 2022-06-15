export interface PayloadPointer {
  reference: {
    archive: string
    schema: string
    timestamp?: number
  }
}

export const payloadPointerSchema = 'network.xyo.payload.pointer'
