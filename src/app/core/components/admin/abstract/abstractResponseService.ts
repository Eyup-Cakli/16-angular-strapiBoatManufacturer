import { HttpClient } from "@angular/common/http";
import { apiToken } from "environments/apiToken";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export abstract class AbstractResponseService<T> {
    constructor(private httpClient: HttpClient) {}

    getDataList(apiUrl: string): Observable<T[]> {
        return this.httpClient.get<T[]>(apiUrl+"?populate=*", { headers: apiToken }).pipe(
            map((res: any) => res.data)
        )
    }

    getDataById(apiUrl: string, id:number): Observable<T> {
        return this.httpClient.get<T>(`${apiUrl}/${id}?populate=*`, { headers: apiToken }).pipe(
            map((res: any) => res.data)
        )
    }

    addData(apiUrl: string, data: any): Observable<any> {
        return this.httpClient.post(apiUrl, data, { responseType: 'text', headers: apiToken })
    }

    updateData(apiUrl: string, id: number, data: any): Observable<any> {
        return this.httpClient.put(`${apiUrl}/${id}`, data, { responseType: 'text', headers: apiToken })
    }

    deleteData(apiUrl: string, id:number): Observable<any> {
        return this.httpClient.delete(`${apiUrl}/${id}`, { headers: apiToken })
    }
}