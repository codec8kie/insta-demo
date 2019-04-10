import Fetch from './Fetch';
import { SERVER_URL, PROJECT_NAME } from './Constants';
import { getItem, setItem } from './StorageUtils';

async function RestAPI() {
  const api = getItem('RestAPI');
  if (api && api.accuse_count) {
    return true;
  }
  try {
    const API = {};
    const res = await Fetch({
      method: 'GET',
      url: SERVER_URL + `/${PROJECT_NAME}/restapi/api_list`
    });

    res.forEach(item => {
      API[item.api_name] = {};
      API[item.api_name].url = SERVER_URL + item.api;
      API[item.api_name].method = item.method;
    });

    setItem('RestAPI', API);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export default RestAPI;
