import 'express-error-handler';
import Http from 'http';
import Express from 'express';
import Cors from 'cors';
import Helmet from 'helmet';
import Compression from 'compression';
import { ApiConfigs } from './configs';
import mainRoutes from './routes';
import { MongoDBParty } from './third-party';

const ApiApp = Express();
const ApiServer = Http.createServer(ApiApp);

/*      Using Library Middlewares       */

ApiApp.use(Express.json());
ApiApp.use(Express.urlencoded({ extended: false }));
ApiApp.use(Cors({ origin: '*' }));
ApiApp.use(Helmet());
ApiApp.use(Compression({ level: 1, threshold: 10 * 1000 /* 10MB */ }));

/*      Main Endpoint      */

mainRoutes(ApiApp);

/*      Main Endpoint      */

MongoDBParty.devConnectionHandler();

ApiServer.listen(ApiConfigs.port, () => {
    console.log(`Server is listening on ${ApiConfigs.port}`);
});
