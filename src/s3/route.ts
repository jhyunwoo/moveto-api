import { Hono } from 'hono'
import multipart from './multipart/route'
import params from './params/route'

const s3Route = new Hono()

s3Route.route('/params', params)
s3Route.route('/multipart', multipart)

export default s3Route
