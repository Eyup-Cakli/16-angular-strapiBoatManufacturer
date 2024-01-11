import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { apiToken } from 'environments/apiToken';
import { HullMaterial } from '../models/hull-material';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HullMaterialService {

  constructor(private readonly httpClient: HttpClient) {
  }

  getHullMaterialList(): Observable<HullMaterial[]>{
    return this.httpClient.get<HullMaterial[]>(environment.getApiUrl + "/hull-materials", { headers: apiToken }).pipe(
      map((res: any) => res.data)
    );
  }

  getHullMaterialById(id: number) {
    return this.httpClient.get<HullMaterial>(environment.getApiUrl + "/hull-materials/" + id, { headers: apiToken }).pipe(
      map((res: any) => res.data));
  }

  addHullMaterial(hullMaterail: HullMaterial): Observable<any> {
    const data = {
      data: {
        name: hullMaterail.name
      }
    }
    return this.httpClient.post(environment.getApiUrl + "/hull-materials", data, { responseType: 'text', headers: apiToken });
  }

  updateHullMaterial(hullMaterail: HullMaterial): Observable<any> {
    const updatedData = {
      data: {
        name: hullMaterail.name
      }
    }
    return this.httpClient.put(environment.getApiUrl + "/hull-materials/"+ hullMaterail.id, updatedData, { responseType: 'text', headers: apiToken });
  }

  deleteHullMaterial(id: number) {
    return this.httpClient.request('delete', environment.getApiUrl + "/hull-materials/" + id ,{ headers: apiToken });
  }
}
