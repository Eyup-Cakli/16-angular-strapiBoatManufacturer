import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { HullMaterial } from '../models/hull-material';
import { AbstractResponseService } from '../../abstract/abstractResponseService';

@Injectable({
  providedIn: 'root'
})
export class HullMaterialService extends AbstractResponseService<HullMaterial> {

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getHullMaterialList(): Observable<HullMaterial[]>{
    return this.getDataList(`${environment.getApiUrl}/hull-materials`);
  }

  getHullMaterialById(id: number) {
    return this.getDataById(`${environment.getApiUrl}/hull-materials`,id);
  }

  createHullMaterial(hullMaterail: HullMaterial): Observable<any> {
    const data = {
      data: {
        name: hullMaterail.name
      }
    }
    return this.createData(`${environment.getApiUrl}/hull-materials`, data);
  }

  updateHullMaterial(hullMaterail: HullMaterial): Observable<any> {
    const updatedData = {
      data: {
        name: hullMaterail.name
      }
    }
    return this.updateData(`${environment.getApiUrl}/hull-materials`, hullMaterail.id, updatedData);
  }

  deleteHullMaterial(id: number) {
    return this.deleteData(`${environment.getApiUrl}/hull-materials`, id);
  }
}
