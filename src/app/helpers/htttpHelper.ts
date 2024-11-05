import { HttpParams } from '@angular/common/http';

export function convertToHttpParams(params: Record<string, any>): HttpParams {
  let httpParams = new HttpParams();
  for (const key in params) {
    if (params.hasOwnProperty(key) && params[key] !== undefined && params[key] !== null) {
      httpParams = httpParams.set(key, params[key].toString());
    }
  }
  return httpParams;
}
