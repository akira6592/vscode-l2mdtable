import * as vscode from 'vscode';

const msg901: string = "Select strings to convert to markdown.";  // for not selected
const msg902: string = "Select valid markdown ranges."; // for invalid format
const msg903Base: string = "Invalid lines: "; // for invalid format

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('l2mdtable.convert', () => {

		let editor = vscode.window.activeTextEditor;

		if ((editor !== undefined) && (editor.selection !== undefined)) {
			//valid format

			let selectedText: string = editor.document.getText(editor.selection);
			let selectedTextWithLine = getSelectedWithLine(editor);
			// LF(1) / CRLF(2)
			let eol: number = editor.document.eol;

			// validate
			let invalidLine: number[] = validateMarkdown(selectedTextWithLine);
			let isEmpty: boolean = checkEmpty(selectedText);

			if ((invalidLine.length === 0) && (isEmpty === false)) {
				// string to netsted array
				let nestedStringArray: string[][] = new Array();
				nestedStringArray = getNetedArray(selectedText);

				// netsted array to table
				let tableString: string = "";
				tableString = getTableString(nestedStringArray, eol);

				// replace 
				replaceContent(editor, tableString);
			} else if(isEmpty){
				// strings are selected but space or CR/LF only

				notify(msg901);

			} else {
				// invalid format

				notify(msg902 + msg903Base + invalidLine.join(", "));
			}
		} else {
			// not selected

			notify(msg901);
		}
	});

	context.subscriptions.push(disposable);

}

export function checkEmpty(str: string): boolean {

	if (str.match(/^[ \r\n]*$/)) {
		return true;
	} else if(str.match(/^-.*$/))  {
		// parant has no childs (one line)
		return true;
	} else if(str.match(/^[ \r\n]*-.*\r?\n[ \r\n]*$/))  {
		// parant has no childs (multiline lines)
		return true;
	} else {
		return false;
	}

}

export function getSelectedWithLine(editor: vscode.TextEditor): {line: number; text: string}[]  {
		
		let selectedWithLine: {line: number; text: string}[] = new Array();
		let selectedRange: string[] = editor.document.getText(editor.selection).split(/\n/);
		let line: number;

		for (let i in selectedRange) {
			line = editor.selection.start.line + 1 + Number(i);
			selectedWithLine.push({line: line, text: selectedRange[i]});
		}

		// list of hash
		return selectedWithLine;
}

export function validateMarkdown(selected: {line: number; text: string}[] ): number[] {

	let hasParent: boolean = false;
	// let valid: boolean = true; 
	let invalidLine: number[] = new Array();

	for (let i in selected) {

		// format check
		if (selected[i].text.match(/^-.*/)) {
			// parent line (row level line)
			hasParent = true;
		} else if (selected[i].text.match(/^ +- +(.*)/)) {
			// child line (column level line)

			if (hasParent) {
				continue;

			} else {
				// no parants
				invalidLine.push(selected[i].line);
			}

		} else if (selected[i].text.match(/^ *$/)) {
			// empty or space only line
			// ignore

		} else {
			// invalid format
			invalidLine.push(selected[i].line);
		}
	}

	return invalidLine;
}

export function getNetedArray(str: string): string[][] {

	let flatStringArray = str.split(/\n/);
	// rows and columns
	let nestedStringArray: string[][] = new Array();
	let rowIndex = -1;

	for (let i in flatStringArray) {

		let matchedRow = flatStringArray[i].match(/^- ?.*/);
		let matchedCol = flatStringArray[i].match(/^ +- +(.*)/);

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

