import { NgModule } from '@angular/core';

import { AntDesignModule } from 'src/app/antDesign.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatModule } from 'src/app/mat.module';
import { WebhostingRoutingModule } from './webhosting-routing.module';
import { OverviewWebhostingComponent } from './overview-webhosting/overview-webhosting.component';
import { StatisticalWebhostingComponent } from './statistical-webhosting/statistical-webhosting.component';
import { AddWebhostingComponent } from './add-webhosting/add-webhosting.component';
import { EditWebhostingComponent } from './edit-webhosting/edit-webhosting.component';

@NgModule({
  imports: [
    CommonModule,
    AntDesignModule,
    FormsModule,
    ReactiveFormsModule,
    MatModule,
    WebhostingRoutingModule,
  ],
  declarations: [
    OverviewWebhostingComponent,
    StatisticalWebhostingComponent,
    AddWebhostingComponent,
    EditWebhostingComponent,
  ],
  exports: [
    OverviewWebhostingComponent,
    StatisticalWebhostingComponent,
    AddWebhostingComponent,
    EditWebhostingComponent,
  ],
  providers: [
  ]
})
// tslint:disable-next-line: class-name
export class WebhostingModule { }
