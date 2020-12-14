import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceService } from 'src/app/core/services/invoice.service';
import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-data-of-sites',
  templateUrl: './data-of-sites.component.html',
  styleUrls: ['./data-of-sites.component.scss']
})
export class DataOfSitesComponent implements OnInit {
  loading: boolean;
  date = null;
  listOfDataAM: any = [];
  sumCountSiteCreated = 0;
  sumCountGolive = 0;
  sumCountGoliveinMonth = 0;
  sumCountDemoNotGoliveInMonth = 0;

  listOfDataDonvi: any = [];
  sumCountSiteCreatedDonvi = 0;
  sumCountGoliveDonvi = 0;
  sumCountGoliveinMonthDonvi = 0;
  sumCountDemoNotGoliveInMonthDonvi = 0;

  constructor(
    public dialog: MatDialog,
    private invoiceAPI: InvoiceService,
    private notification: NzNotificationService,
  ) { }

  ngOnInit(): void {
  }

  getData(result: Date) {
    this.loading = true;
    const month = moment(result).startOf('month').toISOString();
    const eomonth = moment(result).endOf('month').toISOString();
    const payload = { month, eomonth };

    this.invoiceAPI.dataOfSitesAM(payload).subscribe(
      (data) => {
        this.listOfDataAM = data;
        this.loading = false;
        this.sumCountSiteCreated = this.listOfDataAM.msg.reduce((sum, curr) => sum + curr.countSiteCreated, 0);
        this.sumCountGolive = this.listOfDataAM.msg.reduce((sum, curr) => sum + curr.countGolive, 0);
        this.sumCountGoliveinMonth = this.listOfDataAM.msg.reduce((sum, curr) => sum + curr.countGoliveinMonth, 0);
        this.sumCountDemoNotGoliveInMonth = this.listOfDataAM.msg.reduce((sum, curr) => sum + curr.countDemoNotGoliveInMonth, 0);

      }, (error) => {
        console.log(error);
        this.notification.create('error', 'Lỗi', 'Đã xảy ra lỗi, vui lòng thử lại!');
      });

    this.invoiceAPI.dataOfSitesDonVi(payload).subscribe(
      (data) => {
        this.listOfDataDonvi = data;
        this.loading = false;
        this.sumCountSiteCreatedDonvi = this.listOfDataDonvi.msg.reduce((sum, curr) => sum + curr.countSiteCreated, 0);
        this.sumCountGoliveDonvi = this.listOfDataDonvi.msg.reduce((sum, curr) => sum + curr.countGolive, 0);
        this.sumCountGoliveinMonthDonvi = this.listOfDataDonvi.msg.reduce((sum, curr) => sum + curr.countGoliveinMonth, 0);
        this.sumCountDemoNotGoliveInMonthDonvi = this.listOfDataDonvi.msg.reduce((sum, curr) => sum + curr.countDemoNotGoliveInMonth, 0);

      }, (error) => {
        console.log(error);
        this.notification.create('error', 'Lỗi', 'Đã xảy ra lỗi, vui lòng thử lại!');
      });
  }

}
