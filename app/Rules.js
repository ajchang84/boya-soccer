import React, { PureComponent } from "react";
import { StyleSheet, Text, ImageBackground, TouchableWithoutFeedback, View } from "react-native";

export default class Rules extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  back() {
    this.props.navigation.goBack();
  }

  render() {
    return (
      <ImageBackground style={{flex: 1}} source={require('./assets/images/teach.png')}>
        <TouchableWithoutFeedback onPress={()=>this.back()}>
          <View style={styles.container}>
            <Text style={{color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 30}} >游戏规则</Text>
            <Text style={{color: '#fff', fontSize: 17, lineHeight: 22}} >以手指滑动方向控制足球來闪躲敌对选手的撞击，並在过程中蒐集得分物件，當足球撞击到敌对选手一次，该场游戏结束。</Text>
          </View>
        </TouchableWithoutFeedback>
      </ImageBackground>
    );
  }
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 53,
    paddingHorizontal: 65
  }
});