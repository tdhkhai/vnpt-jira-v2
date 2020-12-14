export interface Invoice {
  status: string;
  monthAction: Date;
  unitCode: string;
  userName: string;
  comTaxCode: string;
  comName: string;
  dateDemo: Date;
  dateGolive: Date;
  dateDelete: Date;
  dateExtend: Date;
  amount: number;
  income: number;
  incomeDate: Date;
  typeOfIncome: string;
}
