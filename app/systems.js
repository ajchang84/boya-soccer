import { RADIUS, FIELD_DIMENSION, STEP_SIZE } from "./constants";
import { Enemy, Box } from "./renderers";
import Matter from "matter-js";
import { Dimensions } from "react-native";
import { determineDirection, attackTypes, positions } from './libraries'

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

let enemyIds = 0;
let spawnTime = 3000;
let cumulativeTime = 0;

const Physics = (state, { touches, time }) => {
  let engine = state["physics"].engine;
  Matter.Engine.update(engine, time.delta);
	return state;
};

const MovePlayer = (entities, { touches }) => {
  let move = touches.find(x => x.type === "move");
  if (move) {
    let player = entities['player'];
    if (!!!player.projectedMove) {
      player.projectedMove = determineDirection(move.delta.locationX, move.delta.locationY )
    }
  }
  let end = touches.find(x => x.type === 'end');
  if (end) {
    let player = entities['player'];
    let field = entities['field'];
    switch(player.projectedMove) {
      case 'RIGHT':
        if (player.body.position.x + STEP_SIZE < field.position.x + FIELD_DIMENSION / 2) {
          Matter.Body.setPosition(player.body, {x: player.body.position.x + STEP_SIZE, y: player.body.position.y})
        }
        break;
      case 'LEFT':
        if (player.body.position.x - STEP_SIZE > field.position.x - FIELD_DIMENSION / 2) {
          Matter.Body.setPosition(player.body, {x: player.body.position.x - STEP_SIZE, y: player.body.position.y})
        }
        break;
      case 'UP':
        if (player.body.position.y - STEP_SIZE > field.position.y - FIELD_DIMENSION / 2) {
          Matter.Body.setPosition(player.body, {x: player.body.position.x, y: player.body.position.y - STEP_SIZE})
        }
        break;
      case 'DOWN':
        if (player.body.position.y + STEP_SIZE < field.position.y + FIELD_DIMENSION / 2) {
          Matter.Body.setPosition(player.body, {x: player.body.position.x, y: player.body.position.y + STEP_SIZE})
        }
        break;
    }
    player.projectedMove = '';    
  }
  return entities;
};

const DetectFailure = (entities) => {
  let engine = entities['physics'].engine;
  let player = entities['player'].body;
  let world = entities["physics"].world;
  let yellowDiamond = entities['yellowDiamond'].body;
  let purpleDiamond = entities['purpleDiamond'].body;
  let score = entities['gameSettings'].score;
  Matter.Events.on(engine, 'collisionStart', function(event) {
    var pairs = event.pairs;
    if (pairs[0].bodyA === player || pairs[0].bodyB === player) {
      if (pairs[0].bodyA === yellowDiamond || pairs[0].bodyB === yellowDiamond) {
        entities['gameSettings'].score = score + entities['yellowDiamond'].points
        let position = positions[Math.floor(Math.random() * 9)]
        Matter.Body.setPosition(yellowDiamond, {x: position.x, y: position.y})
      }
      else if (pairs[0].bodyA === purpleDiamond || pairs[0].bodyB === purpleDiamond) {
        entities['gameSettings'].score = score + entities['purpleDiamond'].points
        let position = positions[Math.floor(Math.random() * 9)]
        Matter.Body.setPosition(purpleDiamond, {x: position.x, y: position.y})
      }
      else {
        entities['gameSettings'].endGame(entities['gameSettings'].score)
      }
    }
  });
  return entities
}

const CreateWave = (entities, { time }) => {
  let world = entities['physics'].world;
  let engine = entities['physics'].engine;
  let enemies = 1;
  if (cumulativeTime === 0) {
    cumulativeTime = 16
    for (let i = 0; i < enemies; i++) {
      let attackType = attackTypes[Math.floor(Math.random() * 12)]
      let body = Matter.Bodies.circle(attackType.x, attackType.y, RADIUS, { frictionAir: 0, isSensor: true})
      Matter.Body.setVelocity(body, {x: attackType.vx, y: attackType.vy});
      Matter.World.add(world, [body]);
      entities[`enemy${++enemyIds}`] = {
        uniform: Math.floor(Math.random() * 3),
        body: body,
        renderer: Enemy
      };
    }
  }
  else cumulativeTime += 16

  if (cumulativeTime > spawnTime) {
    cumulativeTime = 0;
  }

  return entities;
}

const RemoveEnemy = (entities, { screen }) => {
  let world = entities["physics"].world;
  Object.keys(entities).filter(key=> key.search('enemy') === 0).forEach(enemy => {
    const {x, y} = entities[enemy].body.position;
    if (x > screen.width || y > screen.height || x < 0 || y < 0) {
      Matter.Composite.remove(world, entities[enemy].body);
      delete entities[enemy];
    }
  });
  return entities;
}
 
export { Physics, MovePlayer, RemoveEnemy, CreateWave, DetectFailure };