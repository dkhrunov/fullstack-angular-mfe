import { NgModule } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { DefaultMfeOutletFallbackComponent, DefaultMfeOutletLoaderComponent } from './components';
import { MfeOutletDirective } from './directives';

@NgModule({
	declarations: [
		MfeOutletDirective,
		DefaultMfeOutletFallbackComponent,
		DefaultMfeOutletLoaderComponent,
	],
	exports: [MfeOutletDirective],
	imports: [NzResultModule, NzIconModule, NzSpinModule],
})
export class MfeModule {}
