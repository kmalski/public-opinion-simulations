cmake_minimum_required(VERSION 3.13.0)

project(Runner)

###### Build configuration ######
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

file(MAKE_DIRECTORY ${CMAKE_BINARY_DIR}/graphs)

add_subdirectory("PODSL")

add_executable(${PROJECT_NAME} main.cpp)

target_link_libraries(${PROJECT_NAME}
    PRIVATE
    PODSL::PODSL
)