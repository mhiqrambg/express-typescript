# Case Error catching

###### app/middleware/errorHandler.ts

* try-catch default (manual handler)
* errorHandler.js (global error handler)

##### Case Error cathing

1. If Error on App
2. error catch by

* Try-catch (manual catch)
* Error Handler (global catch)

3. error passed to errorHandler.ts, filter error type "app/errors" error before sent response

##### Example use
###### app/routes/admin.ts
```js
app.get('/admin', (req, res, next) => {
throw new InternalServerError('Terjadi kesalahan pada server');
});
```

###### app

```js
import { errorHandler } from './middleware/errorHandler';

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
 errorHandler(err, req, res, next);
});```

