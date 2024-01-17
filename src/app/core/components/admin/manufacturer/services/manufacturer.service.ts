import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "environments/environment";
import { Manufacturer } from "../models/manufacturer";
import { AbstractResponseService } from "../../abstract/abstractResponseService";
import { data } from "jquery";

@Injectable({
  providedIn: "root",
})
export class ManufacturerService extends AbstractResponseService<Manufacturer> {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getManufacturerList(): Observable<Manufacturer[]> {
    return this.getDataList(`${environment.getApiUrl}/manufacturers`);
  }

  getManufacturerLogoById(id: number) {
    return this.getDataById(`${environment.getApiUrl}/manufacturers`, id);
  }

  addManufacturer(manufacturer: Manufacturer): Observable<any> {
    const data = {
      data: {
        name: manufacturer.name,
        webSite: manufacturer.webSite,
        image: manufacturer.image
      }
    }
    return this.addData(`${environment.getApiUrl}/manufacturers`, data);
  }

  updateManufacturer(manufacturer: Manufacturer): Observable<any>{
    const updateData = {
      data: {
        name: manufacturer.name,
        webSite: manufacturer.webSite,
        image: manufacturer.image
      }
    }
    return this.updateData(`${environment.getApiUrl}/manufacturers`, manufacturer.id, updateData);
  }

  deleteManufacturer(id: number) {
    return this.deleteData(`${environment.getApiUrl}/manufacturers`, id)
  }
}
