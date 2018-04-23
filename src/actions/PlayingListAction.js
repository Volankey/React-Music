import * as TYPE from '../constants/PlayingListType';

export function show() {
    return (dispatch,getState) => {
        dispatch(
            {
                type: TYPE.PLAYING_LIST_SHOW,
                meta:"显示播放列表"
            }
        );

    }
}
export function hide() {
    return (dispatch,getState) => {
        dispatch(
            {
                type: TYPE.PLAYING_LIST_HIDE,
                meta:"隐藏播放列表"
            }
        );

    }
}