import * as vscode from 'vscode';

const msg901: string = "Select strings to convert to markdown.";  // for not selected
const msg902: string = "Select valid markdown ranges."; // for invalid format

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('l2mdtable.convert', () => {

		let editor = vscode.window.activeTextEditor;

		if ((editor !== undefined) && (editor.selection !== undefined)) {
			//valid format

			let selectedText: string = editor.document.getText(editor.selection);
			// LF(1) / CRLF(2)
			let eol: number = editor.document.eol;

			// validate
			if (validateMarkdown(selectedText)) {
				// string to netsted array
				let nestedStringArray: string[][] = new Array();
				nestedStringArray = getNetedArray(selectedText);

				// netsted array to table
				let tableString: string = "";
				tableString = getTableString(nestedStringArray, eol);

				// replace 
				replaceContent(editor, tableString);
			} else {
				// invalid format

				notify(msg902);
			}
		} else {
			// not selected
			notify(msg901);
		}
	});

	context.subscriptions.push(disposable);

}

export function validateMarkdown(str: string): boolean {

	if (str.match(/^- .*(\r)*\n +- .*/) !== null) {
		// valid netsted lists

		return true;
	} else {
		// invalid format
		
		notify(msg902);
		return false;
	}

}

export function getNetedArray(str: string): string[][] {

	let flatStringArray = str.split(/\n/);
	// rows and columns
	let nestedStringArray: string[][] = new Array();
	let rowIndex = -1;

	for (let i in flatStringArray) {

		let matchedRow = flatStringArray[i].match(/^- ?.*/);
		let matchedCol = flatStringArray[i].match(/^ +- (.*)/); 

		if (matchedRow !== null) {
			// row level line
			nestedStringArray.push([]);
			rowIndex++;

		} else if (matchedCol !== null) {
			// column level line
			nestedStringArray[rowIndex].push(matchedCol[1]);
		} else {
			// igonore
		}
	}
	// split row 
	let headerSplitArray: string[] = new Array();
	for (let i = 0; i < nestedStringArray[0].length; i++ ) {
		headerSplitArray.push(":------");
	}

	// insert "|:------|:------|"
	nestedStringArray.splice(1, 0, headerSplitArray);

	return nestedStringArray;
}

export function getTableString(arr: string[][], eol: number): string {

	let tableString: string = "";
	let eolString: string = "";

	if (eol === 1) {
		eolString = "\n";
	} else {
		eolString = "\r\n";
	}

	for (let row in arr) {
		// row loop
		tableString += "|";
		for (let col in arr[row]) {
			// column loop
			tableString += arr[row][col] + "|";
		}
		tableString += eolString;
	}

	return tableString;

}

export function replaceContent(editor: vscode.TextEditor , str: string): void {

	editor.edit(edit => {
		edit.replace(editor.selection, str);
	});

}

export function notify(msg: string): void {

	vscode.window.showInformationMessage(msg);
	
}

