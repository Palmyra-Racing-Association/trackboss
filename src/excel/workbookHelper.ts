import * as ExcelJS from 'exceljs';

function formatWorkbook(worksheet: ExcelJS.Worksheet) {
    // do various formatting things.
    // part one: bold headers
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.alignment = { wrapText: true };

    // part 2: stripe rows alternating between white and sliver, and add
    // borders to make it look pretty!
    for (let index = 2; index <= worksheet.rowCount; index++) {
        const currentRow = worksheet.getRow(index);
        currentRow.height = 31;
        let rowColor = 'FFFFFF';
        if (index % 2) {
            rowColor = 'D9D8D8';
        }
        currentRow.alignment = { wrapText: true };
        currentRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: rowColor },
        };
        currentRow.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        };
    }
}

function startWorkbook(title: string) {
    // Create workbook and some meta datars about it.
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Palmyra Racing Association - Track Boss';
    workbook.created = new Date();
    workbook.addWorksheet(title,
        {
            pageSetup: { orientation: 'landscape' },
        },
    );
    return workbook;
}

export { formatWorkbook, startWorkbook };
