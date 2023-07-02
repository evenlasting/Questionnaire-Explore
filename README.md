# Questionnaire Explorer

Welcome to the Questionnaire Explorer repository!

This repository contains the official implementation of the Causality-Based Visual Analysis of Questionnaire Responses. It allows for the exploration and analysis of questionnaire data using visual techniques.

The system prototype has been developed, and the code is currently undergoing optimization and organization. The backend code can be accessed at [https://github.com/evenlasting/Questionnaire-Explorer-Backend](https://github.com/evenlasting/Questionnaire-Explorer-Backend). Additionally, you can find the user study data [here](https://1drv.ms/u/s!An2JvCpKgCRaoDa3SKONUEtulOi5?e=zT4xXf).

## Project Setup

To set up the project, follow these steps:

1. Configure the backend by referring to the instructions provided in the [Questionnaire Explorer Backend repository](https://github.com/evenlasting/Questionnaire-Explorer-Backend).

2. After configuring the backend, run the following code to install the project dependencies:
   ```
   npm install
   ```

### Compiles and Hot-reloads for Development

To compile and hot-reload the project for development, perform the following steps:

1. Ensure that the backend is running.

2. Run the following code on the same machine to start the project:
   ```
   npm run serve
   ```

If you are running the frontend and backend on different machines, make sure to modify the `url` and `causalUrl` variables in the `src/store/index.js` file to reflect the corresponding IP addresses.

### Compiles and Minifies for Production

To compile and minify the project for production, execute the following command:
```
npm run build
```

This will generate a production-ready build of the project.