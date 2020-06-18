import './global';
import React from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Image,
  TouchableHighlight,
  Alert
} from 'react-native';
const Caver = require('caver-js');
const eoa = "0xD85FCeCE453d605afcbf6924C3Bc803060161C36";

interface States {
  latestBlock: number
  balance: number
}

export default class App extends React.Component<{}, States> {
  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      latestBlock: -1,
      balance: 9.999,
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

    setInterval(refresh, 5000);
  }

  render() {
    const latestBlockNumber = this.state.latestBlock;
    const balance = this.state.balance;

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

        <View>
          <TouchableHighlight style={styles.button} onPress={() => Alert.alert('TBA')}>
            <Text>Kakao Login</Text>
          </TouchableHighlight>
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
