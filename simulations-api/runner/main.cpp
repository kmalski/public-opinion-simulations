#include <iostream>
#include <memory>
#include <stdexcept>
#include <string>
#include <PODSL.h>


/**
* argv[1] - path to config file
* argv[2] - output graph file name
* argv[3] - output info file name
*/
int main(int argc, char *argv[])
{
    std::string configPath = std::string(argv[1]);
    std::string outputGraphPath = std::string(argv[2]);
    std::string outputInfoPath = std::string(argv[3]);

    podsl::Simulation simulation{};
    simulation.readConfig(configPath);
    simulation.startSimulation();

    simulation.getGraph().save(outputGraphPath);
    simulation.saveResultInfoToFile(outputInfoPath);

    std::cout << "[FILE]" << std::endl;
    std::cout << "[END]" << std::endl;
}
