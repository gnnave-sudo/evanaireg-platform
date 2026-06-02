from setuptools import setup, find_packages
setup(
    name="evanaireg-platform",
    version="1.0.0",
    packages=find_packages(),
    entry_points={"console_scripts": ["evan=backend.cli.main:cli"]},
    python_requires=">=3.11",
)
