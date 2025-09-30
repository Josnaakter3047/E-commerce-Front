import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/components/application-services/product.service';
import { MyApiService } from 'src/app/shared/my-api.service';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';
import { ActivatedRoute } from '@angular/router';

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
    public _shoppingCartService: ShoppingCartService,
    private _route: ActivatedRoute
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
    this.branchId = this.configService.apiBranchId;
    this.companyId = this.configService.apiCompanyId;
  }

  ngOnInit(): void {
    this._route.queryParams.subscribe(params => {
      this.searchName = params['search_result'],
        this.searchCount = params['result_count']
    });

    this.GetAllProduct();
  }

  GetAllProduct() {
    if (this.companyId) {
      this._productService.GetAllProductsCompanyId(this.companyId).subscribe(response => {
        if (response.statusCode === 200) {
          this.productList = response.value;
          if (this.searchName) {
            this._productService.searchResultProductList = this.productList.filter(product =>
              product.name.toLowerCase().includes(this.searchName.toLowerCase())
            );
          }

          this.totalRecords = this.productList.length;
          this.paginate({ first: 0, rows: this.rows });
        }
        else {
          this.productList = null;
          this._productService.searchResultProductList = [];
        }
      })
    }
    else {
      this.productList = null;
      this._productService.searchResultProductList = [];
      console.log("Company not found");
    }
  }
  paginate(event: any) {
    const start = event.first;
    const end = start + event.rows;
    this.pagedProducts = this.productList.slice(start, end);
  }
 increaseQty(product: any) {
  const existing = this._shoppingCartService.cartItems.find(
    i => i.productDetailId === product.productDetailId
  );

  if (existing) {
    existing.quantity++;
  } else {
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

  
  onCalculateDiscountedPrice(price:any, disocunt):number{
    this.discountAmount = price * (disocunt/100) || 0;
    this.discountedPrice = (price - this.discountAmount) || 0;
    return this.discountedPrice;
  }
}
