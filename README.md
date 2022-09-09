# Logger

Middleware для логирования действий авторизованного пользователя в БД

## example
```ts
// добаление middleware в приложение для всех эндпоинтов
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

// добаление middleware для всех эндпоинтов в котроллерах
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(WalletsController);
  }
}

// добаление middleware для отдельных эндпоинтов
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(
        { path: 'market/price', method: RequestMethod.GET },
        { path: 'market/price', method: RequestMethod.POST })
  }
}
```
NestJS module

## Dependence

## Dir structure
```
<app-name>
└── src
    └── modules
        └── logger    
```

## Migration guide

Если использовался Role-base access control (RBAC), то необходимо в `app.module.ts` добавить импорт `SharedModule`:

```ts
import { HasRoleGuard } from './modules/auth/guard/has-role.guard';

@Module({
  imports: [
    SharedModule.forRoot({
      customGuards: {
        HasRoleGuard,
      },
    }),
    // ...
  ],
  controllers: [ /* ... */ ],
  providers: [ /* ... */ ],
})
export class AppModule {}
```
