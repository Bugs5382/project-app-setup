# Project Application Setup
This app creates my standard app setup for the following types:

## Install

Install using NPM:
```
npm install @the-rabbit-hole/app-setup -g
```

## Selection Types

### NodeJS
* Fastify Controller
* Fastify Microservice (**default**)
* Fastify Standalone Plugin Package
* Standalone NPM Package

### Vite
* Vite with React + SWC

### Replacement Vars

Used within any UTF-8 file.

| **Replacement Search** |     **Used for**     | **Should be on replacement...** |
|:----------------------:|:--------------------:|---------------------------------|
|       <%- npm %>       |                      | The full NPM package name.      |
|  <%- gitHubAuthor %>   | GitHub Projects Only | GitHub Username of Author.      |
|     <%- author %>      |                      | Full Name of Initial Author     |
|   <%- description %>   |                      | Description of the package.     |
|    <%- homepage %>     |                      | Full URL                        |

## Contribute

Not sure if you want to, but you can if you want. Fork it over and personalize it for your own use.

## Acknowledgements

* Thanks to [Jason Walton](https://github.com/jwalton/create-ts-app) for his project startup and setup. I based it off his code. :partying_face: 
* Thanks to [Jozef Izso](https://github.com/jozefizso) for his licence generator which has been re-done for this code. :+1:

## License

Licensed under [MIT](LICENSE).