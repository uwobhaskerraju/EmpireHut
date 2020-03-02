import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment.prod'
//https://www.techiediaries.com/angular-interceptors-mock-http-requests-example/
//https://scotch.io/@vigneshsithirai/angular-6-7-http-client-interceptor-with-error-handling
//https://github.com/vigneshsithirai/Angular-Interceptor/blob/master/src/app/interceptor/httpconfig.interceptor.ts
@Injectable()
export class MockHttpCalIInterceptor implements HttpInterceptor {
    constructor(private injector: Injector) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        try {
            console.log('Intercepted request' + request.url);
            var req = null;

            var body = request.body
            //console.log(body)
            if (body != null || body != undefined) {
                const entries = Object.keys(body)
               // console.log(entries)
               // console.log(entries.length)
                for (let i = 0; i < entries.length; i++) {
                    //console.log(request.body[entries[i]])
                   // console.log(Object.values(body))
                    request.body[entries[i]] = CryptoJS.AES.encrypt(Object.values(body)[i].toString(), environment.key).toString()
                    //console.log(i)
                }
            }

             console.log(request.body)
            if (request.url.toLowerCase().toString().includes("open")) {
                if (request.url.toLowerCase().toString().includes("open/val")) {
                    req = request.clone({
                        headers: new HttpHeaders(
                            {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                                // 'Access-Control-Allow-Headers': 'Content-Type',
                                'authorization': 'Bearer ' + localStorage.getItem('ACCESS_TOKEN')
                            }
                        )
                        // , body: { body: CryptoJS.AES.encrypt(req.body, environment.key).toString() }
                    });
                }
                else {
                    req = request.clone({
                        headers: new HttpHeaders(
                            {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                                //'Access-Control-Allow-Headers': 'Content-Type'
                            }
                        )
                        // , body: { body: CryptoJS.AES.encrypt(request.body, environment.key) }
                    });
                }

            }
            if (request.url.toLowerCase().toString().includes("user")
                || request.url.toLowerCase().toString().includes("admin")) {
                req = request.clone({
                    headers: new HttpHeaders(
                        {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            //'Access-Control-Allow-Headers': 'Content-Type',
                            'authorization': 'Bearer ' + localStorage.getItem('ACCESS_TOKEN')
                        }
                    )
                });
            }

            // console.log(req);
            return next.handle(req).pipe(
                map((event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                        // console.log('event--->>>', event);
                        //    var body = event["body"]
                        //    //console.log(body)
                        //    if (body != null || body != undefined) {
                        //        const entries = Object.keys(body)
                        //        for (let i = 0; i < entries.length; i++) {
                        //            if (entries[i] != "statusCode") {
                        //                body[entries[i]] = CryptoJS.AES.decrypt(Object.values(body)[i], environment.key).toString(CryptoJS.enc.Utf8)
                        //            }
                        //        }
                        //    }
                        //     console.log(event["body"])
                    }
                    return event;
                }),
                catchError((error: HttpErrorResponse) => {
                    let data = {};
                    data = {
                        reason: error && error.error && error.error.reason ? error.error.reason : '',
                        status: error.status
                    };
                    console.log(data)
                    return throwError(error);//url,message
                })

            );
        } catch (error) {
            console.log("interceptor error : " + error)
        }

    }
}