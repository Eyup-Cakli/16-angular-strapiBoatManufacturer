import { Routes } from '@angular/router';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { HullMaterialComponent } from 'app/core/components/admin/hull-material/hull-material.component';
import { TypeComponent } from 'app/core/components/admin/type/type.component';




export const AdminLayoutRoutes: Routes = [
    
    { path: 'dashboard',      component: DashboardComponent},
    { path: 'hull-material',  component: HullMaterialComponent },
    { path: 'type', component: TypeComponent }

];
