// import { InjectorContainerModule } from '@nx-mfe/client/injector-container';
// import { ConfirmType, ModalOptions, NzModalService } from 'ng-zorro-antd/modal';

// /**
//  * When calling the decorated method, a window will open to confirm this operation.
//  * ----
//  *
//  * Method decorator.
//  *
//  * @param options Options for NzModal confirm.
//  * @param confirmType Type of window, by default "confirm".
//  */
// export function NzConfirmable(options?: Omit<ModalOptions, 'nzOnOk'>, confirmType?: ConfirmType) {
// 	return function (
// 		_target: any,
// 		_propertyKey: string,
// 		descriptor: TypedPropertyDescriptor<any>
// 	): TypedPropertyDescriptor<any> {
// 		const defaultOptions: ModalOptions = {
// 			nzTitle: 'Are you sure?',
// 			nzContent: 'Do you want to perform this action?',
// 			nzClosable: false,
// 		};

// 		const originalMethod = descriptor.value;

// 		descriptor.value = function (...args: unknown[]) {
// 			InjectorContainerModule.injector.get(NzModalService).confirm(
// 				{
// 					...defaultOptions,
// 					...options,
// 					nzOnOk: () => originalMethod.apply(this, args),
// 				},
// 				confirmType ?? 'confirm'
// 			);
// 		};

// 		return descriptor;
// 	};
// }

/**
 * When calling the decorated method, a window will open to confirm this operation.
 * ----
 *
 * Method decorator.
 *
 * @param _options Options for NzModal confirm.
 * @param _confirmType Type of window, by default "confirm".
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function NzConfirmable(_options?: any, _confirmType?: any) {
	return function (
		_target: any,
		_propertyKey: string,
		descriptor: TypedPropertyDescriptor<any>
	): TypedPropertyDescriptor<any> {
		const originalMethod = descriptor.value;

		descriptor.value = function (...args: unknown[]) {
			const isConfirmed = confirm('Do you want to perform this action?');

			if (isConfirmed) {
				originalMethod.apply(this, args);
			}
		};

		return descriptor;
	};
}
