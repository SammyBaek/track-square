import * as type from '../types';

const initialState = {
  currentPos: null,
  text: "",
  watchId: null,
  err: null,
  errMsg: "",
  locations: [],
};

export default (state=initialState, action) => {
  switch (action.type) {
    case type.GEOLOCATION_UNAVAILABLE:
      return {
        ...state,
        currentPos: null,
        err: null,
        errMsg: "Geolocation unavailable",
      };
    case type.GET_CUR_POS:
      return {
        ...state,
        currentPos: action.payload,
        err: null,
        errMsg: "",
      }
    case type.GET_CUR_POS_ERR:
      return {
        ...state,
        currentPos: null,
        err: action.payload.err,
        errMsg: action.payload.errMsg
      };

    case type.START_TRACKING_POS:
      return {
        ...state,
        watchId: action.payload
      };

    case type.TRACKING_POS:
      return {
        ...state,
        currentPos: action.payload,
        locations: [...state.locations, action.payload]
      };
    case type.TRACKING_POS_ERR:
      return {
        ...state,
        currentPos: null,
        err: action.payload.err,
        errMsg: action.payload.errMsg
      };
    case type.STOP_TRACKING_POS:
      return {
        ...state,
        watchId: null,
      };
    case type.CLEAR_TRACKING_POS:
      return {
        ...state,
        locations: []
      };
    case type.UPDATE_TRACKING_POS:
      return {
        ...state,
        currentPos: action.payload,
        locations: [...state.locations, action.payload]
      };
    default:
      return state
  }
}
