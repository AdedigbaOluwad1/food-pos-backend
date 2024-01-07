export type IUser = {
    firstName: string,
    lastName: string,
    userID: string,
    signedInAt: string
}

export type ICart = {
    orderNote: string
    _id: string
    userId: string
    productId: string
    quantity: number
    isCheckedOut: boolean
    createdAt: string
    updatedAt: string
    __v: number
}
