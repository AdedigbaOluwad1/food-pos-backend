export default class ConstructCartItemObject {
    itemName: string;
    itemImage: string;
    itemPrice: number;
    itemQuantity: number;
    orderNote: string;
    itemId: string

    constructor(itemName: string, itemPrice: number, itemImage: string, itemQuantity: number, orderNote: string, itemId: string){
        this.itemName = itemName,
        this.itemImage = itemImage,
        this.itemPrice = itemPrice,
        this.itemQuantity = itemQuantity,
        this.orderNote = orderNote,
        this.itemId = itemId
    }
}