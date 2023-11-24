import 'express-error-handler';
import Http from 'http';
import Express from 'express';
import Cors from 'cors';
import Helmet from 'helmet';
import Compression from 'compression';
import * as SwaggerUI from 'swagger-ui-express';
import { ApiConfigs } from './configs';
import { MongoDBParty } from './third-party';
import * as ApiController from './controllers';
import { ErrorHandler, ResponseHandler } from './middlewares';
import * as SwaggerConfig from './configs/swagger.config.json';

const ApiApp = Express();
export const ApiServer = Http.createServer(ApiApp);

/*      Using Library Middlewares       */

ApiApp.use(Express.json());
ApiApp.use(Express.urlencoded({ extended: false }));
ApiApp.use(Cors({ origin: '*' }));
ApiApp.use(Helmet());
ApiApp.use(Compression({ level: 1, threshold: 128 /* 0.125KB */ }));

/*      Main Endpoint      */

ApiApp.use('/api', ApiController.apiControllers);
ApiApp.use('/api-doc', SwaggerUI.serve, SwaggerUI.setup(SwaggerConfig));

/*      Using Library Middlewares       */

ApiApp.use(ResponseHandler);
ApiApp.use(ErrorHandler);

/*      Main Endpoint      */

MongoDBParty.connectionHandler();

ApiServer.listen(ApiConfigs.port, () => {
    console.log(`Server is listening on ${ApiConfigs.port}`);
});
