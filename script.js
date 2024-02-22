const spreadSheetContainer = document.querySelector('#spreadsheet-container');
const exportBtn = document.querySelector('#export-btn');

const ROWS = 10;
const COLS = 10;

const alphabets = [
    "A","B","C","D","E","F","G","H","I","J"
];

exportBtn.onclick = function (e){
    let csv = "";
    for(let i = 0; i < spreadsheet.l; i++){
        csv += 
            spreadsheet[i]
                .filter((item) => !item.isHeader)
                .map((item) => item.data)
                .join(",") + "\r\n"
    }

    const csvObj = new Blob([csv]);
    const csvUrl = URL.createObjectURL(csvObj);

    const a = document.createElement("a");
    a.href = csvUrl;
    a.download = "Spreadsheet File Name.csv";
    a.click();
}

const spreadsheet = [];


class Cell {
    constructor(isHeader, disabled , data , row, column , rowName,columnName, active = false){
        this.isHeader = isHeader;
        this.disabled = disabled;
        this.data = data;
        this.row = row;
        this.rowName = rowName;
        this.columnName = columnName;
        this.column = column;
        this.active = active;
    }
}




initSpreadsheet();

function initSpreadsheet(){
    for(let i = 0 ; i < ROWS; i++){
        let spreadsheetRow = [];

        for( let j = 0; j < COLS; j++){
            let cellData = '';
            let isHeader = false;
            let disabled = false;

            //Row 맨앞 부분
            if(j === 0){
                cellData = i;
                isHeader = true;
                disabled = true;
            }

            //맨 윗줄 부분
            if(i === 0){
                cellData = alphabets[j - 1];
                isHeader = true;
                disabled = true;
            }

            //왼쪽 맨위 아무것도 없기
            if(!cellData){
                cellData = "";
            }

            const rowName = i;
            const columnName = alphabets[j - 1]

            const cell = new Cell(isHeader, disabled, cellData , i , j , rowName, columnName,false);

            spreadsheetRow.push(cell);
        }
        spreadsheet.push(spreadsheetRow);
    }
    drawSheet();
}

function createCellEl(cell) {
    const cellEl = document.createElement('input');
    cellEl.className = 'cell';
    cellEl.id = 'cell_' + cell.row + cell.column;
    cellEl.value = cell.data;
    cellEl.disabled = cell.disabled;

    if(cell.isHeader){
        cellEl.classList.add('header');
    }

    cellEl.onclick = () => handleCellClick(cell);

    cellEl.onchange =(e) => handleOnChange(e.target.value, cell);

    return cellEl;
}

function handleOnChange(data, cell){
    cell.data = data;
}

function handleCellClick(cell){
    console.log('click cell', cell);

    clearHeaderActiveStatus();
    //데이터
    const columnHeader = spreadsheet[0][cell.column];
    const rowHeader = spreadsheet[cell.row][0];

    //요소
    const columnHeaderEl = getElFromRowCol(columnHeader.row,columnHeader.column);
    const rowHeaderEl = getElFromRowCol(rowHeader.row , rowHeader.column);

    columnHeaderEl.classList.add('active');
    rowHeaderEl.classList.add('active');

}

function getElFromRowCol(row,col){
    return document.querySelector("#cell_" + row + col);
}

function clearHeaderActiveStatus(){
    const headers = document.querySelectorAll('.header');
    
    headers.forEach((header) => {
        header.classList.remove('active');
    })
}

function drawSheet() {
    for(let i = 0 ; i < spreadsheet.length ;i++){
        const rowContainerEl = document.createElement('div');
        rowContainerEl.className = 'cell-row';


        for(let j = 0; j < spreadsheet[i].length; j++){
            rowContainerEl.append(createCellEl(spreadsheet[i][j]));
        }
        spreadSheetContainer.append(rowContainerEl);
    }
}


