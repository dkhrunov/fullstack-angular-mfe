import { PATTERN_REGEXP } from './pattern-regexp';

/**
 * Заменяет на указанные в аргументах строки в шаблоне, в порядки их обнаружения
 * и возвращает новую строку с заменами
 * @param pattern Шаблон
 * @param args Список замен, в порядке их обнаружения
 */
export function replacePatterns(pattern: string, args: string[]) {
	let argIndex = 0;

	while (pattern.match(PATTERN_REGEXP)) {
		pattern = pattern.replace(/{\*{3}}/, args[argIndex]);
		argIndex++;
	}

	return pattern;
}
