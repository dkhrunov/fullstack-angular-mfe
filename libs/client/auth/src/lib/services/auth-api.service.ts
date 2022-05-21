import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BaseAuthApiService } from '@dekh/ngx-jwt-auth';
import { ENVIRONMENT, IEnvironment } from '@nx-mfe/client/environment';
import { AuthTokensDto, Login, Registration } from '@nx-mfe/shared/data-access';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class AuthApiService extends BaseAuthApiService {
	constructor(
		private readonly _httpClient: HttpClient,
		@Inject(ENVIRONMENT) private readonly _environment: IEnvironment
	) {
		super();
	}

	public login(credentials: Login): Observable<AuthTokensDto> {
		return this._httpClient.post<AuthTokensDto>(
			this._environment.apiUrl + '/auth/login',
			credentials,
			{
				withCredentials: true,
			}
		);
	}

	public register(credentials: Registration): Observable<void> {
		return this._httpClient.post<void>(
			this._environment.apiUrl + '/auth/register',
			credentials
		);
	}

	public logout(): Observable<void> {
		return this._httpClient.post<void>(this._environment.apiUrl + '/auth/logout', null, {
			withCredentials: true,
		});
	}

	public refresh(): Observable<AuthTokensDto> {
		return this._httpClient.post<AuthTokensDto>(
			this._environment.apiUrl + '/auth/refresh',
			null,
			{
				withCredentials: true,
			}
		);
	}
}
