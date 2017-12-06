import { Component, OnInit} from '@angular/core';
import { AtmReportService } from './atm-report.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';
  args = {};
  reportData: object;
  InstanceIndexListMap: Map<string, number>;
  indexNameMap: Map<number, string>;
  columnNameArray = [];
  category = 'Sub-Network';

  constructor(private atmReport: AtmReportService) {
    this.reportData = {};
    this.reportData['columnList'] = [];
    this.reportData['sum_average'] = [];
  }

  ngOnInit(): void {
    this.atmReport.getSubnetwork().then((result) => {
      // construct InstanceIndexListMap
      this.InstanceIndexListMap = new Map<string, number>();
      this.indexNameMap = new Map<number, string>();
      for (const item of result['data']) {
        this.InstanceIndexListMap.set(item.name, +item.id);
        this.indexNameMap.set(+item.id, item.name);
      }
    });
  }

  onSubmit(event) {
    this.args = Object.assign(this.args, event.args);
    this.atmReport.postReportJob(this.args).then((jobId) => {
      setTimeout(() => {
        this.atmReport.getReport(jobId).then((data) => {
          this.reportData = {};
          // displayedColumns
          this.reportData['columnList'] = [this.category];

          if (!data['response'][0].data) {
            return;
          }
          for (const column of data['response'][0].data.columnData) {
            this.reportData['columnList'].push(column[0]);
            this.columnNameArray.push(column[0]);
          }

          this.organizeReport(data['response'][0].data);
          this.reportData['selectedGroup'] = event.selectedName;
          this.reportData['selectedTopN'] = event.topN_name;
          console.log(this.reportData);
        });
      }, 1000);
    });
  }

  organizeReport(report) {
    for (const dataSet of report.dataSet) {
      const set = [];
      for (let rowNum = 0; rowNum < dataSet.data.length; rowNum++) {
        const rowData = {};
        rowData[this.category] = this.indexNameMap.get(+report.rowData[rowNum]);
        const dataSet_rowData = dataSet.data[rowNum];
        for (let columnNum = 0;  columnNum < dataSet_rowData.length; columnNum++) {
          const columnName = this.columnNameArray[columnNum];
          if (dataSet_rowData[columnNum]) {
            if (+dataSet_rowData[columnNum] / 1000 > 1) {
              rowData[columnName] = (+dataSet_rowData[columnNum]  / 1000).toFixed(2) + 'K';
            } else if (+dataSet_rowData[columnNum] / 1000000 > 1) {
              rowData[columnName] = (+dataSet_rowData[columnNum]  / 1000000).toFixed(2) + 'M';
            } else if (+dataSet_rowData[columnNum] / 1000000000 > 1) {
              rowData[columnName] = (+dataSet_rowData[columnNum]  / 1000000000).toFixed(2) + 'G';
            } else {
              rowData[columnName] = +dataSet_rowData[columnNum].toFixed(2);
            }
          } else {
            rowData[columnName] = dataSet_rowData[columnNum];
          }
        }
        set.push(rowData);
      }
      this.reportData[`${dataSet.trafficType}_${dataSet.statistic}`] = set;
    }
  }
}
