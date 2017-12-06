import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class AtmReportService {

  constructor(private http: HttpClient) { }

  getVersion() {
    this.http.get('/services/api/version').subscribe(data => {
      // Read the result field from the JSON response.
      console.log(data);
    });
  }

  getGroupOfSub() {
    const promise = new Promise((resolve, reject) => {
      this.http.get('/api/config/export/group/subnetwork/?request={"display_data":"yes"}')
        .toPromise()
        .then(
          res => { // Success
            if (res['response'].status === 'succ') {
              resolve(res['response'].result.data);
            }
          }
        );
      });
      return promise;
  }

  getTopNOfSub() {
    const promise = new Promise((resolve, reject) => {
    this.http.get('/api/config/export/topn/subnetwork/?request={"display_data":"yes"}')
      .toPromise()
      .then(
        res => { // Success
          if (res['response'].status === 'succ') {
            resolve(res['response'].result.data);
          }
        }
      );
    });
    return promise;
  }

  getSubnetwork() {
    const promise = new Promise((resolve, reject) => {
      this.http.get('/api/config/export/subnetwork/?request={"display_data":"yes"}')
        .toPromise()
        .then(
          res => { // Success
            if (res['response'].status === 'succ') {
              resolve(res['response'].result);
            }
          }
        );
      });
      return promise;
  }

  postReportJob(args) {
    const body = {};
    const req = [];
    const param = {};
    param['service'] = 'breakdown';
    param['args'] = args;
    req.push(param);
    body['request'] = req;

    const promise = new Promise((resolve, reject) => {
      this.http.post('/services/atm-report/jobs', body)
      .toPromise()
      .then(
        res => { // Success
          if (res['result'] === 'ok') {
            resolve(res['jobId']);
          }
        }
      );
    });
    return promise;
  }

  getReport(jobId) {
    const promise = new Promise((resolve, reject) => {
      this.http.get('/services/atm-report/results/' + jobId)
      .toPromise()
      .then(
        res => { // Success
          if (res['result'] === 'ok') {
            resolve(res['report']);
          }
        }
      );
    });
    return promise;
  }
}
