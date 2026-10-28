//node
import path from 'node:path';
//modules
import type { ToastPosition } from 'react-toastify';
//types
export type { Config } from 'stackpress/types';
export type Cascade = 'CASCADE' | 'RESTRICT' | 'SET NULL';
//pathnames
export const cwd = process.cwd();
export const build = path.join(cwd, '.build');
export const assets = path.join(cwd, 'public');
export const modules = path.join(cwd, 'node_modules');
//environment variables
export const seed = {
  database: process.env.DATABASE_SEED || 'abc123',
  session: process.env.SESSION_SEED || 'abc123'
};

//common config
export const admin = {
  //name of the admin section. shown on the top left of the page
  name: 'Admin',
  //base route for the admin section
  base: '/admin',
  //static admin menu items
  menu: [
    {
      name: 'Profiles',
      icon: 'user',
      path: '/admin/profile/search',
      match: '/admin/profile'
    },
    {
      name: 'Auth',
      icon: 'lock',
      path: '/admin/auth/search',
      match: '/admin/auth'
    },
    {
      name: 'Apps',
      icon: 'laptop',
      path: '/admin/application/search',
      match: '/admin/application'
    },
    {
      name: 'Sessions',
      icon: 'coffee',
      path: '/admin/session/search',
      match: '/admin/session'
    }
  ]
};

export const api = {
  //when sessions expire. this is used with `session.created` column
  expires: 1000 * 60 * 60 * 24 * 365,
  //calls out external urls when specified events happen
  webhooks: [
    {
      event: 'auth-signout',
      uri: 'http://localhost:3000/api/webhook',
      method: 'POST' as 'POST',
      validity: {},
      data: {}
    }
  ],
  //scopes are used to limit access to certain endpoints
  //when creating the default application, make sure the 
  //following scopes are included, or you will get a 401 
  //error when trying to access the endpoints
  scopes: {
    'user': { 
      name: 'User API Service',
      description: 'Profile Endpoints' 
    }
  },
  endpoints: [
    //Auth Endpoints
    {
      method: 'GET' as 'GET',
      route: '/api/auth/search',
      type: 'public' as 'public',
      event: 'auth-search',
      cors: true,
      data: {}
    },
    //Profile Endpoints
    {
      method: 'GET' as 'GET',
      route: '/api/profile/search',
      type: 'app' as 'app',
      scopes: [ 'user' ],
      event: 'profile-search',
      data: {}
    },
    {
      method: 'GET' as 'GET',
      route: '/api/profile/detail/:id',
      type: 'app' as 'app',
      scopes: [ 'user' ],
      event: 'profile-detail',
      data: {}
    },
    {
      method: 'GET' as 'GET',
      route: '/api/profile/get/:key/:value',
      type: 'app' as 'app',
      scopes: [ 'user' ],
      event: 'profile-get',
      data: {}
    },
    //Address Endpoints
    {
      method: 'GET' as 'GET',
      route: '/api/my/address',
      type: 'session' as 'session',
      scopes: [ 'user' ],
      event: 'profile-detail',
      data: {}
    },
    //File Endpoints
    {
      method: 'GET' as 'GET',
      route: '/api/my/files',
      type: 'session' as 'session',
      scopes: [ 'user' ],
      event: 'profile-detail',
      data: {}
    }
  ]
};

export const auth = {
  //base route for signin, signout, signup pages
  base: '/auth',
  //on signin (or already signed in)
  redirect: '/',
  //two factor authentication settings
  '2fa': { issuer: 'Stackpress' },
  //default roles for new users
  roles: [ 'USER' ],
  menu: [
    {
      name: 'With Username',
      icon: 'user',
      path: '/auth/signin/username'
    },
    {
      name: 'With Email',
      icon: 'envelope',
      path: '/auth/signin/email'
    },
    {
      name: 'With Phone',
      icon: 'phone',
      path: '/auth/signin/phone'
    },
    {
      name: 'Create a New Account',
      icon: 'user-plus',
      path: '/auth/signup'
    },
    {
      type: 'footer',
      name: 'Terms of Use',
      path: '/auth/terms-of-use'
    },
    {
      type: 'footer',
      name: 'Privacy Policy',
      path: '/auth/privacy-policy'
    }
  ],
  //password settings
  password: {
    min: 8,
    max: 32,
    upper: true,
    lower: true,
    number: true,
    special: true
  }
};

export const brand = {
  name: '_BRAND__NAME_',
  logo: '/logo.png',
  icon: '/icon.png',
  favicon: '/favicon.ico'
};

export const client = { 
  //whether to compiler client in `js` or `ts`
  lang: 'js',
  //used by `stackpress/client` to `import()` 
  //the generated client code to memory
  module: '_PROJECT__NAME_-client',
  //name of the client package used in package.json
  package: '_PROJECT__NAME_-client',
  //where to store serialized idea json files for historical 
  //purposes. Revisions are used in conjuction with push and 
  //migrate to determine the changes between each idea change.
  revisions: path.join(build, 'revisions'),
  //where to store the generated client code
  build: path.join(cwd, 'node_modules', '_PROJECT__NAME_-client'),
  //what tsconfig file to base the typescript compiler on
  tsconfig: path.join(cwd, 'tsconfig.json'),
  prettier: {
    singleQuote: true,
    jsxSingleQuote: false,
    trailingComma: 'none' as 'none',
    bracketSpacing: true,
    experimentalTernaries: true
  }
};

export const cookie = { 
  //see: https://github.com/jshttp/cookie?tab=readme-ov-file#options-1
  path: '/' 
};

export const csrf = {
  name: 'csrf'
};

export const database = {
  //used to encrypt/decrypt data in the database
  seed: seed.database,
  //where to store create and alter table migration files
  // - This is used in conjunction with `revisions`
  // - This doesn't update the database, it simply logs the changes
  migrations: path.join(build, 'migrations'),
  //cascading rules used when generating the database schema
  //options: 'CASCADE', 'SET NULL', 'RESTRICT'
  schema: {
    onDelete: 'CASCADE' as Cascade,
    onUpdate: 'RESTRICT' as Cascade
  },
  populate: [
    {
      event: 'profile-create',
      data: {
        id: 'developer',
        name: 'Developer',
        type: 'person',
        roles: [ 'ADMIN' ]
      }
    },
    {
      event: 'auth-create',
      data: {
        profileId: 'developer',
        type: 'username',
        token: 'developer',
        secret: 'developer'
      }
    },
    {
      event: 'auth-create',
      data: {
        profileId: 'developer',
        type: 'email',
        token: 'developer@example.com',
        secret: 'developer'
      }
    },
    {
      event: 'application-create',
      data: {
        profileId: 'developer',
        name: 'Developer App',
        scopes: [ 'profile-write', 'auth-read' ],
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
      }
    },
  ]
};

export const email = {
  host: 'smtp.example.com',
  port: 587,
  // upgrade later with STARTTLS
  secure: false, 
  auth: {
    user: 'username',
    pass: 'password',
  }
};

export const language = {
  //url flag (ie. ?json) used to change the user's locale
  //this is also the name of the cookie used to store the locale
  key: 'locale',
  //default locale
  locale: 'en_US',
  //languages and translations
  languages: {
    en_US: {
      label: 'EN',
      translations: {
        'Sign In': 'Signin',
        'Home Page': 'Home Page'
      }
    },
    th_TH: {
      label: 'TH',
      translations: {
        'Sign In': 'Signin',
        'Home Page': 'Home Pagesss'
      }
    }
  }
};

//Example MCP config for `stackpress-ai`.
//This is not enabled by default in the template because the package/plugin
//must be added to `package.json` first, and the active config objects below do
//not include an `mcp` property yet.
export const mcp = {
  name: 'Stackpress Blog MCP',
  version: '1.0.0',
  route: '/mcp',
  mode: 'stateful' as 'stateful',
  tools: [
    {
      name: 'article_search',
      title: 'Search Articles',
      description: 'Returns published articles that match the search query.',
      type: 'public' as 'public',
      method: 'GET' as 'GET',
      event: 'article-search',
      input: {
        type: 'object',
        properties: {
          q: { type: 'string' },
          limit: { type: 'number' }
        }
      },
      data: {}
    },
    {
      name: 'article_create',
      title: 'Create Article',
      description: 'Creates a new article draft for the authenticated app.',
      type: 'app' as 'app',
      method: 'POST' as 'POST',
      event: 'article-create',
      scopes: [ 'articles.write' ],
      input: {
        type: 'object',
        required: [ 'title', 'slug', 'content', 'profileId', 'keywords', 'tags' ],
        properties: {
          title: { type: 'string' },
          slug: { type: 'string' },
          keywords: { type: 'array', items: { type: 'string' } },
          tags: { type: 'array', items: { type: 'string' } },
          content: { type: 'string' },
          profileId: { type: 'string' },
          banner: { type: 'string' },
          status: { type: 'string' }
        }
      },
      data: {}
    },
    {
      mode: 'plugin' as 'plugin',
      event: 'article-detail-tool'
    },
    {
      mode: 'plugin' as 'plugin',
      type: 'app' as 'app',
      event: 'article-update-tool',
      scopes: [ 'articles.write' ]
    },
    {
      mode: 'plugin' as 'plugin',
      event: 'comment-search-tool'
    },
    {
      mode: 'plugin' as 'plugin',
      type: 'user' as 'user',
      event: 'comment-create-tool',
      scopes: [ 'comments.write' ]
    }
  ]
};

export const server = {
  host: '127.0.0.1',
  port: 3000,
  cwd: cwd
};

export const session = {
  //name of the session cookie
  key: 'session',
  //used to generate the session id
  seed: seed.session,
  access: {
    ADMIN: [
      //page routes
      { method: 'ALL', route: '/' },
      { method: 'ALL', route: '/articles/**' },
      { method: 'ALL', route: '/auth/**' },
      { method: 'ALL', route: '/admin/**' },
      { method: 'ALL', route: '/api/**' }
    ],
    MANAGER: [
      //page routes
      { method: 'ALL', route: '/' },
      { method: 'ALL', route: '/articles/**' },
      { method: 'ALL', route: '/auth/**' },
      { method: 'ALL', route: '/admin/auth/**' },
      { method: 'ALL', route: '/api/**' }
    ],
    USER: [
      //page routes
      { method: 'ALL', route: '/' },
      { method: 'ALL', route: '/articles/**' },
      { method: 'ALL', route: '/auth/**' },
      { method: 'ALL', route: '/api/**' }
    ],
    GUEST: [
      //page routes
      { method: 'ALL', route: '/' },
      { method: 'ALL', route: '/articles/**' },
      { method: 'ALL', route: '/auth/signup' },
      { method: 'ALL', route: '/auth/signin' },
      { method: 'ALL', route: '/auth/signin/**' },
      { method: 'ALL', route: '/auth/signout' },
      { method: 'ALL', route: '/api/**' },
      { method: 'ALL', route: '/mcp' }
    ]
  }
};

export const terminal = {
  label: '[_BRAND__NAME_]',
  idea: path.join(cwd, 'schema.idea')
};

export const view = {
  //url flag (ie. ?json) used to disable template 
  //rendering and show the raw json data instead
  noview: 'json',
  //used by vite and in development mode
  //to determine the root of the project
  base: '/',
  //frontend notification display settings
  notify: {
    position: 'bottom-right' as ToastPosition,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
  }
};