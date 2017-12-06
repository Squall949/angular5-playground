import { TestBed, inject } from '@angular/core/testing';

import { AtmReportService } from './atm-report.service';

describe('AtmReportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AtmReportService]
    });
  });

  it('should be created', inject([AtmReportService], (service: AtmReportService) => {
    expect(service).toBeTruthy();
  }));
});
