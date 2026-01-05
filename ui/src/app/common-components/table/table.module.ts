import { NgModule } from '@angular/core';
import { TableTbodyComponent } from './table-tbody/table-tbody.component';
import { TableTheadComponent } from './table-thead/table-thead.component';
import { TableThComponent } from './table-th/table-th.component';
import { TableTdComponent } from './table-td/table-td.component';



@NgModule({
  declarations: [],
  imports: [
    TableTbodyComponent,
    TableTheadComponent,
    TableThComponent,
    TableTdComponent
  ],
  exports: [
    TableTbodyComponent,
    TableTheadComponent,
    TableThComponent,
    TableTdComponent
  ],
})
export class TableModule { }
