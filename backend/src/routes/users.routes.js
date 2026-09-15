import { deleteUser, getUsers, updateUserRole } from "../controllers/users.controller.js";
import {Router} from  'express'
import { isAdmin, isAuth } from "../middlewares/auth.middleware.js";

const usersRouter = Router()

usersRouter.get('/',isAuth ,isAdmin, getUsers)
usersRouter.patch('/:userId/role', isAuth, isAdmin, updateUserRole)
usersRouter.delete('/:userId', isAuth, deleteUser)

export default usersRouter