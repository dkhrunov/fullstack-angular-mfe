import { ESamesiteOption } from '../enums';
import { ICookieBuilder } from '../interfaces';

export class CookieBuilder implements ICookieBuilder {
	private readonly cookie: string;
	private cookieOptions = '';

	constructor(cookie: string) {
		this.cookie = cookie;
	}

	/**
	 * Получить новый инстанс билдера.
	 * @param cookie куки со значением key=value.
	 */
	public static instantiate(cookie: string): CookieBuilder {
		return new CookieBuilder(cookie);
	}

	/**
	 * URL-префикс пути, куки будут доступны
	 * для страниц под этим путём.
	 * @param path URL-префикс.
	 */
	public path(path: string): CookieBuilder {
		this.cookieOptions += `; path=${path}`;

		return this;
	}

	/**
	 * Домен, на котором доступны куки.
	 * @param domain Домен.
	 */
	public domain(domain: string): CookieBuilder {
		this.cookieOptions += `; domain=${domain}`;

		return this;
	}

	/**
	 * Дата истечения срока действия куки,
	 * когда браузер удалит его автоматически.
	 * @param date Дата удаления кук.
	 */
	public expires(date: Date): CookieBuilder {
		const dateInUTC = date.toUTCString();
		this.cookieOptions += `; expires=${dateInUTC}`;

		return this;
	}

	/**
	 * Cрок действия куки в секундах с момента установки.
	 * @param seconds Время в секундах.
	 */
	public maxAge(seconds: number): CookieBuilder {
		this.cookieOptions += `; max-age=${seconds}`;

		return this;
	}

	/**
	 * Куки следует передавать только по HTTPS-протоколу.
	 */
	public secure(): CookieBuilder {
		this.cookieOptions += '; secure';

		return this;
	}

	/**
	 * Это ещё одна настройка безопасности,
	 * применяется для защиты от так называемой XSRF-атаки.
	 * @param samesite возможные значение опции samesite у кук.
	 */
	public samesite(samesite: ESamesiteOption): CookieBuilder {
		this.cookieOptions += `; samesite=${samesite}`;

		return this;
	}

	/**
	 * Создать строку с настройками кук.
	 */
	public build(): string {
		return this.cookie + this.cookieOptions;
	}
}
