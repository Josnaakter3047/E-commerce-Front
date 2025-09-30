export interface AddApplicationUserModel {
  name: string;
  userName:string;
  email: string;
  password?: string;
  phoneNumber: string;
  roleId:string;
  branchId:string;
  companyId:string;
  entryById:string;
  updatedById:string;
  countryCode:string;
  isSystemAdmin:boolean;
  salesCommission:number;
  maxSaleDiscount:number;
  language:string;
  isSrCustomer?:boolean;
}
