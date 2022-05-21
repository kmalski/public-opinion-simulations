#include <iostream>
#include <fstream>
#include <sstream>
#include <chrono>
#include <thread>
#include <string>
#include <cmath>
#include <algorithm>

std::string readFile(std::string filename);
void writeChanges(int iterations);
void writeResultToFile(std::string const &filename, std::string &input, int iterations);

int main(int argc, char *argv[])
{
    using namespace std::chrono_literals;

    int iterations = 100;
    if (argc >= 3 && std::string(argv[1]) == "-i")
    {
        iterations = std::atoi(argv[2]);
    }

    std::string input;
    if (argc >= 5 && std::string(argv[3]) == "-g")
    {
        input = readFile(std::string(argv[4]));
    }

    std::cout << "[START] Iterations: " << iterations << ", args: " << argc << std::endl;

    if (argc >= 7 && std::string(argv[5]) == "-o")
    {
        std::string filename = std::string(argv[6]);
        writeResultToFile(filename, input, iterations);
    }
    if (argc >= 8 && std::string(argv[7]) == "--verbose")
    {
        writeChanges(iterations);
    }

    std::cout << "[END]" << std::endl;
}

std::string readFile(std::string filename)
{
    std::ifstream file(filename);
    std::stringstream buffer;
    buffer << file.rdbuf();
    return buffer.str();
}

void writeChanges(int iterations)
{
    int opinion = 1;
    for (int i = 1; i <= iterations; ++i)
    {
        opinion = opinion == 1 ? -1 : 1;
        std::string update =
            std::string("{") +
            "\"step\":" + std::to_string(i) + "," +
            "\"changes\":[{\"node\":\"a\",\"opinion\":" + std::to_string(opinion) + "}]," +
            "\"stats\":[{\"name\":\"average-opinion\",\"values\": [" + std::to_string(opinion) + "]}]" +
            "}";

        std::cout << "[STEP] " << update << std::endl;
    }
}

void replaceAll(std::string &str, const std::string &from, const std::string &to)
{
    size_t start_pos = 0;
    while ((start_pos = str.find(from, start_pos)) != std::string::npos)
    {
        str.replace(start_pos, from.length(), to);
        start_pos += to.length(); // Handles case where 'to' is a substring of 'from'
    }
}

void writeResultToFile(std::string const &filename, std::string &input, int iterations)
{
    replaceAll(input, "\n", "\\n");
    replaceAll(input, "\"", "\\\"");
    std::ofstream file;
    file.open(filename);

    file << "{";
    file << "\"step\":" + std::to_string(iterations) + ",";
    file << "\"graph\": \"" + input + "\",";
    file << "\"stats\":[{\"name\":\"average-opinion\",\"values\": [";

    std::string values = "";
    for (int i = 1; i <= iterations; ++i)
    {
        values += std::to_string(1 * std::pow(-1, i));
        if (i != iterations)
            values += ",";
    }

    file << values;
    file << "]}]";
    file << "}";

    file.close();
    std::cout << "[FILE]" << std::endl;
}
