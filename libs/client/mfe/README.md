# Angular micro-frontend library - ngx-mfe

#### This library depends on [@angular-architects/module-federation v12.2.0](https://github.com/angular-architects/module-federation-plugin) and [Nx monorepo](https://nx.dev/)

> To use this library, you must create your project with the nx monorepository.

> Thanks to Manfred Steyer for your [series of posts](https://www.angulararchitects.io/en/aktuelles/the-microfrontend-revolution-module-federation-in-webpack-5/) about Module Federation in Webpack 5 and Micro-frontends.

> Note: before using, check out a [series of posts](https://www.angulararchitects.io/en/aktuelles/the-microfrontend-revolution-module-federation-in-webpack-5/) from Manfred Steyer.

## Contents

-   [Configuration](#configuration)
-   [Configuration options](#configuration-options)
-   [Use in Routing](#use-in-routing)
-   [Use in plugin-based approach](#use-in-plugin-based-approach)
-   [Use MfeService](#use-mfeservice)

## Configuration

To configure this library, you should import MfeModule to core.module/app.module once for the entire application:

```typescript
import * as mfeConfig from '../../../../../mfe-config.json';
import * as workspaceConfig from '../../../../../workspace.json';

@NgModule({
	imports: [
		MfeModule.forRoot({
			mfeConfig,
			workspaceConfig,
			mfeProjectPattern: /^.+-mfe$/g,
			preload: ['loaders-mfe', 'fallbacks-mfe'],
			delay: 500,
			loader: 'loaders-mfe/spinner',
			fallback: 'fallbacks-mfe/not-found',
		}),
	],
})
export class CoreModule {}
```

## Configuration options

List of all available options:

-   **mfeConfig** - object with two required fields: remoteEntryUrl and remoteEntryFileName.

    -   remoteEntryUrl - URL where runs micro-frontends.
    -   remoteEntryFileNam - Js bundle of micro-frontend, by default it`s 'remoteEntry.js'.

    > More about remoteEntryUrl and remoteEntryFileNam properties in Micro-frontends world [here](https://www.angulararchitects.io/en/aktuelles/the-microfrontend-revolution-module-federation-in-webpack-5/)

-   **workspaceConfig** - content of the workspace.json or angular.json file.
-   **mfeProjectPattern?** - RegExp for by which projects will be selected from the workspace.json or angular.json. _If not specified, it will select all._
-   **preload?** - list of micro-frontends, bundles of the specified micro-frontends will be loaded immediately and saved in the cache.
-   **delay?** - The delay between displaying the contents of the bootloader and the micro-frontend. This is to avoid flickering when the micro-frontend loads very quickly. _By default 0._
-   **loader?** - Displayed when loading bundle of micro-frontend. Indicated as a micro-frontend string _example: 'loader-mfe/spinner'._
-   **fallback?** - Displayed when micro-frontend component loaded with error. Indicated as a micro-frontend string _example: 'fallback-mfe/not-found'._

    > For better UX, add loader and fallback micro-frontends to [preload]() array.

## Use in Routing

To use micro-frontends in Routing, it is enough to import and use the helper function called **loadMfeModule**, like in the example below:

```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loadMfeModule } from '@dkhrunov/ng-mfe';

const routes: Routes = [
	{
		path: 'dashboard',
		loadChildren: () => loadMfeModule('dashboard-mfe/entry'),
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' })],
	exports: [RouterModule],
})
export class AppRoutingModule {}
```

## Use in plugin-based approach

This approach allows us to load micro-frontends directly from HTML.

> More about plugin-based approach [here](https://www.angulararchitects.io/en/aktuelles/dynamic-module-federation-with-angular-2/)

### NOTICE:

#### To work correctly with this approach, you must always expose both the module and the component declared in this module.

#### You must also follow the rule - one component per module.

An example webpack.config.js that exposes the EntryComponent micro-frontend "dashboard-mfe":

```js
return {
	...
	resolve: {
		alias: sharedMappings.getAliases(),
	},
	plugins: [
		new ModuleFederationPlugin({
			name: 'dashboard-mfe',
			exposes: {
				// Expose Module
				EntryModule: 'apps/dashboard-mfe/src/app/remote-entry/entry.module.ts',
				// Expose Component that declared in EntryModule @NgModule({ declarations: [EntryComponent] });
				EntryComponent: 'apps/dashboard-mfe/src/app/remote-entry/entry.component.ts',
			},
			filename: 'remoteEntry',
			shared: share({
				'@angular/core': {
					singleton: true,
					strictVersion: true,
					requiredVersion: 'auto',
				},
				'@angular/common': {
					singleton: true,
					strictVersion: true,
					requiredVersion: 'auto',
				},
				'@angular/common/http': {
					singleton: true,
					strictVersion: true,
					requiredVersion: 'auto',
				},
				'@angular/router': {
					singleton: true,
					strictVersion: true,
					requiredVersion: 'auto',
				},
				rxjs: {
					singleton: true,
					strictVersion: true,
					requiredVersion: 'auto',
				},
				'rxjs/operators': {
					singleton: true,
					strictVersion: true,
					requiredVersion: '^7',
				},
				...sharedMappings.getDescriptors(),
			}),
		}),
		sharedMappings.getPlugin(),
	],
};
```

This architectural approach will use **MfeOutletDirective**.

1. Just display the component "EntryComponent" of micro-frontend "dashboard-mfe":

```html
<ng-container *mfeOutlet="'dashboard-mfe/entry'"></ng-container>
```

2. Display the component with @Input() data binding. For data binding use property `input`:

```html
<ng-container *mfeOutlet="'dashboard-mfe/entry'; inputs: { text: text$ | async };"></ng-container>
```

> If you try to bind a @Input() property that is not in the component, then an error will fall into the console:
> "Input **someInput** is not input of **SomeComponent**."

3. Display the component with @Output() data binding. For @Output() binding use property `output`:

```html
<ng-container *mfeOutlet="'dashboard-mfe/entry'; inputs: { text: text$ | async };"></ng-container>
```

> If you try to bind a @Output() property that is not in the component, then an error will fall into the console:
> "Output **someOutput** is not output of **SomeComponent**."

> If you try to pass a non-function, then an error will fall into the console:
> "Output **someOutput** must be a function."

4. To override the default loader delay, confgured in `MfeModule.ForRoot({ ... })`, provide custom number in ms to property `loaderDelay`:

```html
<ng-container *mfeOutlet="'dashboard-mfe/entry'; loaderDelay: 1000"></ng-container>
```

5. To override the default loader or fallback components, confgured in `MfeModule.ForRoot({ ... })`, provide TemplateRef or micro-frontend string to property `loader` and `fallback`:

> In the example below, loader provided as a TemplateRef, and fallback is micro-frontend string.

```html
<ng-container
	*mfeOutlet="
	'client-dashboard-mfe/entry';
	loader: loader;
	fallback: 'fallback-mfe/not-found'
"
>
</ng-container>

<ng-template #loader>
	<div>loading...</div>
</ng-template>
```

6. You can also provide a custom injector for a component like this:

```html
<ng-container *mfeOutlet="'dashboard-mfe/entry'; injector: customInjector"></ng-container>
```

## Use MfeService

You can load micro-frontend module class and component class by using **MfeService**.

> Under the hood **MfeOutletDirective** uses **MfeService** to resolve the micro-frontend component factory.

### MfeService API

-   `resolveComponentFactory<M, C>(mfe: string, injector?: Injector): Promise<ComponentFactory<C>>` - Resolve the micro-frontend component factory.

-   `load<M, C>(mfe: string): Promise<LoadedMfe<M, C>>` - Loads the micro-frontend exposed module class and exposed component class.

-   `loadModule<M>(mfe: string): Promise<Type<M>>` - Loads an exposed micro-frontend module class.

-   `loadComponent<C>(mfe: string): Promise<Type<C>>` - Loads an exposed micro-frontend component class.
