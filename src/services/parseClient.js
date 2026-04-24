import Parse from "parse";

Parse.serverURL = "https://parseapi.back4app.com";

Parse.initialize(
  import.meta.env.VITE_PARSE_APP_ID,
  import.meta.env.VITE_PARSE_JS_KEY,
  import.meta.env.VITE_PARSE_MASTER_KEY
);

Parse.liveQueryServerURL = import.meta.env.VITE_PARSE_LIVE_QUERY_URL

export default Parse;
