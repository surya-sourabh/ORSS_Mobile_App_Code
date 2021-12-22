import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddDeviceToChannelPage } from './add-device-to-channel.page';

describe('AddDeviceToChannelPage', () => {
  let component: AddDeviceToChannelPage;
  let fixture: ComponentFixture<AddDeviceToChannelPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDeviceToChannelPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddDeviceToChannelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
