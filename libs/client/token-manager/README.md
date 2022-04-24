# client-token-manager

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test client-token-manager` to execute the unit tests.

### DOC

-   Use expireIn `-1` if you want to create infinite token.

-   To get JWT token payload use static method `decode` of class `JwtDecoder` class.

-   To get when JWT token expires use static method `expireIn` of class `JwtDecoder` class.

-   Write how to create custom TokenStorage + how to register custom TokenStorage (через TokenManagerOptions.customTokenStorages или TokenStorageRegistry.register) and how to create custom custom TokenStorageManager
