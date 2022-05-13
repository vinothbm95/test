import { string } from "@amcharts/amcharts4/core";
import { Injectable } from "@angular/core";
import * as Xlsx from 'xlsx';
// import * as jsPDF from 'jspdf';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'



const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

export interface ExportColumn {
  name: string;
  field: string;
  width?: number;
}

export interface ExportOptions {
  columns: ExportColumn[];
  rows: any[];
  fileName: string;
  dateFormat?: string | number;
}

// interface jsPDFWithPlugins extends jsPDF{
//   autotable :(options: userOptions) => jsPDF;
// }
@Injectable({
  providedIn: 'root'
})
export class ExportAsService {

  TableHeader = [];

  exportAsCsv(options: ExportOptions) {
    const table = this.createTable(options);
    const worksheet: Xlsx.WorkSheet = Xlsx.utils.table_to_sheet(table, { dateNF: options.dateFormat });
    console.log('worksheet', worksheet);
    const a = document.createElement('a') as HTMLAnchorElement;
    document.body.appendChild(a);
    a.href = 'data:text/csv;charset=utf-8,' + escape(Xlsx.utils.sheet_to_csv(worksheet));;
    a.download = `${options.fileName}_export_${new Date().getTime()}.csv`;
    a.click();
    window.URL.revokeObjectURL(a.href);
    document.body.removeChild(a);
  }

  exportAsXlsx(options: ExportOptions) {
    const table = this.createTable(options);
    const worksheet: Xlsx.WorkSheet = Xlsx.utils.table_to_sheet(table, { dateNF: options.dateFormat});
    const cell: Xlsx.CellObject = worksheet["A1"];
    cell.s = {
      patternType: 'solid',
      fgColor: { theme: 8, tint: 0.3999755851924192 }
    };
    const cols : Xlsx.ColInfo[]= [];
    // column width
    options.columns.forEach(c => {
      if(c.width){
        cols.push({wch: c.width});
        return;
      }
      cols.push({wch: c.name.length});
    });
    console.log('worksheet', worksheet);
    worksheet["!cols"] = cols;
    const workbook: Xlsx.WorkBook = { Sheets: { 'data': worksheet, }, SheetNames: ['data'] };
    const excelBuffer: any = Xlsx.write(workbook, { cellStyles: true, bookType: 'xlsx', type: 'array' });

    const blob: Blob = new Blob([excelBuffer], {
      type: EXCEL_TYPE
    });
    const a = document.createElement('a') as HTMLAnchorElement;
    document.body.appendChild(a);
    a.href = window.URL.createObjectURL(blob);
    a.download = `${options.fileName}_export_${new Date().getTime()}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(a.href);
    document.body.removeChild(a);
  }

  private createTable(options: ExportOptions) {
    
    console.log(options);
    
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const columns = options.columns;
    const header = document.createElement('tr');
    columns.forEach(c => {
      const th = document.createElement('th');
      th.style.fontWeight = 'bold';
      th.innerText = c.name;
      header.appendChild(th);
    });
    thead.appendChild(header);
    table.appendChild(thead);
    options.rows.forEach(r => {
      const tr = document.createElement('tr');
      columns.forEach(c => {
        const td = document.createElement('td');
        const value = r[c.field];
        if (value)
          td.innerText = value;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    // const doc=new jsPDF();

    // autoTable(doc, { html: table })
    // doc.save('table.pdf')

    return table;

  }
  exportaspdf(options: ExportOptions){
   
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const columns = options.columns;
    const header = document.createElement('tr');
    columns.forEach(c => {
      const th = document.createElement('th');
      th.style.fontWeight = 'bold';
      th.innerText = c.name;
      header.appendChild(th);
    });
    thead.appendChild(header);
    table.appendChild(thead);
    options.rows.forEach(r => {
      const tr = document.createElement('tr');
      columns.forEach(c => {
        const td = document.createElement('td');
        const value = r[c.field];
        if (value)
          td.innerText = value;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    const doc=new jsPDF();
    autoTable(doc, { html: table })
    // doc.save('table.pdf')
    let download = `${options.fileName}_export_${new Date().getTime()}.pdf`;
    doc.save(download);

    return table;

  }
  
}
