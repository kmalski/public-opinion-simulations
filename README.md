# Public Opinion Simulations
Web application for managing public opinion simulations and visualization of results

M.Sc. Diploma project (2021/2022) by Konrad.Malski@fis.agh.edu.pl

## Quick start
The project consists of two applications that can be found in the directories with the respective names.
To run the application locally, it is best to use the [Docker](https://www.docker.com) platform. 
Simply run `docker compose up --build` to lunch all the applications at once. 
Then navigate to http://localhost:3000 and run your first public opinion simulation.

Add `-d` flag to previous command if you want to run applications in the background. 
You can omit `--build` flag if there were no changes between runs.