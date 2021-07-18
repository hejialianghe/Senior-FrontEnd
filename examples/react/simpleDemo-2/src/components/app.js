import React from 'react'
import { Route, Switch, NavLink } from 'react-router-dom';
import routes from '../core/routes.js'

const App = () => {
  return (
    <div>
      <ul>
        <li>
          <NavLink to="/">to Home</NavLink>
        </li>
        <li>
          <NavLink to="/user">to User</NavLink>
        </li>
      </ul>

      <Switch>
        {routes.map(route => (
          <Route key={route.path} exact={route.path === '/'} {...route} />
        ))}
      </Switch>
    </div>
  )
}

export default App
