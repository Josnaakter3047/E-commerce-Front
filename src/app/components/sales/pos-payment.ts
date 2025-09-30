export class PosPaymentModel{
    id?:string;
  branchId:string;
  address?:string;
  customerId:string;
  referenceNo:string;
  saleDate:Date;
  saleStatusId?:string;
  shipmentStatusId?:string;
  shippingDetails:string;
  shipmentAddress:string;
  deliveredTo:string;
  shippingCharge:number;
  note:string;
  createdById?:string;
  saleTaxAmount:string;
  discountAmount:string;
  invoiceNo?:string;
  totalAmount:number;
  updatedById?:string;
  //for sale items
  saleItems?:any[];

  //for payment
  paymentMethodId?:number;
  payableAmount?:number;
  totalPaidAmount?:number;
  //for payment details
  customerPayments?:any
}
