import { Component, OnInit } from '@angular/core';
import { MyApiService } from 'src/app/shared/my-api.service';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';
import { CompanyDetailService } from 'src/app/components/application-services/company-detail.service';
import { SoftwareGeneralSettingService } from 'src/app/components/software-general-settings/general-settings.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ProductService } from 'src/app/components/product/product.service';

@Component({
  selector: 'app-all-product',
  templateUrl: './all-product.component.html',
  styleUrls: ['./all-product.component.css']
})
export class AllProductComponent implements OnInit {
  productList: any[] = [];
  baseUrl: string = '';
  visibleCart = false;
  branchId: any;
  companyId: any;
  discountedPrice: number = 0;
  discountAmount: number = 0;
  generalSettings: any;
  constructor(
    public _productService: ProductService,
    private configService: MyApiService,
    public _shoppingCartService: ShoppingCartService,
    public _companyService: CompanyDetailService,
    public _generalSettingService: SoftwareGeneralSettingService,
    public _sharedService: SharedService
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
    this.branchId = this.configService.apiBranchId;
    this.companyId = this.configService.apiCompanyId;
  }

  ngOnInit(): void {
    this.GetAllProduct();
    this.GetCompany();
    this.GetSoftwareSettingByBranch();
  }
  GetCompany() {
    if (this.companyId) {
      this._companyService.GetCompanyById(this.companyId).subscribe(response => {
        if (response.statusCode === 200) {
          this._companyService.company = response.value;
        }
        else {
          this._companyService.company = null;
        }
      })
    }
  }
  GetSoftwareSettingByBranch() {
    if (this.branchId) {
      this._generalSettingService.GetByBranchId(this.branchId).subscribe((response) => {
        if (response.statusCode === 200) {
          this.generalSettings = response.value;
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
  trackByProduct(index: number, item: any) {
    return item.productDetailId; // or item.id
  }
  isProductLoading = false;
  pageNumber = 1;
  pageSize = 100;
  totalProducts = 0;
  searchText:any;
  onSearch(){
    if (this.branchId && this.companyId) {
      this.isProductLoading = true;
      const searchinput = this.searchText.trim();
      const model = {
        companyId: this.companyId,
        branchId: this.branchId,
        search: searchinput,
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
  }
  GetAllProduct() {
    if (this.branchId && this.companyId) {
      this.isProductLoading = true;
      const model = {
        companyId: this.companyId,
        branchId: this.branchId,
        search: '',
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
  selectInput(event: any) {
    setTimeout(() => {
      event.target.select();
    });
  }
  updateQty(product: any, event: any) {
    let qty = Number(event.target.value);

    // Allow selling exactly the available stock
    if (this.generalSettings?.isSalesWithNegativeStock && qty > product.stockQty) {
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
    const existing = this._shoppingCartService.cartItems.find(
      i => i.productDetailId === product.productDetailId
    );

    if (existing) {
      if (this.generalSettings?.isSalesWithNegativeStock && existing.quantity >= product.stockQty) {
        this._sharedService.showWarn("Stock limit exceeded");
        return;
      }
      existing.quantity++;
      product.quantity = existing.quantity;
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
        product.quantity = existing.quantity;
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
  addToCart(product: any) {
    this._shoppingCartService.addProductToCart(product);
  }
  onRemoveItem(productDetailId: any) {
    this._shoppingCartService.removeItemByProductDetailId(productDetailId);
  }
  // addToCart(product: any) {
  //     const existing = this._shoppingCartService.cartItems.find(i => i.productDetailId === product.productDetailId);
  //     if (existing) {
  //       existing.quantity++;
  //     } else {
  //       this._shoppingCartService.cartItems.push({
  //         productId: product.id,
  //         name: product.name,
  //         productDetailId:product.productDetailId,
  //         price:product.discount?this.onCalculateDiscountedPrice(product.sellingPrice,product.discount): product.sellingPrice,
  //         discountAmount:this.discountAmount,
  //         discountRate:product.discount,
  //         image: product.productImageUrl?? null,
  //         quantity: 1

  //       });
  //     }
  //       setTimeout(() => {
  //         this._shoppingCartService.addCart();

  //         this._shoppingCartService.showCart();
  //       }, 200);
  // }

  onCalculateDiscountedPrice(price: any, disocunt): number {
    this.discountAmount = price * (disocunt / 100) || 0;
    this.discountedPrice = (price - this.discountAmount) || 0;
    return this.discountedPrice;
  }
}
