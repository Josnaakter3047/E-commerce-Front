import { Component, OnInit } from '@angular/core';
import { MyApiService } from 'src/app/shared/my-api.service';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { CategoryService } from 'src/app/components/application-services/item-category.service';
import { BrandService } from 'src/app/components/application-services/item-brand.service';
import { CompanyDetailService } from 'src/app/components/application-services/company-detail.service';
import { ProductService } from 'src/app/components/product/product.service';
import { SoftwareGeneralSettingService } from 'src/app/components/software-general-settings/general-settings.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-all-product-bycategory',
  templateUrl: './all-product-bycategory.component.html',
  styleUrls: ['./all-product-bycategory.component.css']
})
export class AllProductBycategoryComponent implements OnInit {
  productList: any[] = [];
  allProducts: any[] = [];
  baseUrl: string = '';
  visibleCart = false;
  branchId:any;
  companyId:any;
  discountedPrice:number = 0;
  discountAmount:number = 0;
  typeId:any;
  typeName:any;
  categories:any;
  brands:any;
  isProductLoading = false;
  generalSettings: any;
  constructor(
    public _productService:ProductService,
    public _categoryService:CategoryService,
    public _brandService:BrandService,
    private configService: MyApiService,
    public _shoppingCartService:ShoppingCartService,
    private _route:ActivatedRoute,
    public _companyService:CompanyDetailService,
    public _generalSettingService: SoftwareGeneralSettingService,
    private _sharedService:SharedService
  ) { 
    this.baseUrl = this.configService.apiBaseUrl;
    this.branchId = this.configService.apiBranchId;
    this.companyId = this.configService.apiCompanyId;
  }
  
  ngOnInit(): void {
    this._route.paramMap.subscribe(params => {
      const type = params.get('type');
      this.typeId = params.get('id')!;
      this.typeName = params.get('name')!;
    });
    this.GetFeaturedOptions();
    this.GetAllCategories();
    this.GetAllBrands();
    this.GetCompany();
     this.GetSoftwareSettingByBranch();
  }
   trackByProduct(index: number, item: any) {
    return item.productDetailId; // or item.id
  }
   GetCompany(){
    if(this.companyId){
      this._companyService.GetCompanyById(this.companyId).subscribe(response=>{
        if(response.statusCode === 200){
          this._companyService.company = response.value;
        }
        else{
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
  GetAllProductByCategoryId(cagoryId:any){
    if(this.companyId && cagoryId){
      const model = {
        companyId:this.companyId,
        branchId:this.branchId,
        brandId:null,
        categoryId:cagoryId
      }
      this._productService.GetAllProductForCustomerShopping(model).subscribe({
        next: (response) => {
          if (response.statusCode === 200) {
            this._productService.productList  = response.value.map(product => ({
              ...product,
              discountedPrice: this.onCalculateDiscountedPrice(
                product.sellingPrice,
                product.discount
              ),
              quantity: this.getCartQty(product.productDetailId)
            }));

            this.totalProducts = response.totalRecords || 0;

          } else {
            this._productService.productList  = [];
            this.totalProducts = 0;
          }

          this.isProductLoading = false;
        },

        error: (error) => {
          console.error("Error loading products:", error);
          this._productService.productList  = [];
          this.totalProducts = 0;

          this.isProductLoading = false;
        }
      });
    }
    else{
      this._productService.productList  = [];
      this.totalProducts = 0;
      this.isProductLoading = false;
      console.log("Company not found");
    }
  }
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
  GetAllProductByBrandId(brandId:any){
     const model = {
        companyId:this.companyId,
        branchId:this.branchId,
        brandId:brandId,
        categoryId:null
      }
    if(this.companyId){
     this._productService.GetAllProductForCustomerShopping(model).subscribe({
        next: (response) => {
          if (response.statusCode === 200) {
            this._productService.productList  = response.value.map(product => ({
              ...product,
              discountedPrice: this.onCalculateDiscountedPrice(
                product.sellingPrice,
                product.discount
              ),
              quantity: this.getCartQty(product.productDetailId)
            }));

            this.totalProducts = response.totalRecords || 0;

          } else {
            this._productService.productList  = [];
            this.totalProducts = 0;
          }

          this.isProductLoading = false;
        },

        error: (error) => {
          console.error("Error loading products:", error);
          this._productService.productList  = [];
          this.totalProducts = 0;

          this.isProductLoading = false;
        }
      });
    }
    else{
      this._productService.productList = null;
      this.isProductLoading = false;
       this.totalProducts = 0;
      console.log("Company not found");
    }
  }
  GetAllCategories(){
    if(this.companyId){
      this._categoryService.GetAllByCompanyId(this.companyId).subscribe(response=>{
      if(response.statusCode === 200){
        this.categories = response.value;
       
        //console.log(response.value);
      }
      else{
        this.categories = null;
      }
    })
    }
    else{
      this.categories = null;
      console.log("Company not found");
    }
  }
  GetAllBrands(){
    if(this.companyId){
      this._brandService.GetAllByCompanyId(this.companyId).subscribe(response=>{
      if(response.statusCode === 200){
        this.brands = response.value;
       
        //console.log(response.value);
      }
      else{
        this.brands = null;
      }
    })
    }
    else{
      this.brands = null;
      console.log("Company not found");
    }
  }
  addToCart(product: any) {
    this._shoppingCartService.addProductToCart(product);
    //this._shoppingCartService.showCart();
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
  pageNumber = 1;
  pageSize = 100;
  totalProducts = 0;
  searchText:any;
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
  selectedFeature: string = 'Featured';
  GetFeaturedOptions() {
      let menuItems: MenuItem[];
      menuItems = [
  
        {
          label: 'Featured', styleClass: this.selectedFeature === 'Featured' ? 'active' : '',
          command: () => this.setFeature('Featured')
        },
        {
          label: 'Best Selling', styleClass: this.selectedFeature === 'Best Selling' ? 'active' : '',
          command: () => this.setFeature('Best Selling')
        },
        {
          label: 'Alphabetically A-Z', styleClass: this.selectedFeature === 'Alphabetically A-Z' ? 'active' : '',
          command: () => this.setFeature('Alphabetically A-Z')
        },
        {
          label: 'Alphabetically Z-A', styleClass: this.selectedFeature === 'Alphabetically Z-A' ? 'active' : '',
          command: () => this.setFeature('Alphabetically Z-A')
        },
        {
          label: 'Price Low To Hight', styleClass: this.selectedFeature === 'Price Low To Hight' ? 'active' : '',
          command: () => this.setFeature('Price Low To Hight')
        },
        {
          label: 'Price Hight To Low', styleClass: this.selectedFeature === 'Price Hight To Low' ? 'active' : '',
          command: () => this.setFeature('Price Hight To Low')
        },
        {
          label: 'Date Old To New', styleClass: this.selectedFeature === 'Date Old To New' ? 'active' : '',
          command: () => this.setFeature('Date Old To New')
        },
        {
          label: 'Date New To Old', styleClass: this.selectedFeature === 'Date New To Old' ? 'active' : '',
          command: () => this.setFeature('Date New To Old')
        },
       
      ];
  
      return menuItems
  }
  setFeature(label: string) {
   this.selectedFeature = label;
   this.GetFeaturedOptions();
  }
  selectedLayout: string = '||||';
  viewMode: string = 'grid';

  setLayout(layout: string) {
    if (layout === 'list') {
      this.viewMode = 'list'; 
      this.selectedLayout = layout;  // switch to list mode
    } else {
      this.viewMode = 'grid';   // back to grid
      this.selectedLayout = layout;
    }
  }

 //filter with price
 priceRange: number[] = [0, 5000];
 minInput: number = 0;
 maxInput: number = 5000;
 inStockOnly: boolean = false;

// When min input changes
private filterTimeout: any;

// filter with in stock
filterProductsByPriceAndStock() {
  const [min, max] = this.priceRange;
  let isStockAvailable = this.inStockOnly;
  if(isStockAvailable){
    this.allProducts = this._productService.productList;
  this._productService.productList = this.allProducts.filter(p => {
    const price = this.onCalculateDiscountedPrice(p.sellingPrice, p.discount);
    const withinPrice = price >= min && price <= max;
    if(p.stockQty > 0){
      isStockAvailable = true;
    }
    else{
      isStockAvailable = false;
    }
    const inStock = !this.inStockOnly || isStockAvailable === true;
    return withinPrice && inStock;
  });
  }
  else{
     this.allProducts = this._productService.productList;
  this._productService.productList = this.allProducts.filter(p => {
    const price = this.onCalculateDiscountedPrice(p.sellingPrice, p.discount);
    const withinPrice = price >= min && price <= max;
    if(p.stockQty > 0){
      isStockAvailable = true;
    }
    else{
      isStockAvailable = false;
    }
    
    return withinPrice && this.inStockOnly;
  });
  }
 
}


onMinInputChange(value: any) {
  clearTimeout(this.filterTimeout);
  if (value > this.maxInput) value = this.maxInput;
  if (value < 0) value = 0;
  this.minInput = value;
  this.priceRange = [this.minInput, this.maxInput]; // assign new array
   this.filterTimeout = setTimeout(() => this.filterProductsByPriceAndStock(), 200);
}

// When max input changes
onMaxInputChange(value: any) {
  clearTimeout(this.filterTimeout);
  if (value < this.minInput) value = this.minInput;
  if (value > 5000) value = 5000;
  this.maxInput = value;
  this.priceRange = [this.minInput, this.maxInput]; // assign new array
   this.filterTimeout = setTimeout(() => this.filterProductsByPriceAndStock(), 200);
}


}
