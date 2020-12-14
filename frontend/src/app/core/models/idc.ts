export interface IDC {
  _id: string;
  loaiIDC: string;
  am: {
    unitCode: string;
    userName: string;
  };
  comTaxCode: string;
  comName: string;
  registrationDate: Date;
  extendDate: Object;
  cancelDate: Date;
  remark: string;
}
