import {Component, Input, OnInit, SimpleChanges, SimpleChange, Output, EventEmitter} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import { OnChanges, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

/**
 * @title Basic table
 */
@Component({
  selector: 'app-table',
  styleUrls: ['app.table.component.scss'],
  templateUrl: 'app.table.component.html'
})
export class AppTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() data: object;
  @Output() submitConfig = new EventEmitter<object>();

  granularity = '1 hour';
  traffic = 'sum';
  statistic = 'average';
  displayedColumns: string[];
  dataSource: MatTableDataSource<object>;
  toFromSet = new Map<string, object[]>();
  category = 'Sub-Network';

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {
    this.toFromSet.clear();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      console.log(this.data);
      this.toFromSet.clear();
      this.displayedColumns = this.data['columnList'];
      if (this.data.hasOwnProperty(`${this.traffic}_${this.statistic}`)) {
        this.dataSource = new MatTableDataSource([...this.data[`${this.traffic}_${this.statistic}`]]);
      } else {
        if (this.traffic === 'to_from') {
          this.dataSource = new MatTableDataSource(this.getToFromData(this.statistic));
        } else {
          this.dataSource = new MatTableDataSource([]);
        }
      }
    }
  }

  onTrafficTypeChange(event) {
    if (event.value === 'to_from') {
      this.dataSource = new MatTableDataSource(this.getToFromData(this.statistic));
    } else {
      this.dataSource = new MatTableDataSource([...this.data[`${event.value}_${this.statistic}`]]);
    }
  }

  onStatisticChange(event) {
    if (this.traffic === 'to_from') {
      this.dataSource = new MatTableDataSource(this.getToFromData(event.value));
    } else {
      this.dataSource = new MatTableDataSource([...this.data[`${this.traffic}_${event.value}`]]);
    }
  }

  getToFromData(statistic): Array<object> {
    if (this.toFromSet.has(`to_from_${statistic}`)) {
      return this.toFromSet.get(`to_from_${statistic}`);
    }

    const inFlow = this.data[`in_${this.statistic}`];
    const outFlow = this.data[`out_${this.statistic}`];
    const newFlow = [];

    for (let i = 0; i < inFlow.length; i++) {
      const inRow = inFlow[i];
      const outRow = outFlow[i];
      const newRow = {};
      for (const item in inRow) {
        if (item === this.category) {
          newRow[item] = inRow[item];
        } else {
          if (inRow[item] !== null && outRow[item] !== null) {
            newRow[item] = inRow[item] + '  |  ' + outRow[item];
          } else if (inRow[item] !== null || outRow[item] !== null) {
            if (inRow[item] === null) {
              newRow[item] = '-  |  ';
            } else { // inRow[item] = 0
              newRow[item] = inRow[item] + '  |  ';
            }
            if (outRow[item] === null) {
              newRow[item] += '-';
            } else { // outRow[item] = 0
              newRow[item] += outRow[item];
            }
          } else {
            newRow[item] = null;
          }
        }
      }
      newFlow.push(newRow);
    }

    this.toFromSet.set(`to_from_${this.statistic}`, newFlow);
    return newFlow;
  }

  onGranularityChange(event) {
    const args = {};
    args['granularity'] = event.value;

    this.submitConfig.emit({args, selectedName: this.data['selectedGroup'], topN_name: this.data['selectedTopN']});
  }
}
