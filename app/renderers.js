import React from "react";
import { StyleSheet, View, ImageBackground, Text } from "react-native";
import { RADIUS, FIELD_DIMENSION } from "./constants";
 
class Player extends React.Component {
  render() {
    const x = this.props.body.position.x - RADIUS;
    const y = this.props.body.position.y - RADIUS;
    const r = this.props.body.circleRadius;
    return (
      <ImageBackground source={require('./assets/images/foodball.png')} style={[styles.player, {left: x, top: y, width: r * 2, height: r * 2, borderRadius: r * 2}]} />
    );
  }
}

class Enemy extends React.Component {
  render() {
    // console.log('render')
    // let uniform = ['soccerChina','soccerBrazil','soccerGerman'][Math.floor(Math.random * 3)]
    const x = this.props.body.position.x - RADIUS - 10;
    const y = this.props.body.position.y - RADIUS - 10;
    const r = this.props.body.circleRadius + 10;
    let uniform;
    if (this.props.uniform === 0) {
      uniform = require('./assets/images/soccerChina.png')
    } else if (this.props.uniform === 1) {
      uniform = require('./assets/images/soccerBrazil.png')
    } else if (this.props.uniform === 2) {
      uniform = require('./assets/images/soccerGerman.png')
    }
    return (
      <ImageBackground source={uniform} style={[styles.enemy, {left: x, top: y, width: r * 2, height: r * 2, borderRadius: r * 2}]} />
    );
  }
}

class Field extends React.Component {
  render() {
    return (
      <ImageBackground source={require('./assets/images/square9.png')} style={styles.field} />
    )
  }
}

class Score extends React.Component {
  render() {
    return (
      <View>
        <Text style={styles.score}>{this.props.score}</Text>
      </View>
    )
  }
}

class YellowDiamond extends React.Component {
  render() {
    const x = this.props.body.position.x - RADIUS + 5;
    const y = this.props.body.position.y - RADIUS + 5;
    const r = this.props.body.circleRadius - 5;
    return (
      <ImageBackground source={require('./assets/images/diamondYellow.png')} style={[styles.diamond, {left: x, top: y, width: r * 2, height: r * 2, borderRadius: r * 2}]} />
    )
  }
}
class PurpleDiamond extends React.Component {
  render() {
    const x = this.props.body.position.x - RADIUS + 3;
    const y = this.props.body.position.y - RADIUS + 3;
    const r = this.props.body.circleRadius - 3;
    return (
      <ImageBackground source={require('./assets/images/diamondPurple.png')} style={[styles.diamond, {left: x, top: y, width: r * 2, height: r * 2, borderRadius: r * 2}]} />
    )
  }
}

const styles = StyleSheet.create({
  player: {
    position: "absolute",
    zIndex: 3
  },
  enemy: {
    position: "absolute",
    zIndex: 4
  },
  diamond: {
    position: "absolute",
    zIndex: 2
  },
  field: {
    width: FIELD_DIMENSION, 
    height: FIELD_DIMENSION,
    zIndex: 1 
  },
  score: {
    padding: 20,
    fontWeight: "800",
    color: "white",
    fontSize: 48
  }
});

export { Player, Enemy, Field, Score, YellowDiamond, PurpleDiamond };