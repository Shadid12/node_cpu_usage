Getting Started
 
 please verify
 `node 9.10.0` is installed
 `npm 5.6.0` is installed
 
 This project uses ES2015
 `npm install -g nodemon` 
 `npm install -g babel-cli`
 
 Get Dependencies `npm install`
 Start Script by running `npm start`

> Usage

you can import this module by 

`import OStats from './ostats';`
`stats.start();`

To get cpu usage for last 5 mins or 300 seconds 
`stats.getCpuLast(300);`

To get memory usage for last 5 mins or 300 seconds 
`stats.getMemLast(300);`

