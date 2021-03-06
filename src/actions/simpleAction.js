import axios from "axios";
import * as types from "../types";
import copyGeoPos from "../utils/utils";

export const positionOptions = {
  enableHighAccuracy: true,
  timeout: 9000,
  maximumAge: 0,
};

const getGeoErrorMessage = (error) => {
  let text = "";
  switch (error.code) {
    case error.PERMISSION_DENIED:
      text = "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      text = "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      text = "The request to get user location timed out.";
      break;
    case error.UNKNOWN_ERROR:
      text = "An unknown error occurred.";
      break;
    default:
      text = "Some error has occurred during getting location.";
      break;
  }
  return text;
}

export const getCurrentPos = () => dispatch => {
  const curPosSuccess = (pos) => {
    dispatch({
      type: types.GET_CUR_POS,
      payload: pos,
    });
  };

  const curPosErr = (err) => {
    dispatch({
      type: types.GET_CUR_POS_ERR,
      payload: {
        err,
        errMsg: getGeoErrorMessage(err),
      },
    });
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      curPosSuccess,
      curPosErr,
      positionOptions,
    );
  } else {
    dispatch({
      type: types.GEOLOCATION_UNAVAILABLE,
    });
  }
};

export const updateTrackingPos = (pos) => (dispatch, getState) => {
  const {locations} = getState().geolocation;
  if (locations.length > 0
      && locations[locations.length - 1].timestamp === pos.timestamp) {
    return;
  }
  dispatch({
    type: types.UPDATE_TRACKING_POS,
    payload: pos,
  });
};

export const startTrackingPos = (watchId) => (dispatch) => {
  dispatch({
    type: types.START_TRACKING_POS,
    payload: watchId,
  });
};

export const stopTrackingPos = () => (dispatch, getState) => {
  const {watchId} = getState().geolocation;
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    dispatch({
      type: types.STOP_TRACKING_POS,
    });
  }
};

export const clearTrackingPos = () => dispatch => {
  dispatch({
    type: types.CLEAR_TRACKING_POS,
  });
};

export const errorToastShow = (err, errMsg) => dispatch => {
  dispatch({
    type: types.ERROR_TOAST_SHOW,
    payload: {err, errMsg},
  });
};

export const errorToastHide = () => dispatch => {
  dispatch({
    type: types.ERROR_TOAST_HIDE,
  });
};

export const sendTrackingPos = (locations) => dispatch => {
  const data = {locations: locations.map(loc => copyGeoPos(loc))};
  dispatch(stopTrackingPos());
  axios.post("/api/finish", data)
    .then(res => {
      dispatch({
        type: types.SEND_TRACKING_HISTORY_SUCCESS,
        payload: res.data,
      });
    })
    .catch(err => {
      const errMsg = "Error while sending tracking position";
      dispatch(errorToastShow(err, errMsg));
    });
};
