import React from "react";
import { StyleSheet, View, ImageBackground, Text } from "react-native";
import { RADIUS, FIELD_DIMENSION } from "./constants";
import { Motion, spring } from 'react-motion'; 
class Player extends React.Component {
  render() {
    const x = this.props.body.position.x - RADIUS;
    const y = this.props.body.position.y - RADIUS;
    return (
      <Motion style={{left: spring(x, {stiffness: 300, damping: 40}), top: spring(y, {stiffness: 300, damping: 40})}}>
        {interpolatingStyle => 
          <ImageBackground source={require('./assets/images/foodball.png')} style={[styles.player, interpolatingStyle, {width: 40, height: 39}]} />
        }
      </Motion>
    );
  }
}

class Enemy extends React.Component {
  render() {
    const x = this.props.body.position.x - RADIUS - 10;
    const y = this.props.body.position.y - RADIUS - 10;

    let uniform;
    let width;
    let height;
    
    if (this.props.uniform === 0) {
      uniform = require('./assets/images/soccerChina.png')
      width = 59;
      height = 61;
    } else if (this.props.uniform === 1) {
      uniform = require('./assets/images/soccerBrazil.png')
      width = 58;
      height = 61;
    } else if (this.props.uniform === 2) {
      uniform = require('./assets/images/soccerGerman.png')
      width = 57;
      height = 60;
    }
    return (
      <ImageBackground source={uniform} style={[styles.enemy, {left: x, top: y, width, height}]} />
    );
  }
}

class Field extends React.Component {
  render() {
    const x = this.props.position.x - FIELD_DIMENSION / 2;
    const y = this.props.position.y - FIELD_DIMENSION / 2;
    return (
      <ImageBackground source={require('./assets/images/square9.png')} style={[styles.field, {left: x, top: y}]} />
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
    return (
      <ImageBackground source={require('./assets/images/diamondYellow.png')} style={[styles.diamond, {left: x, top: y, width: 30, height: 27}]} />
    )
  }
}
class PurpleDiamond extends React.Component {
  render() {
    const x = this.props.body.position.x - RADIUS + 3;
    const y = this.props.body.position.y - RADIUS + 3;
    return (
      <ImageBackground source={require('./assets/images/diamondPurple.png')} style={[styles.diamond, {left: x, top: y, width: 36, height: 34}]} />
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
    position: "absolute",
    width: 145, 
    height: 146,
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