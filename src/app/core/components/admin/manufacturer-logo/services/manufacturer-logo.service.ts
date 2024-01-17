import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { ManufacturerLogo } from '../models/manufacturerLogo';
import { AbstractResponseService } from '../../abstract/abstractResponseService';

@Injectable({
  providedIn: 'root'
})
export class ManufacturerLogoService extends AbstractResponseService<ManufacturerLogo>{

  constructor(httpClient: HttpClient) { 
    super(httpClient);
  }

  getManufacturerLogoList(): Observable<ManufacturerLogo[]>{
    return this.getDataList(`${environment.getApiUrl}/manufacturer-logos`);
  }

  getManufacturerLogoById(id: number) {
    return this.getDataById(`${environment.getApiUrl}/manufacturer-logos`, id);
  }

  addManufacturerLogo(manufacturerLogo: ManufacturerLogo): Observable<any>{
    const data = {
      data: {

      }
    }
    return this.addData(`${environment.getApiUrl}/manufacturer-logos`, data);
  }

  updateManufacturerLogo(manufacturerLogo: ManufacturerLogo): Observable<any> {
    const updateData = {
      data: {

      }
    }
    return this.updateData(`${environment.getApiUrl}/manufacturer-logos`, manufacturerLogo.id, updateData);
  }

  deleteManufacturerLogo(id: number) {
    return this.deleteData(`${environment.getApiUrl}/manufacturer-logos`, id);
  }
}
