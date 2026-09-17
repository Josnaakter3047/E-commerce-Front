

export interface ProductModel {
  id?:string,
  name: string;
  companyId:string;
  productTypeId:string;
  productCode:string;
  
  categoryId:string;
  subCategoryId?:string;
  brandId?:string;
  unitId?:string;
  purchaseVatId?:string;
  salesVatId?:string;
  alertQuantity:number;
  discount:number;
  taxTypeId:string;
  
  hasImei:boolean;
  isManageStock:boolean;
  isForSelling:boolean;
  isNotShowingOnline:boolean;
  createdById:string;
  updatedById?:string;
  productImageUrl?:string;

  description?:string;
  barcode:string;
  saleProfit?:number;
  basePrice?:number;
  costingPrice?:number;
  sellingPrice?:number;
  rackId?:string;
  wholesalePrice?:number;
  minimumSalePrice?:number;
  productDetails?:any[];
  existingProductDetails?:any[];
  comboProducts?:any[];
  comboWithNoStockProducts?:any[];
  existingComboProducts?:any[];

}
