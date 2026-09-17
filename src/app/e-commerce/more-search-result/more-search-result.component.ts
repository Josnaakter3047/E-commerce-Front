import { Component, OnInit } from '@angular/core';
import { MyApiService } from 'src/app/shared/my-api.service';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';
import { ActivatedRoute } from '@angular/router';
import { SoftwareGeneralSettingService } from 'src/app/components/software-general-settings/general-settings.service';
import { SharedService } from 'src/app/shared/shared.service';
import { CompanyDetailService } from 'src/app/components/application-services/company-detail.service';
import { ProductService } from 'src/app/components/product/product.service';

@Component({
  selector: 'app-more-search-result',
  templateUrl: './more-search-result.component.html',
  styleUrls: ['./more-search-result.component.css']
})
export class MoreSearchResultComponent implements OnInit {
  productList: any;
  baseUrl: string = '';
  visibleCart = false;
  branchId: any;
  companyId: any;
  discountedPrice: number = 0;
  discountAmount: number = 0;
  searchName: any;
  searchCount: number = 0;
  //paginator
  pagedProducts: any[] = [];
  rows: number = 15; // products per page
  totalRecords: number = 0;
  constructor(
    public _productService: ProductService,
    private configService: MyApiService,
    public _companyService:CompanyDetailService,
    public _shoppingCartService: ShoppingCartService,
    private _route: ActivatedRoute,
    private _sharedService:SharedService,
    public _softwareSettingService:SoftwareGeneralSettingService,
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
    this.branchId = this.configService.apiBranchId;
    this.companyId = this.configService.apiCompanyId;
  }
  trackByProduct(index: number, item: any) {
    return item.productDetailId; // or item.id
  }
  ngOnInit(): void {
    this._route.queryParams.subscribe(params => {
      this.searchName = params['search_result'],
        this.searchCount = params['result_count']
    });

    this.GetAllProduct();
    this.GetSettingsByBranchId();
  }
  isProductLoading = false;
   pageNumber = 1;
  pageSize = 100;
  totalProducts = 0;
  
  GetAllProduct() {
    if (this.branchId && this.companyId) {
      this.isProductLoading = true;
      const model = {
        companyId: this.companyId,
        branchId: this.branchId,
        search: this.searchName,
        categoryId: null,
        brandId: null,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      };
      this._productService.GetAllProductForCustomerShopping(model).subscribe({
        next: (response) => {
          if (response.statusCode === 200) {
            this.productList = response.value.map(product => ({
              ...product,
              discountedPrice: this.onCalculateDiscountedPrice(
                product.sellingPrice,
                product.discount
              ),
              quantity: this.getCartQty(product.productDetailId)
            }));

            this.totalProducts = response.totalRecords || 0;

          } else {
            this.productList = [];
            this.totalProducts = 0;
          }

          this.isProductLoading = false;
        },

        error: (error) => {
          console.error("Error loading products:", error);
          this.productList = [];
          this.totalProducts = 0;

          this.isProductLoading = false;
        }
      });
    }
    else {
      this.productList = [];
      this.totalProducts = 0;
      console.log("Company not found");
      this.isProductLoading = false;
    }
  }
  onPageChange(event: any) {
    this.pageNumber = event.page + 1,
    this.pageSize = event.rows
    this.GetAllProduct();
  }
  getCartQty(productDetailId: any): number {
    const existing = this._shoppingCartService.cartItems?.find(i => i.productDetailId === productDetailId);
    return existing ? existing.quantity : 0;
  }
  selectInput(event: any) {
    setTimeout(() => {
      event.target.select();
    });
  }
  updateCartItemQty(item: any) {
    const qty = Number(item.quantity);

    if (isNaN(qty)) {
      return;
    }

    if (qty <= 0) {
      this._shoppingCartService.removeItemByProductDetailId(
        item.productDetailId
      );
      this._shoppingCartService.saveCart();
      return;
    }

    item.quantity = qty;

    this._shoppingCartService.saveCart();
  }
  GetSettingsByBranchId(){
    if(this.branchId){
      this._softwareSettingService.GetByBranchId(this.branchId).subscribe((response)=>{
        if(response.statusCode === 200 && response.value != null){
          this._softwareSettingService.settings = response.value;
          // this._service.shippingCharge = this._softwareSettingService.settings?.serviceCharge?? 0;
          // this._service.orderForm.patchValue({
          //   shippingCharge:this._softwareSettingService.settings?.serviceCharge?? 0
          // })
        }
        else{
          this._softwareSettingService.settings = null;
        }
      })
    }
    else{
      this._softwareSettingService.settings = null;
    }
  }
  updateQty(product: any, event: any) {
  let qty = Number(event.target.value);

  // Allow selling exactly the available stock
  if (this._softwareSettingService.settings?.isSalesWithNegativeStock && qty > product.stockQty) {
    this._sharedService.showWarn("Stock limit exceeded");

    // Reset input to previous/current valid quantity
    const existing = this._shoppingCartService.cartItems.find(
      x => x.productDetailId === product.productDetailId
    );

    event.target.value = existing?.quantity ?? 0;

    return;
  }

  const existing = this._shoppingCartService.cartItems.find(
    x => x.productDetailId === product.productDetailId
  );

  if (qty <= 0) {
    if (existing) {
      this._shoppingCartService.removeItemByProductDetailId(
        product.productDetailId
      );
    }

    this._shoppingCartService.saveCart();
    return;
  }

  if (existing) {
    existing.quantity = qty;
  } else {
    product.quantity = qty;
    this._shoppingCartService.addProductToCart(product);
  }

  this._shoppingCartService.saveCart();
  }
  increaseQty(product: any) {
    const existing = this._shoppingCartService.cartItems?.find(
      i => i.productDetailId === product.productDetailId
    );

    if (existing) {
      if (this._softwareSettingService.settings?.isSalesWithNegativeStock && existing.quantity >= product.stockQty) {
      this._sharedService.showWarn("Stock limit exceeded");
      return;
    }
      existing.quantity++;
    } else {
       if (this._softwareSettingService.settings?.isSalesWithNegativeStock && product.stockQty <= 0) {
      this._sharedService.showWarn("Your stock is not available");
      return;
    }
      this._shoppingCartService.addProductToCart(product);
    }
    this._shoppingCartService.saveCart();
     //this.onCalculateNetAmount();
  }
  decreaseQty(product: any) {
  const existing = this._shoppingCartService.cartItems?.find(
    i => i.productDetailId === product.productDetailId
  );

  if (existing) {
    if (existing.quantity > 1) {
      existing.quantity--;
    } else {
      this._shoppingCartService.removeItemByProductDetailId(product.productDetailId);
    }
    this._shoppingCartService.saveCart();
     //this.onCalculateNetAmount();
  }
  }

onRemoveItem(productDetailId: any) {
  this._shoppingCartService.removeItemByProductDetailId(productDetailId);
}

  
  onCalculateDiscountedPrice(price:any, disocunt):number{
    this.discountAmount = price * (disocunt/100) || 0;
    this.discountedPrice = (price - this.discountAmount) || 0;
    return this.discountedPrice;
  }
}
