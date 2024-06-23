import { Permissions } from 'expo';
import {Platform} from 'react-native';


const askBluetoothPermissions = async () => {
  if (Platform.OS === 'ios') {
    // Ask for Bluetooth permission for iOS
    const result = await Permissions.askAsync(Permissions.IOS.BLUETOOTH_PERIPHERAL);
    if (result!== Permissions.RESULTS.GRANTED) {
      // Either permission is not granted or it's unavailable
      if (result === Permissions.RESULTS.UNAVAILABLE) {
        // If Bluetooth is off, prompt user to enable the Bluetooth manually
        return { type: 'enableBluetooth', value: false };
      } else {
        // If user denied for Bluetooth permission, prompt them to enable it from settings later
        return { type: 'bluetoothPermission', value: false };
      }
    }
    // Bluetooth permission has been granted successfully
    return { type: 'bluetoothPermission', value: true };
  } else {
    if (Platform.Version >= 30) {
      // Ask for Bluetooth permission for Android version >= 12
      if ((await Permissions.askAsync(Permissions.ANDROID.BLUETOOTH_SCAN))!== Permissions.RESULTS.GRANTED) {
        return { type: 'bluetoothPermission', value: false };
      }
      console.info('BLUETOOTH_SCAN permission allowed');
      if ((await Permissions.askAsync(Permissions.ANDROID.BLUETOOTH_CONNECT))!== Permissions.RESULTS.GRANTED) {
        return { type: 'bluetoothPermission', value: false };
      }
      console.info('BLUETOOTH_CONNECT permission allowed');
      if ((await Permissions.askAsync(Permissions.ANDROID.BLUETOOTH_ADVERTISE))!== Permissions.RESULTS.GRANTED) {
        return { type: 'bluetoothPermission', value: false };
      }
      console.info('BLUETOOTH_ADVERTISE permission allowed');
      return { type: 'bluetoothPermission', value: true };
    } else {
      // For Android version < 12, no need of runtime permissions
      return { type: 'bluetoothPermission', value: true };
    }
  }
};

export { askBluetoothPermissions };