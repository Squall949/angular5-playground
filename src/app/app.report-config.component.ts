import { Component, OnInit, EventEmitter, Output, Input, AfterViewInit} from '@angular/core';
import { AtmReportService } from './atm-report.service';

@Component({
  selector: 'app-report-config',
  templateUrl: './app.report-config.component.html',
  styleUrls: ['./app.report-config.component.scss']
})
export class AppReportConfigComponent implements OnInit, AfterViewInit  {
  @Output() submitConfig = new EventEmitter<object>();
  @Input() InstanceIndexListMap: Map<string, number>;

  selected = 'recently';
  time_duration = 'period';
  time_length = 'daily';
  current_checked = true;
  unit_prefix = 'auto';
  counter = '1';
  group: Array<object>;
  topN: Array<object>;
  selectedTopN: string;
  displayTime: string;
  selectedTime = 'now';
  formatString = 'HH:00';
  interval = 60;
  originGroup: Array<object>;
  selectedName: string;
  topN_Map: Map<string, string>;
  displayTimeSetting = false;

  constructor(private atmReport: AtmReportService) {}

  getDisplayTime(msTime) {
    const date = new Date(msTime);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:00`;
  }

  getReportTime(msTime) {
    const date = new Date(msTime);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:00`;
  }

  getGroupOfSub(data) {
    this.originGroup = [...data];
    this.group = [...data];
    const recently = Object.assign({}, this.group[this.group.length - 1], {group_id: 'recently', group_name: 'Recently Added List'});
    const all = {group_id: 'all', group_name: 'All Sub-Network'};
    this.group.unshift(all);
    this.group.unshift(recently);
  }

  getTopNOfSub(data) {
    this.topN = [...data];
    this.selectedTopN = this.topN[0]['index'];
    this.topN_Map = new Map<string, string>();
    for (const item of data) {
      this.topN_Map.set(item.index, item.name);
    }
  }

  getRptInstanceIndexList(selected) {
    const list = [];

    if (selected === 'recently') {
      const item = this.originGroup[this.originGroup.length - 1];
      for (let i = 0; i < item['members'].length; i++) {
        list.push(this.InstanceIndexListMap.get(item['members'][i]));
      }
      this.selectedName = 'Recently Added List';
    }
    else if (selected === 'all') {
      this.InstanceIndexListMap.forEach(function(value, key) {
        list.push(value);
      });
      this.selectedName = 'All Sub-Network';
    } else {
      for (const item of this.originGroup) {
        if (item['group_id'] === selected) {
          this.selectedName = item['group_name'];
          for (let i = 0; i < item['members'].length; i++) {
              list.push(this.InstanceIndexListMap.get(item['members'][i]));
          }
          break;
        }
      }
    }

    return list;
  }

  ngOnInit(): void {
    this.atmReport.getGroupOfSub().then((data) => {
      this.getGroupOfSub(data);
    });

    this.atmReport.getTopNOfSub().then((data) => {
      this.getTopNOfSub(data);
    });

    const current = +new Date();
    this.displayTime = this.getDisplayTime(current - 82800000);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.onSubmit();
    }, 1500);
  }

  onGroupChange(event) {
    this.selected = event.value;
  }

  onTopNChange(event) {
    this.selectedTopN = event.value;
  }

  onCurrentChange(event) {
    this.displayTimeSetting = !event.checked;
  }

  onSubmit() {
    if (this.selected === 'recently' && this.originGroup.length === 0) {
      return;
    }

    const args = {};
    const statisticList = ['average', 'maximum', 'last', 'total', 'percentile'];
    const trafficTypeList = ['sum', 'out', 'in'];
    const fieldCondition = [];
    args['startTime'] = this.getReportTime(+new Date(this.displayTime));
    args['startTimeUntil'] = this.getReportTime(+new Date());
    args['objectIndex'] = 6;
    args['instanceIndexList'] = this.getRptInstanceIndexList(this.selected);
    args['topNIndex'] = +this.selectedTopN;
    args['counterIndex'] = +this.counter;
    args['statisticList'] = statisticList;
    args['trafficTypeList'] = trafficTypeList;
    fieldCondition.push([]);
    args['fieldCondition'] = fieldCondition;
    args['percentile'] = 95;
    args['granularity'] = '1 hour';
    args['sortBy'] = {'statistic': 'average', 'trafficType': 'sum'};
    args['depth'] = 1;

    // console.log(args);
    this.submitConfig.emit({args, selectedName: this.selectedName, topN_name: this.topN_Map.get(this.selectedTopN)});
  }

}
