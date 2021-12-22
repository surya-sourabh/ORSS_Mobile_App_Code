import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {


  selectedDevices: any = {};
  removedDevices: any = {};
  deviceState: any;


  setSelectedDevices(deviceData) {
    this.selectedDevices[deviceData.deviceId] = deviceData;
    delete this.removedDevices[deviceData.deviceId];
  }

  removeSelectedDevices(deviceData) {
    delete this.selectedDevices[deviceData.deviceId];
    this.removedDevices[deviceData.deviceId] = deviceData;
  }

  getSelectedDevices() {
    return this.selectedDevices;
  }

  getRemovedDevices() {
    return this.removedDevices;
  }


  resetSelectedDevices() {
    this.selectedDevices = {};
    this.removedDevices = {};
  }

  setMessage(newMessage) {
    this.deviceState = newMessage
  }

  getMessage() {
    return this.deviceState
  }
  constructor() { }
}
