import { Routes } from '@angular/router';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { HullMaterialComponent } from 'app/core/components/admin/hull-material/hull-material.component';




export const AdminLayoutRoutes: Routes = [
    
    { path: 'dashboard',      component: DashboardComponent},
    { path: 'hull-material',  component: HullMaterialComponent }
];
