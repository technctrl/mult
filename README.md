# node-kido
## Node.js Backend Architecture Typescript
### Un backend complet modulaire basé sur express et typescript

# Project Highlights
1. Node.js
2. Express.js
3. Typescript
4. Mongoose
5. Zod
6. JWT


## Structure des Dossiers
 ```
  Server
├── src
│   ├── main
│   │   ├── @types
│   │   │   ├── Express
│   │   │   │   └── index.d.ts
│   │   │   ├── HashProvider
│   │   │   │   ├── domain
│   │   │   │   │   └── IHashProvider.ts
│   │   │   │   └── infrastructure
│   │   │   │       └── HashProvider.ts
│   │   │   ├── JwtProvider
│   │   │   │   ├── domain
│   │   │   │   │   └── IJwtProvider.ts
│   │   │   │   └── infrastructure
│   │   │   │       ├── JwtProvider.ts
│   │   │   │       └── JwtTokenVerify.ts
│   │   │   ├── Logger
│   │   │   │   ├── applications
│   │   │   │   │   └── consoleLog.ts
│   │   │   │   ├── domain
│   │   │   │   │   └── ILogger.ts
│   │   │   │   └── infrastructure
│   │   │   │       └── ConsoleLogger.ts
│   │   │   ├── Response
│   │   │   │   ├── domain
│   │   │   │   │   └── IResponse.ts
│   │   │   │   └── infrastructure
│   │   │   │       └── Response.ts
│   │   │   └── RouterInfoImp.ts
│   │   ├── helpers
│   │   │   ├── launch.ts
│   │   │   └── swagger.config.ts
│   │   ├── providers
│   │   │   ├── mongodb
│   │   │   ├── AppProvider.ts
│   │   │   ├── ErrorHandlerProvider.ts
│   │   │   ├── LocalsProvider.ts
│   │   │   └── MiddlewaresProvider.ts
│   │   └── services
│   │       └── Notifications
│   │           ├── mail
│   │           │   └── NodeMailerService.ts
│   │           └── pusher
│   ├── modules
│   └── templates
│       └── notifications
│           └── mail
│               └── test.twig
├── .env
├── .prettierrc
├── eslint.config.js
├── nodemon.json
├── package.json
├── package-lock.json
├── README.md
├── robots.txt
└── tsconfig.json 
 ```