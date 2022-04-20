#include <iostream>
#include <chrono>
#include <thread>

int main()
{
    using namespace std::chrono_literals;
    std::cout << "[START]" << std::endl;

    int iterations = 100;
    for (int i = 0; i < iterations; ++i)
    {
        std::cout << "[STEP] " << i << std::endl;
        // auto start = std::chrono::high_resolution_clock::now();
        std::this_thread::sleep_for(1s);
        // auto end = std::chrono::high_resolution_clock::now();
        // std::chrono::duration<double, std::milli> elapsed = end - start;
    }

    std::cout << "[END]" << std::endl;
}