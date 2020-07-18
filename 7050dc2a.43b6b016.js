(window.webpackJsonp=window.webpackJsonp||[]).push([[22],{123:function(e,n,t){"use strict";t.r(n),t.d(n,"frontMatter",(function(){return o})),t.d(n,"metadata",(function(){return l})),t.d(n,"rightToc",(function(){return s})),t.d(n,"default",(function(){return p}));var r=t(1),i=t(6),a=(t(0),t(149)),o={title:"GraphQL driver"},l={id:"drivers/graphql-driver",title:"GraphQL driver",description:"## Introduction",source:"@site/docs/drivers/graphql-driver.md",permalink:"/redux-requests/docs/drivers/graphql-driver",editUrl:"https://github.com/klis87/redux-requests/edit/master/docusaurus/docs/drivers/graphql-driver.md",lastUpdatedBy:"klis87",lastUpdatedAt:1593865978,sidebar:"docs",previous:{title:"Fetch driver",permalink:"/redux-requests/docs/drivers/fetch-driver"},next:{title:"Promise driver",permalink:"/redux-requests/docs/drivers/promise-driver"}},s=[{value:"Introduction",id:"introduction",children:[]},{value:"Installation",id:"installation",children:[]},{value:"Usage",id:"usage",children:[]},{value:"Passing variables",id:"passing-variables",children:[]},{value:"Using GraphQL fragments",id:"using-graphql-fragments",children:[]},{value:"Mutations",id:"mutations",children:[]},{value:"File uploads",id:"file-uploads",children:[]}],c={rightToc:s};function p(e){var n=e.components,t=Object(i.a)(e,["components"]);return Object(a.b)("wrapper",Object(r.a)({},c,t,{components:n,mdxType:"MDXLayout"}),Object(a.b)("h2",{id:"introduction"},"Introduction"),Object(a.b)("p",null,"Choose this driver, if you need to communicate with ",Object(a.b)("strong",{parentName:"p"},"GraphQL")," server. Of course, it\nis possible to do it directly with ",Object(a.b)("inlineCode",{parentName:"p"},"axios")," or ",Object(a.b)("inlineCode",{parentName:"p"},"fetch")," driver, but ",Object(a.b)("strong",{parentName:"p"},"GraphQL")," communication\nwill be much simpler with this one. Not to mention that it has some functionalities\ncompatible with Apollo server and tooling, like ",Object(a.b)("inlineCode",{parentName:"p"},"gql")," tag and ",Object(a.b)("inlineCode",{parentName:"p"},"GraphQL multipart request specification"),"\nto facilitate files uploads."),Object(a.b)("h2",{id:"installation"},"Installation"),Object(a.b)("p",null,"To install the package, just run:"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-bash"}),"$ npm install @redux-requests/graphql\n")),Object(a.b)("p",null,"or you can just use CDN: ",Object(a.b)("inlineCode",{parentName:"p"},"https://unpkg.com/@redux-requests/graphql"),"."),Object(a.b)("h2",{id:"usage"},"Usage"),Object(a.b)("p",null,"Let's assume we have the following GraphQL schema:"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-graphql"}),"type Book {\n  id: ID!\n  title: String!\n  author: String!\n  liked: Boolean!\n}\n\ntype File {\n  filename: String!\n  mimetype: String!\n  encoding: String!\n}\n\ntype Query {\n  books: [Book!]!\n  book(id: ID!): Book\n}\n\ntype Mutation {\n  deleteBook(id: ID!): Book\n  singleUpload(file: Upload!): File!\n  multipleUpload(files: [Upload!]!): [File!]!\n}\n")),Object(a.b)("p",null,"To use this driver, just import it and pass to ",Object(a.b)("inlineCode",{parentName:"p"},"handleRequests"),", like you would do\nwith other drivers:"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-js"}),"import { handleRequests } from '@redux-requests/core';\nimport { createDriver } from '@redux-requests/graphql';\n\nhandleRequests({\n  driver: createDriver({ url: 'http://localhost:3000/graphql' }),\n});\n")),Object(a.b)("p",null,"In order to send a query, just do it in a similar fashion to other drivers. The only\none thing really specific to GraphQL is a way you define your actions. Let's create an action\nto fetch books:"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-js"}),"import { gql } from '@redux-requests/graphql';\n\nconst fetchBooks = () => ({\n  type: 'FETCH_BOOKS',\n  request: {\n    query: gql`\n      {\n        books {\n          id\n          title\n          author\n          liked\n        }\n      }\n    `,\n    headers: {\n      SOMEHEADER: 'SOMEHEADER',\n    },\n  },\n});\n")),Object(a.b)("p",null,"As you see, there is nothing fancy here, you just write GraphQL. Notice we wrap it in\n",Object(a.b)("inlineCode",{parentName:"p"},"gql")," tag. Currently it only trims queries, but in the future it could do other stuff,\nso it is recommended to wrap all your queries in ",Object(a.b)("inlineCode",{parentName:"p"},"gql"),", especially that it will hint\nmost of code editors to properly highlight them. Also notice that it is possible to\npass ",Object(a.b)("inlineCode",{parentName:"p"},"headers"),", which could be useful for authentication for instance."),Object(a.b)("h2",{id:"passing-variables"},"Passing variables"),Object(a.b)("p",null,"Now, let's fetch a specific book, which requires using variables:"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-js"}),"const fetchBook = id => ({\n  type: 'FETCH_BOOK',\n  request: {\n    query: gql`\n      query($id: ID!) {\n        book(id: $id) {\n          id\n          title\n          author\n          liked\n        }\n      }\n    `,\n    variables: { id },\n  },\n});\n")),Object(a.b)("h2",{id:"using-graphql-fragments"},"Using GraphQL fragments"),Object(a.b)("p",null,"Notice ",Object(a.b)("inlineCode",{parentName:"p"},"Book")," properties repeated across those two queries. As you probably know,\nthe answer for this problem is GraphQL fragment, which you can create like this:"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-js"}),"const bookFragment = gql`\n  fragment BookFragment on Book {\n    id\n    title\n    author\n    liked\n  }\n`;\n\nconst fetchBook = id => ({\n  type: 'FETCH_BOOK',\n  request: {\n    query: gql`\n      query($id: ID!) {\n        book(id: $id) {\n          ...BookFragment\n        }\n      }\n      ${bookFragment}\n    `,\n    variables: { id },\n  },\n});\n")),Object(a.b)("h2",{id:"mutations"},"Mutations"),Object(a.b)("p",null,"Mutations are done like queries, just use GraphQL language:"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-js"}),"const deleteBook = id => ({\n  type: 'DELETE_BOOK',\n  request: {\n    query: gql`\n      mutation($id: ID!) {\n        deleteBook(id: $id) {\n          id\n        }\n      }\n    `,\n    variables: { id },\n  },\n});\n")),Object(a.b)("h2",{id:"file-uploads"},"File uploads"),Object(a.b)("p",null,"Upload files according to ",Object(a.b)("a",Object(r.a)({parentName:"p"},{href:"https://github.com/jaydenseric/graphql-multipart-request-spec"}),"GraphQL multipart request specification"),", which is also used by other\nGraphQL clients and servers, like Apollo, is also supported."),Object(a.b)("p",null,"So, to upload a single file:"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-js"}),"const uploadFile = file => ({\n  type: 'UPLOAD_FILE',\n  request: {\n    query: gql`\n      mutation($file: Upload!) {\n        singleUpload(file: $file) {\n          filename\n          mimetype\n          encoding\n        }\n      }\n    `,\n    variables: { file },\n  },\n});\n")),Object(a.b)("p",null,"... or, to upload multiple files:"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-js"}),"const uploadFiles = files => ({\n  type: 'UPLOAD_FILES',\n  request: {\n    query: gql`\n      mutation($files: [Upload!]!) {\n        multipleUpload(files: $files) {\n          filename\n          mimetype\n          encoding\n        }\n      }\n    `,\n    variables: { files },\n  },\n});\n")),Object(a.b)("p",null,"So, you can do it exactly in the same way like other libraries supporting\n",Object(a.b)("inlineCode",{parentName:"p"},"GraphQL multipart request specification"),"."))}p.isMDXComponent=!0},149:function(e,n,t){"use strict";t.d(n,"a",(function(){return u})),t.d(n,"b",(function(){return m}));var r=t(0),i=t.n(r);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function l(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,r,i=function(e,n){if(null==e)return{};var t,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var c=i.a.createContext({}),p=function(e){var n=i.a.useContext(c),t=n;return e&&(t="function"==typeof e?e(n):l({},n,{},e)),t},u=function(e){var n=p(e.components);return i.a.createElement(c.Provider,{value:n},e.children)},d={inlineCode:"code",wrapper:function(e){var n=e.children;return i.a.createElement(i.a.Fragment,{},n)}},b=Object(r.forwardRef)((function(e,n){var t=e.components,r=e.mdxType,a=e.originalType,o=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),u=p(t),b=r,m=u["".concat(o,".").concat(b)]||u[b]||d[b]||a;return t?i.a.createElement(m,l({ref:n},c,{components:t})):i.a.createElement(m,l({ref:n},c))}));function m(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var a=t.length,o=new Array(a);o[0]=b;var l={};for(var s in n)hasOwnProperty.call(n,s)&&(l[s]=n[s]);l.originalType=e,l.mdxType="string"==typeof e?e:r,o[1]=l;for(var c=2;c<a;c++)o[c]=t[c];return i.a.createElement.apply(null,o)}return i.a.createElement.apply(null,t)}b.displayName="MDXCreateElement"}}]);