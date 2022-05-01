import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Injector } from '@angular/core';
import { BaseAuthHttpService } from '@dekh/ngx-jwt-auth';
import { CONFIG, IConfig } from '@nx-mfe/client/config';
import { AuthTokensDto, Login, Registration } from '@nx-mfe/shared/data-access';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class AuthApiService extends BaseAuthHttpService {
	constructor(
		private readonly _injector: Injector,
		@Inject(CONFIG) private readonly _config: IConfig
	) {
		super();
	}

	public login(credentials: Login): Observable<AuthTokensDto> {
		return this._injector
			.get(HttpClient)
			.post<AuthTokensDto>(this._config.apiUrl + '/auth/login', credentials, {
				withCredentials: true,
			});
	}

	public register(credentials: Registration): Observable<void> {
		return this._injector
			.get(HttpClient)
			.post<void>(this._config.apiUrl + '/auth/register', credentials);
	}

	public logout(): Observable<void> {
		return this._injector
			.get(HttpClient)
			.post<void>(this._config.apiUrl + '/auth/logout', null, {
				withCredentials: true,
			});
	}

	public refresh(): Observable<AuthTokensDto> {
		console.log(111);

		return this._injector
			.get(HttpClient)
			.post<AuthTokensDto>(this._config.apiUrl + '/auth/refresh', null, {
				withCredentials: true,
			});
	}
}
