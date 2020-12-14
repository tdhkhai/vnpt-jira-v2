import { Component, OnInit } from '@angular/core';
import { ExcelToFileService } from 'src/app/core/services/exceltofile.service';
import { UploadComponent } from '../../shared/upload/upload.component';
import { AddStatisticalInvoiceComponent } from '../add-statistical-invoice/add-statistical-invoice.component';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { InvoiceService } from 'src/app/core/services/invoice.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { EditStaticticalInvoiceComponent } from '../edit-statictical-invoice/edit-statictical-invoice.component';

@Component({
  selector: 'app-statistical-invoice',
  templateUrl: './statistical-invoice.component.html',
  styleUrls: ['./statistical-invoice.component.scss']
})
export class StatisticalInvoiceComponent implements OnInit {
  pageIndex = 1;
  pageSize = 10;
  total = 0;
  infoSite1: string;
  infoSite2: string;
  infoSite3: string;
  fileUpload: File;
  listOfData: any = [];
  loading: boolean;
  isVisibleInfoSite = false;
  selectedData: any;
  constructor(
    private excelToFile: ExcelToFileService,
    private notification: NzNotificationService,
    private invoiceAPI: InvoiceService,
    private modalService: NzModalService,
  ) { this.getAllInvoices(); }

  ngOnInit(): void {

  }

  changePageIndex(pageIndex) {
    this.pageIndex = pageIndex;
    this.getAllInvoices();
  }
  changePageSize(pageSize) {
    this.pageSize = pageSize;
    this.getAllInvoices();
  }

  getAllInvoices() {
    this.loading = true;
    this.invoiceAPI.GetInvoices().subscribe(
      (data) => {
        // this.listOfData.push(data);
        this.listOfData = data;
        console.log(typeof this.listOfData);

        this.total = this.listOfData.lenght;
        this.loading = false;
      }
    );
  }

  exportExcel() {
    this.excelToFile.exportExcel(this.listOfData, 'statistical_invoice');
  }

  importExcel() {
    const modal = this.modalService.create({
      nzTitle: 'Import dữ liệu',
      nzContent: UploadComponent,
      nzWidth: 400,
      nzBodyStyle: {
        height: '70px'
      },
    });

    modal.afterClose.subscribe(result => {
      this.handleImport(result);
    });

  }

  handleImport(file: File): any {
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(file[0]);
    reader.onload = (e: any) => {
      /* create workbook */
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary', cellDates: true, dateNF: 'mm/dd/yyyy' });

      /* selected the first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      // tslint:disable-next-line: max-line-length
      const data = XLSX.utils.sheet_to_json(ws, { raw: false });
      // to get 2d array pass 2nd parameter as object {header: 1}
      // console.log(data); // Data will be logged in array format containing objects
      // console.log(typeof(data));
      this.importDataImport(data);
    };
  }

  importDataImport(data: any) {
    data.forEach(element => {

      element.incomeDate = moment(element.incomeDate).toISOString();
      element.comName = element.comName.toUpperCase();

      this.invoiceAPI.AddInvoice(element).subscribe(res => {
        this.getAllInvoices();
        this.notification.create('success', 'Thành công', 'Bạn đã lưu thành công!');
      }, (error) => {
        console.log(error);
        this.notification.create('error', 'Lỗi', 'Đã xảy ra lỗi, vui lòng thử lại!');
      });
    });
  }

  showCreate() {
    const modal = this.modalService.create({
      nzTitle: 'KHÁCH HÀNG HÓA ĐƠN ĐIỆN TỬ MỚI',
      nzContent: AddStatisticalInvoiceComponent,
      nzWidth: 800,
      nzBodyStyle: {
        height: '640px'
      },
    });

    modal.afterClose.subscribe(res => {
      this.getAllInvoices();
    });
  }

  confirmDelete(data) {

    this.invoiceAPI.DeleteInvoice(data).subscribe((res) => {
      this.getAllInvoices();
      this.notification.create('success', 'Thành công', 'Bạn đã xóa thành công!');
    }, (error) => {
      console.log(error);
      this.notification.create('error', 'Lỗi', 'Đã xảy ra lỗi, vui lòng thử lại!');
    });
  }

  editModal(data: any) {
    const modal = this.modalService.create({
      nzTitle: 'CHỈNH SỬA THÔNG TIN KHÁCH HÀNG HÓA ĐƠN ĐIỆN TỬ',
      nzContent: EditStaticticalInvoiceComponent,
      nzWidth: 800,
      nzBodyStyle: {
        height: '640px'
      },
    });

    modal.componentInstance.selectedId = data;

    modal.afterClose.subscribe(res => {
      this.getAllInvoices();
    });
  }

  cancel() { }

  closeModal() { this.isVisibleInfoSite = false; }

  showInfoSite(data) {
    this.isVisibleInfoSite = true;
    this.selectedData = data;
  }

  infoSiteChange(status: string) {
    if (status === 'Demo') {
      this.infoSite1 = '[DEMO] ' + this.selectedData.comName;
      this.infoSite2 = this.selectedData.comTaxCode + '-democadmin.vnpt-invoice.com.vn/';
      this.infoSite3 = this.selectedData.comTaxCode + '_admin_demo';
    } else {
      this.infoSite1 = '[CHÍNH THỨC] ' + this.selectedData.comName;
      this.infoSite2 = this.selectedData.comTaxCode + '-cadmin.vnpt-invoice.com.vn/';
      this.infoSite3 = this.selectedData.comTaxCode + '_admin';
    }
  }

}
