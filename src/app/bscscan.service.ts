import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BscscanService {
  private apiKey: string = 'AT9EP52K3WUJCJP2QTHYEACWNJF8SPHASW';
  private apiUrl: string = 'https://api-testnet.bscscan.com/api';

  constructor(private http: HttpClient) { }

  obtenerHistorialTransacciones(walletAddress: string): Observable<any> {
    const url = `${this.apiUrl}?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&sort=asc&apikey=${this.apiKey}`;
    return this.http.get<any>(url);
  }
}
