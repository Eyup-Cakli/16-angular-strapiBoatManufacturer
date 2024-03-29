import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Type } from '../models/type';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { AbstractResponseService } from '../../abstract/abstractResponseService';

@Injectable({
  providedIn: 'root'
})
export class TypeService extends AbstractResponseService<Type>{

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getTypeList(): Observable<Type[]> {
    return this.getDataList(`${environment.getApiUrl}/types`);
  }

  getTypeById(id: number) {
    return this.getDataById(`${environment.getApiUrl}/types`, id);
  }

  createType(type: Type): Observable<any> {
    const data = {
      data: {
        name: type.name
      }
    }
    return this.createData(`${environment.getApiUrl}/types`, data); 
  }

  updateType(type: Type): Observable<any> {
    const updateData = {
      data: {
        name: type.name
      }
    }
    return this.updateData(`${environment.getApiUrl}/types`, type.id, updateData );
  }

  deleteType(id: number) {
    return this.deleteData(`${environment.getApiUrl}/types`, id)
  }
}
