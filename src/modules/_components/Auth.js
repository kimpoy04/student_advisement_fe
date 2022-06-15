import UI from "../../shared/Components/UI/js";
import mem from "../../shared/Components/Memory/js";
import { r } from "../../shared/custom-react-native";

class Auth {
  _this = null;
  constructor(props = { _this: null }) {
    this._this = props._this;
    UI.set_context(props._this);
  }

  authenticate = async () => {
    return new Promise((resolve) => {
      r.request({
        method: "get",
        url: "/whoAmI",
        onSuccess: (e) => {
          e = e[0];
          mem.save("user_type", e.user_type);
          resolve(e);
        },
        onFail: (e) => {
          mem.clear();
          UI.goTo("/login");
        },
      });
    });
  };
}

export default Auth;
