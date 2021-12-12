import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import { expressCspHeader, INLINE, SELF, EVAL, DATA, BLOB} from "express-csp-header";

const AppMiddleware = new express();

AppMiddleware.use(bodyParser.json());
AppMiddleware.use(bodyParser.urlencoded({ extended: false }));
AppMiddleware.use(cors());
AppMiddleware.use(helmet());
AppMiddleware.use(expressCspHeader({
  directives: {
    'default-src': [SELF],
    'script-src': [SELF, INLINE, EVAL, ,'*.com', '*.net'],
    'style-src': [SELF, INLINE, '*.com', '*.net'],
    'style-src-elem': [SELF, INLINE, '*.com', '*.net'],
    'img-src': [SELF, '*.com', '*.net', DATA, BLOB],
    'font-src': [SELF, 'fonts.gstatic.com', DATA, BLOB],
    'connect-src': [SELF ,'*.com', '*.net']
  }
}))

export default AppMiddleware;

