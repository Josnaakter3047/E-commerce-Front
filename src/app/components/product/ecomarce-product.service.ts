import { HttpClient, HttpUrlEncodingCodec } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MyApiService } from 'src/app/shared/my-api.service';
import { ProductModel } from './product-model';
import { IfExistProductCodeByCompanyModel } from './if-exist-product-code.model';


@Injectable({
  providedIn: 'root'
})

export class EcomarceProductService {
  productListForstockBranch:any[] =[];
  productList:any[] =[];
  private baseUrl: string='';
  constructor(
    private http: HttpClient,
    private _fb:FormBuilder,
    private configService: MyApiService
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
  }

  controller ="/api/Product/";
  getbyIdUrl = this.controller + 'get/';
  getProductdetailsByProductIdUrl:string = this.controller + 'getProductDetailsByProductId/';
  getallProductforDropdownUrl: string = this.controller + 'getallProductforDropdown/';
  getProductListbySearchInPosUrl: string = this.controller + 'loadProductsbySearch_insale';
  getAllProductInPosscreenUrl: string = this.controller + 'loadAllProductsIn_Posscreen';
  getAllProductsByCategoryIdUrl:string= this.controller + 'getAllByCompanyIdAndCategoryId';
  getAllProductForCustomerShoppingUrl:string = this.controller + 'getAllProductForCustomerShopping';

  filterForm = this._fb.group({
    companyId:[null, Validators.required],
    branchId:[null],
    categoryId:null,
    brandId:null,
    barcode:null,
    status:null
  })
  
  GetAllProductForCustomerShopping(model:any){
    return this.http.post<any>(`${this.baseUrl}`+this.getAllProductForCustomerShoppingUrl,model);
  }
  //load 500
  GetAllProductInPosScreen(model:any){
    return this.http.post<any>(`${this.baseUrl}`+ this.getAllProductInPosscreenUrl, model);
  }
  //by search
  GetAllProductInPosBySearch(model:any){
    return this.http.post<any>(`${this.baseUrl}`+ this.getProductListbySearchInPosUrl, model);
  }
  
  GetAllProductForDropdown(companyId:any, branchId:any){
    return this.http.get<any>(`${this.baseUrl}`+ this.getallProductforDropdownUrl + companyId +'/'+branchId);
  }

  
  GetAllProductByCategoryId(model:any){
    return this.http.post<any>(`${this.baseUrl}`+ this.getAllProductsByCategoryIdUrl, model);
  }
  

  GetById(id:string){
    return this.http.get<any>(`${this.baseUrl}`+this.getbyIdUrl + id);
  }
  
  GetProductDetailsById(productId:any){
    return this.http.get<any>(`${this.baseUrl}`+this.getProductdetailsByProductIdUrl + productId);
  }
  
 
}
