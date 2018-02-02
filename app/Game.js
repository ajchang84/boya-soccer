import React, { PureComponent } from "react";
import { StyleSheet, StatusBar, Text, Dimensions, ImageBackground, Modal, View, TouchableOpacity, AsyncStorage, TouchableWithoutFeedback, TouchableHighlight, findNodeHandle } from "react-native";
import { GameEngine } from "react-native-game-engine";
import { BlurView } from 'react-native-blur';
import { Player, Field, Enemy, Score, YellowDiamond, PurpleDiamond } from "./renderers";
import { Physics, MovePlayer, MoveEnemy, RemoveEnemy, CreateWave, Interactions } from "./systems";
import { RADIUS, STEP_SIZE } from "./constants";
import Matter from "matter-js";

Matter.Common.isElement = () => false; //-- Overriding this function because the original references HTMLElement

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

export default class Game extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pause: false,
      modal: 'menu',
      score: 0,
      highscore: true,
      buttonSwap: false,
      pausedBlurViewRef: null
    };
  }
  componentDidMount() {
    this.setState({ pausedBlurViewRef: findNodeHandle(this.pausedBlurViewRef) });
  }
  pauseGame() {
    this.setState({pause: true});
    this.refs.gameEngine.stop();
  }
  resumeGame() {
    this.setState({pause: false, modal: 'menu', buttonSwap: false});
    this.refs.gameEngine.start();
  }
  eventHandler = (e) => {
    if (e.type === "game-over") {
      this.setState({pause: true, modal: 'end', score: e.score});
      try {
        AsyncStorage.getItem('@MySuperStore:score').then(value=>{
          if (value == null) {
            AsyncStorage.setItem('@MySuperStore:score', e.score.toString());
            this.setState({highscore: true});
          } else if (e.score > parseInt(value)) {
            AsyncStorage.setItem('@MySuperStore:score', e.score.toString());
            this.setState({highscore: true});
          } else {
            this.setState({highscore: false});
          } 
        })
      } catch (error) {
      }
      this.refs.gameEngine.stop();
    }
  }

  handleNavigations(routename) {
    if (routename === 'Home') {
      this.setState({pause: false, modal: 'menu'});
      this.props.navigation.goBack()
    } else if (routename === 'Game') {
      this.resumeGame();
      this.refs.gameEngine.swap(this.initialEntity);
    }
  }
  colorText() {
    this.setState({buttonSwap: true});
  }
  resetText() {
    this.setState({buttonSwap: false});
  }
  showMenu() {
    const { modal } = this.state;
    if (modal === 'menu') {
      return (
        <View style={[styles.modalContainer, {paddingTop: 60}]}>
          <View style={styles.innerContainer}>
            <Text style={{color: '#fff', fontSize: 44, fontWeight: '800'}}>暂停</Text>
            <TouchableHighlight underlayColor={'transparent'} style={{marginBottom: 56, marginTop: 60}} onPress={()=>this.resumeGame()} onPressIn={()=>this.colorText()} onPressOut={()=>this.resetText()}>
              {this.state.buttonSwap ? 
                <ImageBackground style={{width: 76, height: 76}} source={require('./assets/images/playDone.png')} /> :
                <ImageBackground style={{width: 76, height: 76}} source={require('./assets/images/play.png')} />
              }
            </TouchableHighlight>
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
            {this.state.highscore ?
              <ImageBackground style={{width: 341, height: 51}} source={require('./assets/images/iconFlag.png')} /> :
              <View style={{width: 340, height: 50}} />
            }
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
                <ImageBackground style={{width: 47, height: 40}} source={require('./assets/images/iconCorrect.png')} />
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
                <ImageBackground style={{width: 47, height: 40}} source={require('./assets/images/iconCorrect.png')} />
              </TouchableOpacity>
            </ImageBackground>
          </View>
        </View>   
      );
    }
  }
  imageLoaded() {
    this.setState({ viewRef: findNodeHandle(this.backgroundImage) });
  }

  render() {
    const engine = Matter.Engine.create({ enableSleeping: false });
    const world = engine.world;
    world.gravity.y = 0;

    const player = Matter.Bodies.circle(WIDTH / 2, HEIGHT / 2, RADIUS, { isSensor: true });
    const yellowDiamond = Matter.Bodies.circle(WIDTH / 2 - STEP_SIZE, HEIGHT / 2 - STEP_SIZE, RADIUS, { isSensor: true});
    const purpleDiamond = Matter.Bodies.circle(WIDTH / 2 + STEP_SIZE, HEIGHT / 2 + STEP_SIZE, RADIUS, { isSensor: true});

    Matter.World.add(world, [player, yellowDiamond, purpleDiamond]);

    this.initialEntity = 
      {
        physics: { engine: engine, world: world, },
        gameSettings: { 
          score: 0,
          startGame: false,
          renderer: <Score />
        },

        field: { position: {x: WIDTH / 2, y: HEIGHT / 2  }, renderer: <Field />},
        player: { body: player, projectedMove: '', renderer: <Player />},
        yellowDiamond: { body: yellowDiamond, points: 10, renderer: <YellowDiamond />},
        purpleDiamond: { body: purpleDiamond, points: 30, renderer: <PurpleDiamond />},
      }

    return (
      <ImageBackground style={{flex: 1}} source={require('./assets/images/ground.png')}>
        <View style={{flex: 1, backgroundColor: 'transparent'}} ref={(container) => { this.pausedBlurViewRef = container; }}>
          <GameEngine 
              ref="gameEngine"
              onEvent={this.eventHandler}
              style={styles.container} 
              systems={[Physics, MovePlayer, Interactions, CreateWave, RemoveEnemy]}
              entities={this.initialEntity}
            >
            <TouchableOpacity style={{position: 'absolute', right: 21, top: 26}} onPress={()=>this.pauseGame()}>
            <ImageBackground style={{width: 40, height: 40}} source={require('./assets/images/paused.png')} />
            </TouchableOpacity>
            <StatusBar hidden={true} />
            </GameEngine>
        </View>
        <BlurView
          style={[styles.absolute, {display: this.state.pause ? 'flex': 'none'}]}
          blurType="dark"
          blurAmount={2}    
          viewRef={this.state.pausedBlurViewRef}
        />
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
    flex: 1
  },
  innerContainer: {
    alignItems: 'center',
  },
  popup: {
    width: 255, 
    height: 239, 
    paddingBottom: 16,
    paddingHorizontal: 25,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  iconX: {
    position: 'absolute',
    right: 14,
    top: 56
  },
  absolute: {
    position: "absolute",
    top: 0, left: 0, bottom: 0, right: 0,
  }
});