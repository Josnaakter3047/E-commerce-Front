export class CartItemModel {
  productId:string;
  name: string;
  description:string;
  price: number;
  image: string;
  quantity: number;
  productDetailId:string;
  discountAmount:number;
  discountRate:number;
  totalAmount?:number;
}
