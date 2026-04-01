import UsersController from './controller.js'
import routes from './routes.js'

const users = (container) => {
  const usersController = new UsersController(container)
  
  return routes(usersController)
}

export default users