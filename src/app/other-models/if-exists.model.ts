export interface IfExistsModel{
  id?: string;
  name?: string;
  title?:string;
}
export interface IfExistPackageFeatureModel{
  id?: string;
  name?: string;
  packageId?:string;
}
export interface IfExistsByCategoryModel{
  id?: string;
  name?: string;
  categoryId?:string;
  companyId?:string;
}
export interface IfExistsByCompanyModel{
  id?: string;
  name?: string;
  companyId?:string;
}
export interface IfExistByBranchModel{
  id?: string;
  name?: string;
  branchId?:string;
}
export interface IfIMEIExistByBranchModel{
  id?: string;
  IMEI?: string;
  branchId?:string;
}
export interface IfExistPaymentMethodNameModel{
  id?: number;
  name?: string;
  branchId?:string;
}
