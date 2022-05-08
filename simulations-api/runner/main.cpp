#include <iostream>
#include <chrono>
#include <thread>
#include <string>

int main(int argc, char* argv[])
{
    using namespace std::chrono_literals;

    int iterations = 100;
    if (argc >= 3 && std::string(argv[1]) == "-i") {
        iterations = std::atoi(argv[2]);
    }

    std::cout << "[START] Iterations: " << iterations << std::endl;

    int opinion = 1;
    for (int i = 0; i < iterations; ++i)
    {
        opinion = opinion == 1 ? -1 : 1;
        std::string update = "{\"step\":" + std::to_string(i) 
        + "\"changes\":[{\"node\":\"a\",\"opinion\":" + std::to_string(opinion) + "}]}";

        std::cout << "[STEP] " << update << std::endl;
        // auto start = std::chrono::high_resolution_clock::now();
        std::this_thread::sleep_for(1s);
        // auto end = std::chrono::high_resolution_clock::now();
        // std::chrono::duration<double, std::milli> elapsed = end - start;
    }

    std::cout << "[END]" << std::endl;
}