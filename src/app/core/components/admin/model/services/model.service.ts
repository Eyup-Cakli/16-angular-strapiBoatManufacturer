import { Injectable } from '@angular/core';
import { AbstractResponseService } from '../../abstract/abstractResponseService';
import { Model } from '../models/model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModelService extends AbstractResponseService<Model> {

  constructor(httpClient: HttpClient) { 
    super(httpClient)
  }

  getModelList(): Observable<Model[]> {
    return this.getDataList(`${environment.getApiUrl}/models?populate=*`);
  }

  getModelById(id: number) {
    return this.getDataById(`${environment.getApiUrl}/models`, id, "?populate=*");
  }

  createModel(model: Model): Observable<any> {
    const data = {
      data: {
        name: model.name,
        lengthMeter: model.lengthMeter,
        beamMeter: model.beamMeter,
        draftMeter: model.draftMeter,
        manufacturer: null,
        type: null,
        hull_material: null
      }
    }
    return this.createData(`${environment.getApiUrl}/models`, data);
  }

  updateModel(model: Model): Observable<any> {
    const updateData = {
      data: {
        name: model.name,
        lengthMeter: model.lengthMeter,
        beamMeter: model.beamMeter,
        draftMeter: model.draftMeter,
        manufacturer: null,
        type: null,
        hull_material: null
      }
    }
    return this.updateData(`${environment.getApiUrl}/models`, model.id, updateData)
  }

  deleteModel(id: number) {
    return this.deleteData(`${environment.getApiUrl}/models`, id);
  }
}