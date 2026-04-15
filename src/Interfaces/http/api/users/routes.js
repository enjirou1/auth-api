import express from 'express'

const routes = (controller) => {
  const router = express.Router()

  /**
  * @swagger
  * /authentications:
  *   post:
  *     summary: POST authentications
  *     description: Test
  *     tags:
  *       - auth
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               fullname:
  *                 type: string
  *               username:
  *                 type: string
  *               password:
  *                 type: string
  *     responses:
  *       201:
  *         description: success
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 status:
  *                   type: string
  *                   example: success
  *                 data:
  *                   type: object
  *                   properties:
  *                     id:
  *                       type: string
  *                     fullname:
  *                       type: string
  *                     username:
  *                       type: string
  */
  router.post('/', controller.postUser)

  return router
}

export default routes