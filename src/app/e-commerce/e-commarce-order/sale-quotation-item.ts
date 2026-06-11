export class SalesQuotationItemModel {
  id?:string;
  saleId:string;
  productDetailId:string;
  quantity:number;
  discountRate:string;
  productTax:string;
  sellingPrice:number;
  costingPrice:number;
  taxTypeId:number;
  taxAmount:number;
  discountAmount:number;
  totalAmount:number;
  createdById?:string;
  branchId?:string;
  unitId:string;
  companyId:string;
}
