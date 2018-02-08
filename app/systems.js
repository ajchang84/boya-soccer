import { RADIUS, FIELD_DIMENSION, STEP_SIZE } from "./constants";
import { Enemy, Box } from "./renderers";
import Matter from "matter-js";
import { Dimensions } from "react-native";
import { determineDirection, attackTypes, positions } from './libraries';
import _ from 'lodash';

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");
const moveDirection = {start: {x: 0, y:0}, end: {x: 0, y:0}};

let enemyIds = 0;
let spawnTime = 3000;
let cumulativeTime = 0;
let score = 0;
let prevYel = 1;
let prevPur = 9;
let enemies = 1;

const Physics = (state, { touches, time }) => {
  const engine = state["physics"].engine;
  Matter.Engine.update(engine, time.delta);
	return state;
};

const MovePlayer = (entities, { touches }) => {
  const constraint = entities["physics"].constraint;
  const player = entities['player'].body;
  const field = entities['field'];
  const { start, end } = moveDirection;
 
  const startEvent = (touches.find(x => x.type === "start") || {}).event;
  if (startEvent) {
   start.x = startEvent.pageX;
   start.y = startEvent.pageY;
  }
  const endEvent = (touches.find(x => x.type === "end") || {}).event;
  if (endEvent) {
   end.x = endEvent.pageX;
   end.y = endEvent.pageY;

   if (start.x != end.x && start.y != end.y) {
    let move = {
     x: 0,
     y: 0
    };
    switch (determineDirection(end.x - start.x, end.y - start.y)) {
     case 'UP':
      move.y = -1 * STEP_SIZE;
      break;
     case 'DOWN':
      move.y = STEP_SIZE;
      break;
     case 'LEFT':
      move.x = -1 * STEP_SIZE;
      break;
     case 'RIGHT':
      move.x = STEP_SIZE;
      break;
    }
    
    const nextPosition = {
     x: player.position.x + move.x,
     y: player.position.y + move.y,
    }
    if (nextPosition.x < field.position.x + FIELD_DIMENSION / 2 && nextPosition.x > field.position.x - FIELD_DIMENSION / 2 && nextPosition.y > field.position.y - FIELD_DIMENSION / 2 && nextPosition.y < field.position.y + FIELD_DIMENSION / 2) {
     Matter.Body.setPosition(player, {
      ...nextPosition
     });
    }
   }
 
  }
  return entities;
};

const Interactions = (entities, { dispatch }) => {
  let engine = entities['physics'].engine;
  let player = entities['player'].body;
  let yellowDiamond = entities['yellowDiamond'].body;
  let purpleDiamond = entities['purpleDiamond'].body;
  if (!entities['gameSettings'].gameStart) {
    score = 0;
    prevYel = 1;
    prevPur = 9;
    enemies = 1;

    Matter.Events.on(engine, 'collisionStart', function(event) {
      var pairs = event.pairs;
      if (pairs[0].bodyA === player || pairs[0].bodyB === player) {
        if (pairs[0].bodyA === yellowDiamond || pairs[0].bodyB === yellowDiamond) {
          score += entities['yellowDiamond'].points;
            let position = _.filter(positions, function(item){
              return item.pos !== prevYel && item.pos !== prevPur;
            })[Math.floor(Math.random() * 7)]
            Matter.Body.setPosition(yellowDiamond, {x: position.x, y: position.y});
            prevYel = position.pos;
        }
        else if (pairs[0].bodyA === purpleDiamond || pairs[0].bodyB === purpleDiamond) {
          score += entities['purpleDiamond'].points;
            let position = _.filter(positions, function(item){
              return item.pos !== prevYel && item.pos !== prevPur;
            })[Math.floor(Math.random() * 7)]
            Matter.Body.setPosition(purpleDiamond, {x: position.x, y: position.y});
            prevPur = position.pos;
        }
        else {
          dispatch({type: 'game-over', score});
        }

        if (score > 1000) {
          enemies = 3;
        } else if ( score > 100) {
          enemies = 2;
        }
      }
    });
    entities['gameSettings'].gameStart = true;
  }
  entities['gameSettings'].score = score;
  return entities;
}

const CreateWave = (entities, { time }) => {
  let world = entities['physics'].world;
  let engine = entities['physics'].engine;
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
 
export { Physics, MovePlayer, RemoveEnemy, CreateWave, Interactions };