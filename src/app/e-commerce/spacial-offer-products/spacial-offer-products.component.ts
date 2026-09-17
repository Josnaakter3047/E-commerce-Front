import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/components/application-services/item-category.service';
import { MyApiService } from 'src/app/shared/my-api.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';
import { BrandService } from 'src/app/components/application-services/item-brand.service';
import { CompanyDetailService } from 'src/app/components/application-services/company-detail.service';
import { SoftwareGeneralSettingService } from 'src/app/components/software-general-settings/general-settings.service';
import { OfferProductService } from 'src/app/components/offer-product/offer-product.service';
import { OfferFreeItemService } from 'src/app/components/offer-free-item/offer-free-item.service';
import { OfferDetailService } from 'src/app/components/offer-detail/offer-detail.service';
import { HttpStatusCode } from '@angular/common/http';
import { ProductService } from 'src/app/components/product/product.service';


@Component({
  selector: 'app-spacial-offer-products',
  templateUrl: './spacial-offer-products.component.html',
  styleUrls: ['./spacial-offer-products.component.css']
})
export class SpacialOfferProductComponent implements OnInit {
  offerList:any;
  productList:any[] =[];
  filteredProducts:any[] =[];
  loading = false;
  baseUrl: string = '';
  generalSettings: any;
  discountedPrice:number = 0;
  discountAmount:number = 0;
  branchId: any;
  companyId: any;
  constructor(
    public _service: OfferProductService,
    private _freeOfferService:OfferFreeItemService,
    private _offerDetailService:OfferDetailService,
    private _productService:ProductService,
    private _categoryService:CategoryService,
    private _sharedService: SharedService,
    private datePipe:DatePipe,
    private _generalSettingService: SoftwareGeneralSettingService,
    private configService: MyApiService,
    public _shoppingCartService:ShoppingCartService,
    private _brandService:BrandService,
    public _companyService:CompanyDetailService
  ) { 
    this.baseUrl = this.configService.apiBaseUrl;
    this.branchId = this.configService.apiBranchId;
    this.companyId = this.configService.apiCompanyId;
  }

  ngOnInit(): void {
    this.GetAllOfferList();
    this. GetAllOfferProducts();
    this.GetCompanyById(); 
    this.GetSoftwareSettingByBranch();
  }

  GetAllOfferList() {      
      if(this.branchId){
        this._service.GetAllActiveOffersByBranchId(this.branchId).subscribe((response) => {
          if (response.statusCode === HttpStatusCode.Ok) {
            this.offerList = response.value;            
            this.loading = false;
          }  else {
            this.offerList = null;
            this.loading = false;
            //this._sharedService.showCustom('Unknown HttpResponse From Server', 'Unknown Status Code');
          }
          
        },
          (error: any) => {
            this._sharedService.HandleError(error);
            this.loading = false;
          }
        );
      }
  }
  GetAllOfferProducts(){       
      if(this.companyId,this.branchId){
        this._service.GetAllActiveOffersProductsByBranchId(this.companyId,this.branchId).subscribe((response) => {
          if (response.statusCode === HttpStatusCode.Ok) {
            this.productList = response.value;   
            this.filteredProducts = response.value;         
          }  else {
            this.productList = [];
            this.filteredProducts = [];
          }
          
        },
          (error: any) => {
            this._sharedService.HandleError(error);
            this.productList = [];
            this.filteredProducts = [];
            console.log(error);
          }
        );
      }
  }
  GetCompanyById(){
     if(this.companyId){
      this._companyService.GetCompanyById(this.companyId).subscribe(response=>{
        if(response.statusCode === 200){
          this._companyService.company = response.value;
        }
        else{
          this._companyService.company = null;
        }
      },error=>{
        this._companyService.company = null;
      })
     }
  }
  GetSoftwareSettingByBranch() {
    if (this.branchId) {
      this._generalSettingService.GetByBranchId(this.branchId).subscribe((response) => {
        if (response.statusCode === 200) {
          this.generalSettings = response.value;
          //console.log(this.generalSettings);
        }
        else {
          this.generalSettings = null;
        }
      })
    }
    else {
      this.generalSettings = null;
    }

  }
  addToCart(product: any) {
    this._shoppingCartService.addProductToCart(product);
  }
  increaseQty(product: any) {
    const existing = this._shoppingCartService.cartItems.find(
      i => i.productDetailId === product.productDetailId
    );

    if (existing) {
      if (this.generalSettings?.isSalesWithNegativeStock && existing.quantity >= product.stockQty) {
        this._sharedService.showWarn("Stock limit exceeded");
        return;
      }
      existing.quantity++;
    } else {
      if (this.generalSettings?.isSalesWithNegativeStock && product.stockQty <= 0) {
        this._sharedService.showWarn("Your stock is not available");
        return;
      }
      this._shoppingCartService.addProductToCart(product);
    }
    this._shoppingCartService.saveCart();
  }

  decreaseQty(product: any) {
    const existing = this._shoppingCartService.cartItems.find(
      i => i.productDetailId === product.productDetailId
    );

    if (existing) {
      if (existing.quantity > 1) {
        existing.quantity--;
      } else {
        this._shoppingCartService.removeItemByProductDetailId(product.productDetailId);
      }
      this._shoppingCartService.saveCart();
    }
  }

  getCartQty(productDetailId: any): number {
    const existing = this._shoppingCartService.cartItems.find(i => i.productDetailId === productDetailId);
    return existing ? existing.quantity : 0;
  }

  onRemoveItem(productDetailId: any) {
    this._shoppingCartService.removeItemByProductDetailId(productDetailId);
  }
  onCalculateDiscountedPrice(price: any, disocunt): number {
    this.discountAmount = price * (disocunt / 100) || 0;
    this.discountedPrice = (price - this.discountAmount) || 0;
    return this.discountedPrice;
  }
  filterProduct(offerId:any) {
    if(offerId){
      this.filteredProducts = this.productList?.filter(p => p.offerId == offerId);
    }
    
  }
}
