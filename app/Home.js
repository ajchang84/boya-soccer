import React, { PureComponent } from "react";
import { StyleSheet, ImageBackground, View, TouchableOpacity, StatusBar } from "react-native";

export default class Home extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  handleNavigations(routename) {
    this.props.navigation.navigate(routename)
  }

  render() {
    return (
      <ImageBackground style={{flex: 1}} source={require('./assets/images/homepage.png')}>
        <View style={styles.container}>
          <TouchableOpacity style={{marginBottom: 10}} onPress={()=>this.handleNavigations('Game')}>
            <ImageBackground style={{width: 245, height: 60}} source={require('./assets/images/btn01Start.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.handleNavigations('Rules')}>
            <ImageBackground style={{width: 245, height: 60}} source={require('./assets/images/btn01Teach.png')} />
          </TouchableOpacity>
        </View>
        <StatusBar hidden={true} />
      </ImageBackground>
    );
  }
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 42
  }
});