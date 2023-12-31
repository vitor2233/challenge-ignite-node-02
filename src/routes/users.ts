import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";

export async function usersRoute(app: FastifyInstance) {
    app.post('/', async (request, reply) => {
        const createUserBodySchema = z.object({
            name: z.string()
        })
        const { name } = createUserBodySchema.parse(request.body)

        let sessionId = request.cookies.sessionId

        if (!sessionId) {
            sessionId = randomUUID()

            reply.cookie('sessionId', sessionId, {
                path: '/',
                maxAge: 1000 * 60 * 60 * 24 * 7 // 7 dias
            })
        }

        await knex('users').insert({
            name,
            session_id: sessionId
        })

        return reply.status(201).send()
    })
}