import { ConfirmType, ModalOptions, NzModalService } from 'ng-zorro-antd/modal';

import { DecoratorsModule } from './decorators.module';

export function Confirmable(options?: Omit<ModalOptions, 'nzOnOk'>, confirmType?: ConfirmType) {
	return (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
		const defaultOptions: ModalOptions = {
			nzTitle: 'Are you sure?',
			nzContent: 'Do you want to perform this action?',
			nzClosable: false,
		};

		const originalMethod = descriptor.value;

		descriptor.value = function (...args: unknown[]) {
			DecoratorsModule.injector.get(NzModalService).confirm(
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
