import { Route, Routes } from 'react-router-dom';
import {Provider} from "react-redux";
import AppRoutes from './routes';
import store from "./store";

export default function App(){
    return(
      <Provider store={store}>
        <Routes>
          {AppRoutes.map((route, index) => {
            const { element, ...rest } = route;
            return <Route key={index} {...rest} element={element} />;
          })}
        </Routes>
      </Provider>
    )
}