import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
//https://www.techiediaries.com/angular-interceptors-mock-http-requests-example/
//https://scotch.io/@vigneshsithirai/angular-6-7-http-client-interceptor-with-error-handling
//https://github.com/vigneshsithirai/Angular-Interceptor/blob/master/src/app/interceptor/httpconfig.interceptor.ts
@Injectable()
export class MockHttpCalIInterceptor implements HttpInterceptor {
    constructor(private injector: Injector) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        //console.log('Intercepted request' + request.url);
        var req = null;
        if (request.url.toLowerCase().toString().includes("open")) {
            if (request.url.toLowerCase().toString().includes("open/val")) {
                req = request.clone({
                    headers: new HttpHeaders(
                        {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'Access-Control-Allow-Headers': 'Content-Type',
                            'authorization': 'Bearer ' + localStorage.getItem('ACCESS_TOKEN')
                        }
                    )
                });
            }
            else {
                req = request.clone({
                    headers: new HttpHeaders(
                        {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'Access-Control-Allow-Headers': 'Content-Type'
                        }
                    )
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
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'authorization': 'Bearer ' + localStorage.getItem('ACCESS_TOKEN')
                    }
                )
            });
        }

        //console.log(req);
        return next.handle(req).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    console.log('event--->>>', event);
                    if (event["body"]["statusCode"] == 200) {
                        console.log(event["url"])
                        console.log(event["body"]["result"])
                    }
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
    }
}