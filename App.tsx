import './global';
import React, { useCallback } from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  Linking,
  Button,
  Alert,
  View,
} from 'react-native';
const Caver = require('caver-js');
const eoa = "0xD85FCeCE453d605afcbf6924C3Bc803060161C36";
const supportedURL = "https://google.com";
const unsupportedURL = "slack://open?team=123456";

interface States {
  latestBlock: number
  balance: number
}

const OpenURLButton = ({ url, children }) => {
  const handlePress = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);

  return <Button title={children} onPress={handlePress} />;
};

export default class App extends React.Component<{}, States> {
  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      latestBlock: -1,
      balance: 1.0,
    }
  }

  componentDidMount() {
    const caver = new Caver('https://api.baobab.klaytn.net:8651/');

    let refresh = () => {
      caver.klay.getBlock('latest').then((latestBlock: any) => {
        this.setState({ latestBlock: caver.utils.hexToNumber(latestBlock.number) })
      })
      caver.klay.getBalance(eoa).then((balance: any) => {
        this.setState({ balance: caver.utils.fromPeb(balance) })
      })
    }
    refresh()
  }

  render() {
    const latestBlockNumber = this.state.latestBlock;
    const balance = this.state.balance;
    const openURLButton = () => Linking.openURL('kakaotalk://klipwallet/open?url=https://klip.qa.klaytn.com/?target=/token/2/send')


    return (
      <SafeAreaView style={styles.container}>
        <Image style={styles.stretch}
          source={require('./assets/klip.png')}
        />
        <Text></Text>
        <Text>* EOA: {eoa}</Text>
        <Text></Text>
        <Text>* Your KLAY: {balance}</Text>
        <Text></Text>
        <Text>* Latest BN: {latestBlockNumber}</Text>
        <Text></Text>
        <View style={styles.container}>
          <OpenURLButton url={supportedURL}>Open Supported URL</OpenURLButton>
          <OpenURLButton url={unsupportedURL}>Open Unsupported URL</OpenURLButton>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    flex: 1,
    margin: 0,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#FFFF00",
    padding: 20
  },
  stretch: {
    width: 415,
    height: 400,
  },
});
