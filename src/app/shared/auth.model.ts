export interface AuthModel {
  id:string;
  branchId:string;
  companyId:string;
  fullName: string;
  roles: string[];
  email: string;
  phoneNumber:string;
  token: string;
  //refreshToken: string;
  tokenExpireTime: Date;
  //refreshTokenExpireTime: Date,
  isActive?: boolean;
  isSystemAdmin?:boolean;
}
