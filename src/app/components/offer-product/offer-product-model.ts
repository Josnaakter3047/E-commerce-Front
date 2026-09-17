
export interface OfferProductModel {
  id?:string,
  branchId:string;
  offerName: string;
  discount:number;
  categoryId:string;
  startDate:Date;
  endDate:Date;
  fromTime:string;
  toTime:string;
  note:string;
  createdById?:string;
  updatedById?:string;
  offerDetailItem:any[];
  newOfferDetailItem:any[]
}
