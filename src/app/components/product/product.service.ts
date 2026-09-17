import { HttpClient, HttpUrlEncodingCodec } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MyApiService } from 'src/app/shared/my-api.service';
import { ProductModel } from './product-model';
import { IfExistProductCodeByCompanyModel } from './if-exist-product-code.model';


@Injectable({
  providedIn: 'root'
})

export class ProductService {
  modified = false;
  displayModal = false;
  menuId:any;
  subCategories:any;
  branches:any;
  searchResultProductList:any[] =[];
  selectedBranch:any[] = [];
  existingBranches: any[] = [];
  productBranchList:any[] = [];
  selectedFile: File | null = null;
  productId:any;
  previewUrl: string | ArrayBuffer | null = null;
  displayProductDetailList = false;
  productDetailList:any[] = [];
  productDetailsTotalRecords:number = 0;

  private baseUrl: string='';
  productAlertNotificationList:any[] =[];
  totalAlertNotification:number = 0;
  productCategegories:any[] = [];

  constructor(
    private http: HttpClient,
    private _fb:FormBuilder,
    private configService: MyApiService
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
  }

  controller ="/api/Product/";
  getAllUrl = this.controller + 'getall';
  addUrl = this.controller + 'add';
  getbyIdUrl = this.controller + 'get/';
  updateUrl = this.controller + 'update';
  updateProductUrl = this.controller + 'updateproduct';
  deleteUrl = this.controller + 'delete/';
  imageUploadUrl: string = this.controller + 'imgUpload/';
  fileDownloadUrl: string = this.controller + 'getfile/';
  ifProductCodeExistsUrl: string = this.controller + 'ifProductCodIsExist';
  downloadExcelTempeteUrl:string =  this.controller + 'download-excel-template';
  generateBarcodeUrl: string = this.controller + 'generate-barcodes';
  
  getProductAlertNotificationUrl = this.controller + 'getProductAlertNotification';
  getProductAlertCountUrl = this.controller + 'getProductAlertCount/';
  
  getAllProductBySpUrl = this.controller + 'getAllProductBySp';
  //getAllProductsForSearchUrl:string =this.controller + 'getAllProductListForSearch/';
  //getAllProductsForSearch_SalesUrl:string = this.controller + 'getAllProductListForSales/';
  getAllHasImeiProductsUrl:string = this.controller + 'getAllHasImeiProducts/';
  getallProductforDropdownUrl: string = this.controller + 'getallProductforDropdown/';
  getProductListbySearchInPosUrl: string = this.controller + 'loadProductsbySearch_insale';
  getAllProductInPosscreenUrl: string = this.controller + 'loadAllProductsIn_Posscreen';
  getAllProductsByCategoryIdUrl:string= this.controller + 'getAllByCompanyIdAndCategoryId';
 
  generateBarcodes(products:any) {
    return this.http.post(`${this.baseUrl}` + this.generateBarcodeUrl, products);
  }

  downloadExcelTemplete() {
    return this.http.get(`${this.baseUrl}` + this.downloadExcelTempeteUrl, {
    responseType: 'blob' // important
    });
  }
  filterForm = this._fb.group({
    companyId:[null, Validators.required],
    branchId:[null],
    categoryId:null,
    brandId:null,
    barcode:null,
    status:null
  })
  GetAllBySp(model:any){
    return this.http.post<any>(`${this.baseUrl}`+ this.getAllProductBySpUrl, model);
  }
  //load 500
  GetAllProductInPosScreen(model:any){
    return this.http.post<any>(`${this.baseUrl}`+ this.getAllProductInPosscreenUrl, model);
  }
  //by search
  GetAllProductInPosBySearch(model:any){
    return this.http.post<any>(`${this.baseUrl}`+ this.getProductListbySearchInPosUrl, model);
  }
  //showing in dropdown
  productListForstockBranch:any[] =[];
  productList:any[] =[];
  GetAllProductForDropdown(companyId:any, branchId:any){
    return this.http.get<any>(`${this.baseUrl}`+ this.getallProductforDropdownUrl + companyId +'/'+branchId);
  }
  GetAllHasIemiProducts(companyId:any){
    return this.http.get<any>(`${this.baseUrl}`+ this.getAllHasImeiProductsUrl + companyId);
  }
  GetAll(){
    return this.http.get<any>(`${this.baseUrl}`+ this.getAllUrl);
  }

  GetById(id:string){
    return this.http.get<any>(`${this.baseUrl}`+this.getbyIdUrl + id);
  }

  form = this._fb.group({
    id:null,
    companyId:[null, Validators.required],
    name: [null, Validators.required],
    rackId:[null],
    categoryId:[null, Validators.required],
    unitId:[null, Validators.required],
    subCategoryId:null,
    brandId:null,
    productCode:null,
    barcode:null,
    purchaseVatId:null,
    salesVatId:null,
    productTypeId:[1, Validators.required],
    taxTypeId:[2, Validators.required],
    alertQuantity:0,
    discount:null,
    productImageUrl:null,
    hasImei:false,
    isManageStock:true,
    isForSelling:false,
    isNotShowingOnline:false,
    createdById:null,
    updatedById:null,
    attributCategoryId:null,
    attributeId:null,
    //for product detail
    description:null,
    saleProfit:0,
    basePrice:0,
    costingPrice:0,
    sellingPrice:0,
    wholesalePrice:0,
    minimumSalePrice:0,
    productDetails:[[]],
    existingProductDetails:[[]],
    comboProducts:[[]],
    comboWithNoStockProducts:[[]],
    existingComboProducts:[[]]
  });

  Init(){
    this.form.reset();
    this.form.setValue({
      id:null,
      name: null,
      companyId:null,
      purchaseVatId:null,
      salesVatId:null,
      rackId:null,
      productCode:null,
      barcode:null,
      categoryId:null,
      unitId:null,
      subCategoryId:null,
      brandId:null,
      alertQuantity:0,
      discount:null,
      productImageUrl:null,
      hasImei:false,
      isManageStock:true,
      isForSelling:false,
      isNotShowingOnline:false,
      taxTypeId:2,
      productTypeId:1,
      createdById:null,
      updatedById:null,
      attributCategoryId:null,
      attributeId:null,
       //for product detail
       description:null,
       saleProfit:0,
       basePrice:0,
       costingPrice:0,
       sellingPrice:0,
       wholesalePrice:0,
       minimumSalePrice:0,
       productDetails:[],
       existingProductDetails:[],
       comboProducts:[],
       comboWithNoStockProducts:[],
       existingComboProducts:[]
    });
  }

  Populate(model:ProductModel){
    this.form.patchValue({
      id:model.id,
      name:model.name,
      productCode:model.productCode,
      barcode:model.barcode,
      categoryId:model.categoryId,
      subCategoryId:model.subCategoryId,
      productTypeId:model.productTypeId,
      rackId:model.rackId,
      brandId:model.brandId,
      unitId:model.unitId,
      purchaseVatId:model.purchaseVatId,
      salesVatId:model.salesVatId,
      taxTypeId:model.taxTypeId,
      alertQuantity:model.alertQuantity,
      discount:model.discount,
      hasImei:model.hasImei,
      isManageStock:model.isManageStock,
      isForSelling:model.isForSelling,
      isNotShowingOnline:model.isNotShowingOnline,
      createdById:model.createdById,
      updatedById:model.updatedById,

      description:model.description?model.description:null,
      saleProfit:model.saleProfit? model.saleProfit:0,
      basePrice:model.basePrice?model.basePrice:0,
      costingPrice:model.costingPrice?model.costingPrice:0,
      sellingPrice:model.sellingPrice?model.sellingPrice:0,
      wholesalePrice:model.wholesalePrice?model.wholesalePrice:0,
      minimumSalePrice:model.minimumSalePrice?model.minimumSalePrice:0
    });
  }

  Add(model:any){
    const data:ProductModel ={
      name:model.name,
      companyId:model.companyId,
      productTypeId:model.productTypeId,
      productCode:model.productCode,
      barcode:model.barcode,
      rackId:model.rackId,
      categoryId:model.categoryId,
      subCategoryId:model.subCategoryId,
      brandId:model.brandId,
      unitId:model.unitId,
      purchaseVatId:model.purchaseVatId,
      salesVatId:model.salesVatId,
      taxTypeId:model.taxTypeId,
      alertQuantity:model.alertQuantity? model.alertQuantity:0,
      discount:model.discount,
      hasImei:model.hasImei,
      isManageStock:model.isManageStock,
      isForSelling:model.isForSelling,
      isNotShowingOnline:model.isNotShowingOnline,
      createdById:model.createdById,
      description:model.description,
      saleProfit:model.saleProfit? model.saleProfit:0,
      basePrice:model.basePrice? model.basePrice: 0,
      costingPrice:model.costingPrice? model.costingPrice: 0,
      sellingPrice:model.sellingPrice? model.sellingPrice: 0,
      wholesalePrice:model.wholesalePrice? model.wholesalePrice: 0,
      minimumSalePrice:model.minimumSalePrice? model.minimumSalePrice: 0,
      productDetails:model.productDetails,
      comboProducts:model.comboProducts,
      comboWithNoStockProducts:model.comboWithNoStockProducts
    }
    return this.http.post<any>(`${this.baseUrl}`+this.addUrl, data);
  }

  Update(model:any){
    return this.http.put<any>(`${this.baseUrl}`+this.updateUrl, model);
  }

  UpdateProduct(model:any){
    const data:ProductModel ={
      id:model.id,
      name:model.name,
      companyId:model.companyId,
      productTypeId:model.productTypeId,
      productCode:model.productCode,
      barcode:model.barcode,
      rackId:model.rackId,
      categoryId:model.categoryId,
      subCategoryId:model.subCategoryId,
      brandId:model.brandId,
      unitId:model.unitId,
      purchaseVatId:model.purchaseVatId,
      salesVatId:model.salesVatId,
      discount:model.discount,
      
      taxTypeId:model.taxTypeId,
      alertQuantity:model.alertQuantity? model.alertQuantity:0,
      hasImei:model.hasImei,
      isManageStock:model.isManageStock,
      isForSelling:model.isForSelling,
      isNotShowingOnline:model.isNotShowingOnline,
      description:model.description,
      saleProfit:model.saleProfit? model.saleProfit:0,
      basePrice:model.basePrice? model.basePrice: 0,
      costingPrice:model.costingPrice? model.costingPrice:0,
      sellingPrice:model.sellingPrice? model.sellingPrice:0,
      wholesalePrice:model.wholesalePrice? model.wholesalePrice:0,
      minimumSalePrice:model.minimumSalePrice? model.minimumSalePrice:0,
      productDetails:model.productDetails,
      existingProductDetails:model.existingProductDetails,
      comboProducts:model.comboProducts,
      existingComboProducts:model.existingComboProducts,
      createdById:model.createdById,
      updatedById:model.updatedById
    }
    return this.http.post<any>(`${this.baseUrl}`+this.updateProductUrl, data);
  }

  Delete(id:any){
    return this.http.delete<any>(`${this.baseUrl}`+this.deleteUrl+id);
  }

  IfMasterProductCodeExists(Id: any, CompanyId:any, ProductCode: any) {
    const model: IfExistProductCodeByCompanyModel = {
      productCode: ProductCode,
      companyId:CompanyId
    }
    if (Id == null) {
      return this.http.post<any>(`${this.baseUrl}`+this.ifProductCodeExistsUrl, model);
    } else {
      model.id = Id;
      model.companyId = CompanyId;
      return this.http.post<any>(`${this.baseUrl}`+this.ifProductCodeExistsUrl, model);
    }
  }

  //Generate Variant
  //upload product images
  productImageUrl:any;
  codec = new HttpUrlEncodingCodec;
  productFile:any;
  
  Upload(id: any, file: any) {
    const data = new FormData();
    data.append('productImage', file, file.name);
    return this.http.post<any>(`${this.baseUrl}`+this.imageUploadUrl + id, data);
  }
 
  FileDownload(url: string) {
    const httpOptions = {
      responseType: 'blob' as 'json'
    };
    return this.http.get<any>(`${this.baseUrl}`+this.fileDownloadUrl + this.codec.encodeValue(url), httpOptions);
  }

  getProductInventoryUrl:string = '/api/ProductInventory/getbyBranchIdProductId/';
  GetStock(branchId:any, productDetailId:any){
    return this.http.get<any>(`${this.baseUrl}`+ this.getProductInventoryUrl + branchId + "/"+productDetailId);
  }
  updateProductRackIdUrl: string =  this.controller + 'updateProductRack';
  updateToActiveUrl: string =  this.controller + 'updateActive/';
  updateToInActiveUrl: string =  this.controller + 'updateInActive/';
  UpdateRackId(model:any){
    return this.http.put<any>(`${this.baseUrl}`+this.updateProductRackIdUrl, model);
  }
  ActiveProduct(id:any){
    return this.http.get<any>(`${this.baseUrl}`+this.updateToActiveUrl + id);
  }
  InActiveProduct(id:any){
    return this.http.get<any>(`${this.baseUrl}`+this.updateToInActiveUrl + id);
  }
  
  alertForm = this._fb.group({
    branchId:null,
    stockQty:null,
    categoryId:null,
    salesDays:null
  })

  GetAlertNotification(model:any){
    return this.http.post<any>(`${this.baseUrl}`+this.getProductAlertNotificationUrl, model);
  }
  
  GetTotalProductAlertCount(branchId:any){
    return this.http.get<any>(`${this.baseUrl}`+this.getProductAlertCountUrl + branchId);
  }

  deleteProductImageByProductIdUrl: string =  this.controller + 'deleteProductImageByProductId/';
  deleteProductImageById(id: any) {
    return this.http.get<any>(`${this.baseUrl}`+this.deleteProductImageByProductIdUrl + id);
  }
 
  getProductDetailsByProductIdUrl: string =  this.controller + 'getProductDetailsByProductId/';
  GetProductDetailsById(productId:any){
    return this.http.get<any>(`${this.baseUrl}`+ this.getProductDetailsByProductIdUrl+ productId);
  }
  
  GetAllProductByFilter(model:any){
    return this.http.post<any>(`${this.baseUrl}`+ this.getAllProductsByCategoryIdUrl, model);
  }
  
  getAllProductsForCustomerShoppingUrl: string =  this.controller + 'getAllProductForCustomerShopping';
  GetAllProductForCustomerShopping(model:any){
    return this.http.post<any>(`${this.baseUrl}`+ this.getAllProductsForCustomerShoppingUrl, model);
  }
  getTopProductsUrl: string = '/api/Dashboard/getTopProductList';
  GetTopProductList(model:any){
    return this.http.post<any>(`${this.baseUrl}`+ this.getTopProductsUrl, model);
  }
}
