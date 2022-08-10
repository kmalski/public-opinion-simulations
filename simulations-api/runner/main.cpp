#include <iostream>
#include <memory>
#include <stdexcept>
#include <string>
#include <PODSL.h>

std::unique_ptr<ModelBase> createModel(std::string_view modelName, Graph const& graph);

/**
* argv[1] - model name
* argv[2] - iterations
* argv[3] - input graph file name
* argv[4] - output graph file name
* argv[5] - output info file name
*/
int main(int argc, char *argv[])
{
    Graph graph;
    graph.load(std::string(argv[3]));

    auto model = createModel(std::string(argv[1]), graph);

    Simulation simulation(*model);
    simulation.enableAverageOpinion();

    int iterations = 100;
    iterations = std::atoi(argv[2]);
    simulation.setMaxIterations(iterations);

    simulation.startSimulation();

    graph = model->getGraph();
    graph.save(std::string(argv[4]));
    simulation.saveResultInfoToFile(std::string(argv[5]));
    std::cout << "[FILE]" << std::endl;

    std::cout << "[END]" << std::endl;
}

std::unique_ptr<ModelBase> createModel(std::string_view modelName, Graph const& graph)
{
    if (modelName == "MajorityModel")
        return std::make_unique<MajorityModel>(graph);
    else if (modelName == "VoterModel")
        return std::make_unique<VoterModel>(graph);
    else if (modelName == "SznajdModel")
        return std::make_unique<SznajdModel>(graph);
    else
        throw std::logic_error("Unsupported model");
}