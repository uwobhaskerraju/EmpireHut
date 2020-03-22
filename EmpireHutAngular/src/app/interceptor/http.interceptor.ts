import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment.prod'
//https://www.techiediaries.com/angular-interceptors-mock-http-requests-example/
//https://scotch.io/@vigneshsithirai/angular-6-7-http-client-interceptor-with-error-handling
//https://github.com/vigneshsithirai/Angular-Interceptor/blob/master/src/app/interceptor/httpconfig.interceptor.ts
//https://medium.com/@rubenvermeulen/running-angular-cli-over-https-with-a-trusted-certificate-4a0d5f92747a
declare var M: any;
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

            //console.log(request.url.toLowerCase().toString())
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
                    //console.log(req)
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

                if(request.url.toLowerCase().toString().includes("create/ticket")){
                   // console.log("inside")
                    req = request.clone({
                        headers: new HttpHeaders(
                            {
                               // 'Content-Type': 'multipart/form-data',
                               'Accept': '*/*',
                               'authorization': 'Bearer ' + localStorage.getItem('ACCESS_TOKEN')
                            }
                        )
                        // , body: { body: CryptoJS.AES.encrypt(request.body, environment.key) }
                    });
                }
            }

            function singleObjectDecrypt(resp) {
                var keys = Object.keys(resp)
                //console.log(keys)
                for (let j = 0; j < keys.length; j++) {
                    //console.log(keys[j])
                    //console.log(resp[u][keys[j]])//value
                    if (typeof (resp[keys[j]]) == "object") {
                        if (resp[keys[j]].length == 1) {
                            singleObjectDecrypt(resp[keys[j]][0])
                        }

                    }
                    else {
                        resp[keys[j]] = CryptoJS.AES.decrypt(resp[keys[j]], environment.key).toString(CryptoJS.enc.Utf8)
                        if (resp[keys[j]] == "true" || resp[keys[j]] == "false") {
                            resp[keys[j]] = JSON.parse(resp[keys[j]].toString())
                        }
                    }

                }
                return resp
            }
            function multiObjectDecrypt() {

            }
            // console.log(req);
            return next.handle(req).pipe(
                map((event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                        //console.log('event--->>>', event);
                        var body = event["body"]
                        console.log(event["body"])
                        if (body != null || body != undefined) {
                            const entries = Object.keys(body)
                            for (let i = 0; i < entries.length; i++) {
                                //console.log(typeof (body[entries[i]]))
                                if (entries[i] != "statusCode") {
                                    if (typeof (body[entries[i]]) == "object") {
                                        var resp = body[entries[i]]
                                        if (resp.length == 1) {
                                            resp = body[entries[i]][0]
                                            //console.log(resp)

                                            // var keys = Object.keys(resp)
                                            // //console.log(keys)
                                            // for (let j = 0; j < keys.length; j++) {
                                            //     //console.log(keys[j])
                                            //     //console.log(resp[u][keys[j]])//value
                                            //     resp[keys[j]] = CryptoJS.AES.decrypt(resp[keys[j]], environment.key).toString(CryptoJS.enc.Utf8)
                                            //     if (resp[keys[j]] == "true" || resp[keys[j]] == "false") {
                                            //         resp[keys[j]] = JSON.parse(resp[keys[j]].toString())
                                            //     }
                                            // }
                                            body[entries[i]] = singleObjectDecrypt(resp)
                                        }
                                        else {
                                            console.log(resp)
                                            for (var u = 0; u < resp.length; u++) {
                                                //console.log(resp[u])
                                                // var keys = Object.keys(resp[u])
                                                // //console.log(keys)
                                                // for (let j = 0; j < keys.length; j++) {
                                                //     //console.log(keys[j])
                                                //     //console.log(resp[u][keys[j]])//value
                                                //     resp[u][keys[j]] = CryptoJS.AES.decrypt(resp[u][keys[j]], environment.key).toString(CryptoJS.enc.Utf8)
                                                //     if (resp[u][keys[j]] == "true" || resp[u][keys[j]] == "false") {
                                                //         //console.log("boolean")
                                                //         resp[u][keys[j]] = JSON.parse(resp[u][keys[j]].toString())
                                                //     }
                                                //     //console.log(CryptoJS.AES.decrypt(body[entries[i]][keys[j]].toString(), environment.key).toString(CryptoJS.enc.Utf8))
                                                // }
                                                resp[u]=singleObjectDecrypt(resp[u]);
                                            }
                                        }
                                    }
                                    else {
                                        body[entries[i]] = CryptoJS.AES.decrypt(Object.values(body)[i], environment.key).toString(CryptoJS.enc.Utf8)
                                        //console.log(CryptoJS.AES.decrypt(Object.values(body)[i], environment.key).toString(CryptoJS.enc.Utf8))
                                    }
                                }
                                //console.log(body)
                            }
                            // console.log(body)

                        }
                        //console.log(body)
                    }
                    event["body"] = body
                    return event;
                }),
                catchError((error: HttpErrorResponse) => {
                    let data = {};
                    data = {
                        reason: error && error.error && error.error.reason ? error.error.reason : '',
                        status: error.status
                    };
                    console.log(error)
                    M.toast({ html: 'Something went wrong', classes: 'rounded' })
                    return throwError(error);//url,message
                })

            );
        } catch (error) {
            console.log("interceptor error : " + error)
        }

    }
}