import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Dauso } from 'src/app/core/models/dauso';
import { DausoService } from 'src/app/core/services/dauso.service';
import { ExcelToFileService } from 'src/app/core/services/exceltofile.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-edit-dauso',
  templateUrl: './edit-dauso.component.html',
  styleUrls: ['./edit-dauso.component.scss']
})
export class EditDausoComponent implements OnInit {
  selectedId: string;
  selectedData: Dauso;
  listOfUser: any = [];
  dausoForm: FormGroup;

  registrationDate: Date;
  cancelDate: Date;
  isSpinning = false;
  constructor(
    private excelToFile: ExcelToFileService,
    private notification: NzNotificationService,
    private modal: NzModalRef,
    private dausoAPI: DausoService,
    private userAPI: UserService,
  ) {
    this.isSpinning = true;
    setTimeout(() => {
      this.dausoAPI.GetDauso(this.selectedId).subscribe(
        (data) => {
          this.isSpinning = false;
          this.selectedData = data;
          this.dausoForm = new FormGroup({
            loaiDauso: new FormControl(data.loaiDauso),
            dauso: new FormControl(data.dauso),
            unitCode: new FormControl(data.unitCode),
            userName: new FormControl(data.userName),
            comTaxCode: new FormControl(data.comTaxCode),
            comName: new FormControl(data.comName),
            registrationDate: new FormControl(data.registrationDate),
            cancelDate: new FormControl(data.cancelDate),
            remark: new FormControl(data.remark),
          });
        }
      );
    },1000);
  }

  ngOnInit(): void {
    this.getAllUsersActivated();
    this.setForm();
    // setTimeout(() => {
    //   this.getDausobyId();
    //   this.dausoForm.value.unitCode = this.selectedData.unitCode;
    //   this.dausoForm.value.userName = this.selectedData.userName;
    // }, 1000);
  }

  setForm() {
    this.dausoForm = new FormGroup({
      loaiDauso: new FormControl(),
      dauso: new FormControl(),
      unitCode: new FormControl(),
      userName: new FormControl(),
      comTaxCode: new FormControl(),
      comName: new FormControl(),
      registrationDate: new FormControl(Date()),
      cancelDate: new FormControl(Date()),
      remark: new FormControl(),
    });
  }

  getAllUsersActivated() {
    this.userAPI.GetUsersActivated().subscribe(
      (data) => {
        this.listOfUser = data;
      }
    );
  }

  getDausobyId() {
    this.dausoAPI.GetDauso(this.selectedId).subscribe(
      (data) => {
        this.selectedData = data;
      }
    );
  }

  close() {
    this.modal.destroy();
  }

  submitInvoiceForm() {

  }

}
