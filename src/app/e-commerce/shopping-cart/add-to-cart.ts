export class CartItemModel {
  productId:string;
  productCode:string;
  name: string;
  brandName:string;
  categoryName:string;
  description:string;
  sellingPrice:number;
  price: number;
  image: string;
  quantity: number;
  productDetailId:string;
  discountAmount:number;
  discountRate:number;
  totalAmount?:number;
  costingPrice?:number;
  stockQty?:number;
  unitId?:string;
}
