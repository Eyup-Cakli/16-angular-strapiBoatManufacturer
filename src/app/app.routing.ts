import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutComponent } from './core/components/app/layouts/admin-layout/admin-layout.component';
import { HullMaterialComponent } from './core/components/admin/hull-material/hull-material.component';
import { TypeComponent } from './core/components/admin/type/type.component';
import { ManufacturerLogoComponent } from './core/components/admin/manufacturer-logo/manufacturer-logo.component';
// import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
// import { LoginComponent } from './login/login.component';

const routes: Routes =[
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  }, 


  {
    path: '',
    component: AdminLayoutComponent,
    children: [{
      path: 'admin-layout',
      // loadChildren: './core/components/app/layouts/admin-layout/admin-layout.module#AdminLayoutModule'
      loadChildren: () => import('./core/modules/admin-layout.module').then(m => m.AdminLayoutModule)
    },{
      path: 'hull-material',
      component: HullMaterialComponent
    },{
      path: 'type',
      component: TypeComponent
    },{
      path: 'manufacturer-logo',
      component: ManufacturerLogoComponent
    }]
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
       useHash: true
    })
  ],
  exports: [
    [RouterModule]
  ],
})
export class AppRoutingModule { }
