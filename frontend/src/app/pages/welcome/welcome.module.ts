import { NgModule } from '@angular/core';

import { WelcomeRoutingModule } from './welcome-routing.module';

import { WelcomeComponent } from './welcome.component';
import { AntDesignModule } from 'src/app/antDesign.module';


@NgModule({
  imports: [WelcomeRoutingModule, AntDesignModule],
  declarations: [WelcomeComponent],
  exports: [WelcomeComponent]
})
export class WelcomeModule { }
