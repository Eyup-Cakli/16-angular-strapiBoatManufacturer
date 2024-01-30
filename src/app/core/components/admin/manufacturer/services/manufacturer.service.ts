import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "environments/environment";
import { Manufacturer } from "../models/manufacturer";
import { AbstractResponseService } from "../../abstract/abstractResponseService";
import { ManufacturerLogoService } from "../../manufacturer-logo/services/manufacturer-logo.service";
import { catchError, mergeMap } from "rxjs/operators";
import { ManufacturerLogo } from "../../manufacturer-logo/models/manufacturerLogo";

@Injectable({
  providedIn: "root",
})
export class ManufacturerService extends AbstractResponseService<Manufacturer> {
  constructor(httpClient: HttpClient, private manufacturerLogoService: ManufacturerLogoService) {
    super(httpClient);
  }

  getManufacturerList(): Observable<Manufacturer[]> {
    return this.getDataList(`${environment.getApiUrl}/manufacturers?populate=manufacturer_logo.image`);
  }

  getManufacturerLogoById(id: number) {
    return this.getDataById(`${environment.getApiUrl}/manufacturers?populate=manufacturer_logo.image`, id);
  }

  createManufacturer(manufacturer: Manufacturer): Observable<any> {
    const data = {
      data: {
        name: manufacturer.name,
        webSite: manufacturer.webSite,
        image: manufacturer.image
      }
    }
    return this.createData(`${environment.getApiUrl}/manufacturers`, data);
  }

  createManufacturerWithLogo(manufacturer: Manufacturer, file: File): Observable<any> {
    // İlk olarak manufacturer logo'sunu oluştur
    return this.manufacturerLogoService.createManufacturerLogo(file, {
      name: manufacturer.name,
      id: 0,
      image: undefined,
      url: "",
      attributes: undefined
    }).pipe(
      mergeMap((createdLogo: ManufacturerLogo) => {
        // Oluşturulan manufacturer logo'sunu kullanarak manufacturer'ı oluştur
        manufacturer.image = createdLogo.image; // Oluşturulan logo'nun resim adresini manufacturer nesnesine ekliyoruz
        return this.createManufacturer(manufacturer);
      }),
      catchError(error => {
        console.error('Error creating manufacturer with logo:', error);
        return Observable.throw('Error creating manufacturer with logo');
      })
    );
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
