export interface AddUserModel {
  name: string,
  email: string,
  password?: string,
  phoneNumber: string,
  roleName:string,
  branchId:string;
  companyId:string;
  entryById:string;
  updatedById:string;
  countryCode:string;
  isOwnBranch:boolean;
  language:string;
}
