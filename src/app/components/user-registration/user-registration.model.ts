export interface UserRegistrationModel
{
  id?:string;
  name:string;
  companyOwnerName:string;
  phoneNumber:string;
  email:string,
  address:string;
  language:string;
  currencyId:string;
  headerTitle:string;
  footerTitle:string;
  nationalIdNumber:string;
  website:string;
  startDate:Date;

  //for user create
  userName?:string;
  password?:string;
  entryById?:string;
  //for file uplaoded
  logoUrl?:string;
  companyCertificateUrl?:string;
}
