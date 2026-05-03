export interface AuthModel {
  id:string;
  branchId:string;
  companyId:string;
  fullName: string;
  roles: string[];
  email: string;
  phoneNumber:string;
  token: string;
  tokenExpireTime: Date;
  isActive?: boolean;
  isSystemAdmin?:boolean;
  isRestrarant?:boolean;
  isAddPaxNumber?:boolean;
  isDemo?:boolean;
  refreshToken: string;
  refreshTokenExpireTime: Date;
}
