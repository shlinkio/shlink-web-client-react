import ShlinkApiClient from '../../api/ShlinkApiClient';

const LIST_TAGS_START = 'shlink/tagsList/LIST_TAGS_START';
const LIST_TAGS_ERROR = 'shlink/tagsList/LIST_TAGS_ERROR';
const LIST_TAGS = 'shlink/tagsList/LIST_TAGS';

const defaultState = {
  tags: [],
  loading: false,
  error: false,
};

export default function reducer(state = defaultState, action) {
  switch(action.type) {
    case LIST_TAGS_START:
      return {
        ...state,
        loading: true,
        error: false,
      };
    case LIST_TAGS_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
      };
    case LIST_TAGS:
      return {
        tags: action.tags,
        loading: false,
        error: false,
      };
    default:
      return state;
  }
}

export const _listTags = ShlinkApiClient => async dispatch => {
  dispatch({ type: LIST_TAGS_START });

  try {
    const tags = await ShlinkApiClient.listTags();
    dispatch({ tags, type: LIST_TAGS });
  } catch (e) {
    dispatch({ type: LIST_TAGS_ERROR });
    throw e;
  }
};
export const listTags = () => _listTags(ShlinkApiClient);