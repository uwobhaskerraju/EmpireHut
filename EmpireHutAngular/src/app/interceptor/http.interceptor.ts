import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

//https://www.techiediaries.com/angular-interceptors-mock-http-requests-example/
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
                            'authorization': 'Bearer '+localStorage.getItem('ACCESS_TOKEN')
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
                        'authorization': 'Bearer '+localStorage.getItem('ACCESS_TOKEN')
                    }
                )
            });
        }

        //console.log(req);
        return next.handle(req);
    }
}