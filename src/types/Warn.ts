export type Warn = {
    _id: number
    createdAt: Date,
    removedAt?: Date | null,
    reason: string,
    moderatorId: string
}