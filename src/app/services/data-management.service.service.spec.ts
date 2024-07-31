import { TestBed } from '@angular/core/testing';

import { DataManagementService } from './data-management.service.service';

describe('DataManagementServiceService', () => {
  let service: DataManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
