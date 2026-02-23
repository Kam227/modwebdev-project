import './App.css'
import Parse from "parse"
import Components from './Components/Components'

Parse.serverURL = 'https://parseapi.back4app.com'; // This is your Server URL
// Remember to inform BOTH the Back4App Application ID AND the JavaScript KEY
Parse.initialize(
  'pS9KVhQzrn9mfYERxGoLQcabclm9APmqTxHunom2', // This is your Application ID
  'YoP3prEG557dkotkpJI4szsq78VqZxcuOw9Ogxxr', // This is your Javascript key
  'PYgnlTd6On7S8fWu7xPCxOzYCBPTtJmFa8rOPb5F' // This is your Master key (never use it in the frontend)
);

function App() {
  return (
    <div>
      <Components />
    </div>
  )
}

export default App
