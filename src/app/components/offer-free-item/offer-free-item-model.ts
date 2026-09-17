
export interface OfferFreeItemModel {
  id?:string,
  offerDetailId: string;
  quantity:number;
  productDetailId:string;
  createdById?:string;
  updatedById?:string;
}
export interface OfferFreeListModel {
  newFreeOfferItemList:any[],
  existFreOfferItems:any[]
}
