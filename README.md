# autopyenv

This extension lets you create and manage a virtual environment for your python project. Ideal for developers working in large teams who manages a lot of python packages.

This extension will also detect the python version if your python project contains `setup.py`. Also if you are starting a new project you can setup default python version in the setting.

By default it utilizes pythons built in virtual environemt module so there is no extra dependencies to be installed. Support for `Anaconda` and other virtualization modules is planned in the next release.

## Features

It works by checking if you have `.vscode` directory in your current working directory. If there is no `.vscode` directory, it will create that directory and create a virtual environment in that directory. However, you have the ability to customize this setting and add your own directory if you so desire.

To activate `autopyenv`, you first need to be inside your desired directory where you would like `autopyenv` to create a virtual environment for you and then press `ctrl+shift+p` for linux and windows and `⇧⌘P, F1` on mac os to bring up command palette, then type `autopyenv` and hit enter to create a new environment in the current directory. 

![activate](https://github.com/jdvala/autopyenv/blob/master/vscode_1.gif)

If you already have create an environment using `autopyenv` then you can follow the above command and it will ask you if you want to activate the environment present in your `.vscode` directory or other directory if you have selected your own directory from settings.


![activate](https://github.com/jdvala/autopyenv/blob/master/vscode_2.gif)

## Extension Settings

This extension contributes the following settings:

* `autopyenv.configFolder`: sets new directory for environment
* `autopyenv.pythonVersion`: sets default python version
## Requirements

This extension requires vscode enginee version `1.41.0` or higher