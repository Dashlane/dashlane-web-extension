import { Action } from "Store";
export const SET_CHANGE_MP_START = "SET_CHANGE_MP_START";
export const SET_CHANGE_MP_DONE = "SET_CHANGE_MP_DONE";
export const changeMPStart = (): Action => ({
  type: SET_CHANGE_MP_START,
});
export const changeMPDone = (): Action => ({
  type: SET_CHANGE_MP_DONE,
});
