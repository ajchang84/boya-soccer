import React, { PureComponent } from "react";
import { StyleSheet, StatusBar, Text, Dimensions, ImageBackground, Modal, View, TouchableOpacity } from "react-native";
import { GameEngine } from "react-native-game-engine";
import { Player, Field, Enemy, Score, YellowDiamond, PurpleDiamond } from "./renderers";
import { Physics, MovePlayer, MoveEnemy, RemoveEnemy, CreateWave, DetectFailure } from "./systems";
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import { RADIUS, FIELD_DIMENSION, STEP_SIZE } from "./constants";
import Matter from "matter-js";

Matter.Common.isElement = () => false; //-- Overriding this function because the original references HTMLElement

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

export default class Game extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pause: false,
      modal: 'menu',
      score: 0
    };
  }

  pauseGame() {
    this.setState({pause: true});
    this.refs.gameEngine.stop()
  }

  resumeGame() {
    this.setState({pause: false, modal: 'menu'});
    this.refs.gameEngine.start()
  }

  endGame(score) {
    this.setState({pause: true, modal: 'end', score});
    this.refs.gameEngine.stop()
  }

  getState() {
    return this.state;
  }

  handleNavigations(routename) {
    if (routename === 'Home') {
      this.props.navigation.goBack()
    } else {
      this.props.navigation.navigate(routename)
      this.resumeGame();
    }
  }

  showMenu() {
    const { modal } = this.state;
    if (modal === 'menu') {
      return (
        <View style={[styles.modalContainer, {paddingTop: 60}]}>
          <View style={styles.innerContainer}>
            <Text style={{color: '#fff', fontSize: 44, fontWeight: '800'}}>暂停</Text>
            <TouchableOpacity style={{marginBottom: 56, marginTop: 60}} onPress={()=>this.resumeGame()}>
              <ImageBackground style={{width: 76, height: 76}} source={require('./assets/images/play.png')} />
            </TouchableOpacity>
            <TouchableOpacity style={{marginBottom: 10}} onPress={()=>this.setState({modal: 'restart'})}>
              <ImageBackground style={{width: 245, height: 60}} source={require('./assets/images/btn01Return.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>this.setState({modal: 'return'})}>
              <ImageBackground style={{width: 245, height: 60}} source={require('./assets/images/btn01Back.png')} />
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (modal === 'end') {
      return (
        <View style={[styles.modalContainer, {paddingTop: 60}]}>
          <View style={styles.innerContainer}>
            <Text style={{color: '#fff', fontSize: 44, fontWeight: '800', marginBottom: 40}}>游戏结束</Text>
            <ImageBackground style={{width: 340, height: 50}} source={require('./assets/images/iconFlag.png')} />
            <Text style={{color: '#fff', fontSize: 124, fontWeight: 'bold', marginTop: 10, marginBottom: 60}}>{this.state.score.toLocaleString()}</Text>
            <TouchableOpacity style={{marginBottom: 20}} onPress={()=>this.handleNavigations('Game')}>
              <ImageBackground style={{width: 245, height: 60}} source={require('./assets/images/btn01Return.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>this.handleNavigations('Home')}>
              <ImageBackground style={{width: 245, height: 60}} source={require('./assets/images/btn01Back.png')} />
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (modal === 'restart') {
      return (
        <View style={[styles.modalContainer, {justifyContent: 'center'}]}>
          <View style={styles.innerContainer}>
            <ImageBackground style={styles.popup} source={require('./assets/images/popupRestart.png')}>
              <TouchableOpacity style={styles.iconX} onPress={()=>this.setState({modal:'menu'})}>  
                <ImageBackground style={{width: 19, height: 19}} source={require('./assets/images/iconX.png')} />
              </TouchableOpacity>
              <Text style={{ color: '#fff', fontSize: 24, fontWeight: '800' }}>重新开始</Text>
              <Text style={{ color: '#fff', fontSize: 17, marginTop: 20 }}>重新开始会遗失当前分数</Text>
              <Text style={{ color: '#fff', fontSize: 17, marginTop: 5 }}>确认是否重新开始？</Text>
              <TouchableOpacity style={{marginTop: 13}} onPress={()=>this.handleNavigations('Game')}>
                <ImageBackground style={{width: 39, height: 39}} source={require('./assets/images/iconCorrect.png')} />
              </TouchableOpacity>
            </ImageBackground>
          </View>
        </View>
      );
    } else if (modal === 'return') {
      return (
        <View style={[styles.modalContainer, {justifyContent: 'center'}]}>
          <View style={styles.innerContainer}>
            <ImageBackground style={styles.popup} source={require('./assets/images/popupBack.png')}>
              <TouchableOpacity style={styles.iconX} onPress={()=>this.setState({modal:'menu'})}>
                <ImageBackground style={{width: 19, height: 19}} source={require('./assets/images/iconX.png')} />
              </TouchableOpacity>
              <Text style={{ color: '#fff', fontSize: 24, fontWeight: '800' }}>回首页</Text>
              <Text style={{ color: '#fff', fontSize: 17, marginTop: 20 }}>回首页会遗失当前分数</Text>
              <Text style={{ color: '#fff', fontSize: 17, marginTop: 5 }}>确认是否重新开始？</Text>
              <TouchableOpacity style={{marginTop: 13}} onPress={()=>this.handleNavigations('Home')}>
                <ImageBackground style={{width: 39, height: 39}} source={require('./assets/images/iconCorrect.png')} />
              </TouchableOpacity>
            </ImageBackground>
          </View>
        </View>   
      );
    }
  }

  render() {
    const engine = Matter.Engine.create({ enableSleeping: false });
    const world = engine.world;
    world.gravity.y = 0;

    const player = Matter.Bodies.circle(WIDTH / 2, HEIGHT / 2, RADIUS, { isSensor: true });
    const yellowDiamond = Matter.Bodies.circle(WIDTH / 2 - STEP_SIZE, HEIGHT / 2 - STEP_SIZE, RADIUS, { isSensor: true});
    const purpleDiamond = Matter.Bodies.circle(WIDTH / 2 + STEP_SIZE, HEIGHT / 2 + STEP_SIZE, RADIUS, { isSensor: true});

    Matter.World.add(world, [player, yellowDiamond, purpleDiamond]);

    return (
      <ImageBackground style={{flex: 1}} source={require('./assets/images/ground.png')}>
        <GameEngine 
          ref={"gameEngine"}
          style={styles.container} 
          systems={[Physics, MovePlayer, DetectFailure, CreateWave, RemoveEnemy]}
          entities={{
            physics: { engine: engine, world: world, },
            gameSettings: { 
              score: 0,
              endGame: this.endGame.bind(this), 
              renderer: <Score />
            },

            field: { position: {x: WIDTH / 2, y: HEIGHT / 2  }, renderer: <Field />},
            player: { body: player, projectedMove: '', renderer: <Player />},
            yellowDiamond: { body: yellowDiamond, points: 10, renderer: <YellowDiamond />},
            purpleDiamond: { body: purpleDiamond, points: 30, renderer: <PurpleDiamond />},
          }}
        >
          <TouchableOpacity style={{position: 'absolute', right: 21, top: 26}} onPress={()=>this.pauseGame()}>
            <ImageBackground style={{width: 40, height: 40}} source={require('./assets/images/rectangle4.png')} />
          </TouchableOpacity>
          <StatusBar hidden={true} />
        </GameEngine>
        <Modal
          visible={this.state.pause}
          animationType={'fade'}
          transparent={true}
        >
          {this.showMenu()}
        </Modal>
      </ImageBackground>
    );
  }
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  innerContainer: {
    alignItems: 'center',
  },
  popup: {
    width: 255, 
    height: 240, 
    paddingBottom: 16,
    paddingHorizontal: 25,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  iconX: {
    position: 'absolute',
    right: 14,
    top: 56
  }
});