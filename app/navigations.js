import { StackNavigator } from 'react-navigation';
import Home from './Home';
import Game from './Game';
import Rules from './Rules';

const MainNavigators = StackNavigator({
    Home: {
        screen: Home
    },
    Rules: {
        screen: Rules
    },
    Game: {
        screen: Game
    }
},
{
    headerMode: 'none',
    navigationOptions: {
        header: null,
        gesturesEnabled: false,
    },
    initialRouteName: 'Home'
});

export default MainNavigators;