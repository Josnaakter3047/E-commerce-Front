import { HttpClient, HttpUrlEncodingCodec } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IfExistsByCompanyModel, IfExistsModel } from 'src/app/other-models/if-exists.model';

import { MyApiService } from 'src/app/shared/my-api.service';


@Injectable({
  providedIn: 'root'
})

export class ProductService {
  modified = false;
  displayModal = false;
  subCategories:any;
  branches:any;
  searchResultProductList:any[] = [];
  selectedBranch:any[] = [];
  existingBranches: any[] = [];
  productBranchList:any[] = [];
  selectedFile: File | null = null;
  productId:any;
  previewUrl: string | ArrayBuffer | null = null;
  private baseUrl: string='';
  controller ="/api/Product/";
  getAllTopTenProductListUrl: string = '/api/Dashboard/getTopProductList';
  getAllProductForEcommerceUrl:string= this.controller + 'getAllProductForEcommerceByBranchId/';
  getAllProductsForEcommerceByBranchAndCategoryUrl:string= this.controller + 'getAllProductsForEcommerceByBranchAndCategoryId/';
  getProductDetailsByIdForEcomerceUrl = this.controller + 'getProductDetailsByProductIdForEcommerce/';
  

  constructor(
    private http: HttpClient,
    private _fb:FormBuilder,
    private configService: MyApiService
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
  }

  GetProductDetailsById(id:string){
    return this.http.get<any>(`${this.baseUrl}`+this.getProductDetailsByIdForEcomerceUrl + id);
  }

  GetAllProductsBranchId(branchId:any){
    return this.http.get<any>(`${this.baseUrl}`+ this.getAllProductForEcommerceUrl + branchId);
  }
  GetAllProductByBranchIdAndCategory(branchId:any, categoryId:any){
    return this.http.get<any>(`${this.baseUrl}`+ this.getAllProductsForEcommerceByBranchAndCategoryUrl + branchId + "/" + categoryId);
  }
  GetTopProductList(model:any) {
    return this.http.post<any>(`${this.baseUrl}`+this.getAllTopTenProductListUrl,model);
  }
  filterForm = this._fb.group({
    startDate:new Date(),
    endDate:new Date(),
    branchId:null
  })
 

}
