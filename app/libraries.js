import { STEP_SIZE } from "./constants";
import { Dimensions } from "react-native";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

const determineDirection = (x, y) => {
    if (Math.abs(x) > Math.abs(y)) {
      if (x > 0) return 'RIGHT';
      if (x < 0) return 'LEFT';
    }
    if (Math.abs(y) > Math.abs(x)) {
      if (y < 0) return 'UP';
      if (y > 0) return 'DOWN'; 
    }
}

const attackTypes = [
        {vx: 0, vy: 2, x:WIDTH / 2 - STEP_SIZE , y:0},
        {vx: 0, vy: 2, x:WIDTH / 2 , y:0},
        {vx: 0, vy: 2, x:WIDTH / 2 + STEP_SIZE , y:0},
        {vx: 0, vy: -2, x:WIDTH / 2 - STEP_SIZE , y:HEIGHT},
        {vx: 0, vy: -2, x:WIDTH / 2 , y:HEIGHT},
        {vx: 0, vy: -2, x:WIDTH / 2 + STEP_SIZE , y:HEIGHT},
        {vx: 2, vy: 0, x:0 , y:HEIGHT / 2 + STEP_SIZE},
        {vx: 2, vy: 0, x:0 , y:HEIGHT / 2},
        {vx: 2, vy: 0, x:0 , y:HEIGHT / 2 - STEP_SIZE},
        {vx: -2, vy: 0, x:WIDTH , y:HEIGHT / 2 + STEP_SIZE},
        {vx: -2, vy: 0, x:WIDTH , y:HEIGHT / 2},
        {vx: -2, vy: 0, x:WIDTH , y:HEIGHT / 2 - STEP_SIZE}
    ]
const positions = [
        {x:WIDTH / 2 - STEP_SIZE , y:HEIGHT / 2 + STEP_SIZE},
        {x:WIDTH / 2 , y:HEIGHT / 2 + STEP_SIZE},
        {x:WIDTH / 2 + STEP_SIZE , y:HEIGHT / 2 + STEP_SIZE},
        {x:WIDTH / 2 - STEP_SIZE , y:HEIGHT / 2},
        {x:WIDTH / 2 , y:HEIGHT / 2},
        {x:WIDTH / 2 + STEP_SIZE , y:HEIGHT / 2},
        {x:WIDTH / 2 - STEP_SIZE , y:HEIGHT / 2 - STEP_SIZE},
        {x:WIDTH / 2 , y:HEIGHT / 2 - STEP_SIZE},
        {x:WIDTH / 2 + STEP_SIZE , y:HEIGHT / 2 - STEP_SIZE},
    ]

export { determineDirection, attackTypes, positions };