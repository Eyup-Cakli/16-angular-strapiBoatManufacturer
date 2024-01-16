import { Routes } from '@angular/router';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { HullMaterialComponent } from 'app/core/components/admin/hull-material/hull-material.component';
import { TypeComponent } from 'app/core/components/admin/type/type.component';
import { ManufacturerComponent } from 'app/core/components/admin/manufacturer/manufacturer.component';
import { ManufacturerLogoComponent } from 'app/core/components/admin/manufacturer-logo/manufacturer-logo.component';
import { ModelComponent } from 'app/core/components/admin/model/model.component';




export const AdminLayoutRoutes: Routes = [
    
    { path: 'dashboard',      component: DashboardComponent},
    { path: 'hull-material',  component: HullMaterialComponent },
    { path: 'type', component: TypeComponent },
    { path: 'manufacturer-logo', component: ManufacturerLogoComponent },
    { path: 'manufacturer', component: ManufacturerComponent },
    { path: 'model', component: ModelComponent },
    { path: 'type', component: TypeComponent }  
];
