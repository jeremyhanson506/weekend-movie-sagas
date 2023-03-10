import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App.js';
import { createStore, combineReducers, applyMiddleware } from 'redux';
// Provider allows us to use redux within our react app
import { Provider } from 'react-redux';
import logger from 'redux-logger';
// Import saga middleware
import createSagaMiddleware from 'redux-saga';
import { takeEvery, put } from 'redux-saga/effects';
import axios from 'axios';


// Create the rootSaga generator function
function* rootSaga() {
    yield takeEvery('SAGA/FETCH_MOVIES', fetchAllMovies);
    yield takeEvery('SAGA/FETCH_DETAILS', fetchMovieDetails);
}

// get ALL movies from the DB
function* fetchAllMovies() {
    
    try {
        const movies = yield axios.get('/api/movie');
        console.log('get all movies.data:', movies.data);
        yield put({ type: 'SET_MOVIES', payload: movies.data });

    } catch {
        console.log('get all error');
    }
        
}

// get ONE movie's details from the DB
function* fetchMovieDetails(action) {
    console.log('fetchMovieDetails action.payload:', action.payload)
    console.log('details.data:', details.data)
    try {
        const details = yield axios.get(`/api/movie/details/${action.payload}`);
        console.log('fetchMovieDetails action.payload', action.payload)
        yield put({ type: 'SET_DETAILS', payload: details.data })
        
    } catch {
        console.log('error in fetchMovieDetails');
    }
}

// Create sagaMiddleware
const sagaMiddleware = createSagaMiddleware();

// Used to store movies returned from the server
const movies = (state = [], action) => {
    switch (action.type) {
        case 'SET_MOVIES':
            console.log('SET_MOVIES action.payload in movies reducer:', action.payload)
            return action.payload;
        default:
            return state;
    }
}

// Used to store the movie genres
const genres = (state = [], action) => {
    switch (action.type) {
        case 'SET_GENRES':
            return action.payload;
        default:
            return state;
    }
}

const details = (state = [], action) => {
    switch (action.type) {
        case 'SET_DETAILS':
            console.log('SET_DETAILS action.payload in movies reducer:', action.payload)
            return action.payload;
        default:
            return state;
    }
}

// Create one store that all components can use
const storeInstance = createStore(
    combineReducers({
        movies,
        genres,
        details
    }),
    // Add sagaMiddleware to our store
    applyMiddleware(sagaMiddleware, logger),
);


// Pass rootSaga into our sagaMiddleware
sagaMiddleware.run(rootSaga);

ReactDOM.render(
    <React.StrictMode>
        <Provider store={storeInstance}>
        <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);