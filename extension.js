// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const path = require("path");
const os = require("os");
const fs = require("fs");
var exec = require("child_process").exec,
  child;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "autopyenv" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "extension.autopyenv",
    function() {
      // The code you place here will be executed every time your command is executed
      // OUR CODE HERE
      // Display a message box to the user

      // check if we are in a workspace
      let folderName = null;
      let exactPath = null;
      if (vscode.workspace) {
        exactPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
        folderName = exactPath.split(path.sep)[
          exactPath.split(path.sep).length - 1
        ];

        vscode.window.showInformationMessage(`Found Workspace ${folderName}`);
      } else {
        vscode.window.showErrorMessage("No Workspace found, no folder open");
      }

      // if we found foldername then start using the shell commands
      let defaultShell = null;
      if (folderName) {
        //check for .vscode folder
        let dotVscodeFolder = path.join(exactPath, ".vscode");
        if (fs.existsSync(dotVscodeFolder)) {
          // create a terminal with name as foldername+Environment
          defaultShell = vscode.window.createTerminal(
            `${folderName} Environment`
          );
          defaultShell.sendText(`python3 -m venv ${dotVscodeFolder}`);
          //if defaultShell
          console.log(`${defaultShell}`);
        } else {
          vscode.window.showErrorMessage(".vscode folder not found");
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate
};
