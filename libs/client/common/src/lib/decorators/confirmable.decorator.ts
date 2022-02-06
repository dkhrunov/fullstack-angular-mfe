import { InjectorContainerModule } from '@nx-mfe/client/core';
import { ConfirmType, ModalOptions, NzModalService } from 'ng-zorro-antd/modal';

/**
 * Декоратор метода.
 *
 * При вызове декарируемого метода, откроется окно для подтверждения данной операции.
 * @param options параметры для NzModal confirm
 * @param confirmType тип окошка
 */
export function Confirmable(options?: Omit<ModalOptions, 'nzOnOk'>, confirmType?: ConfirmType) {
	return function (
		_target: any,
		_propertyKey: string,
		descriptor: TypedPropertyDescriptor<any>
	): TypedPropertyDescriptor<any> {
		const defaultOptions: ModalOptions = {
			nzTitle: 'Are you sure?',
			nzContent: 'Do you want to perform this action?',
			nzClosable: false,
		};

		const originalMethod = descriptor.value;

		descriptor.value = function (...args: unknown[]) {
			InjectorContainerModule.injector.get(NzModalService).confirm(
				{
					...defaultOptions,
					...options,
					nzOnOk: () => originalMethod.apply(this, args),
				},
				confirmType ?? 'confirm'
			);
		};

		return descriptor;
	};
}
