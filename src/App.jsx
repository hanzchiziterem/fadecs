import React, { Component } from 'react';
import {Provider} from 'react-redux';
import store from './store';

class App extends Component {
    
    render(){
        return(
            <Provider store={store}></Provider>
        );
    }
}

export default App;