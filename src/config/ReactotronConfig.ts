import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';

const reactotron = Reactotron.configure({
  name: 'Reminder',
})
  .useReactNative()
  .use(reactotronRedux())
  .connect();

if (__DEV__) {
  reactotron.clear?.();
}

export default reactotron;