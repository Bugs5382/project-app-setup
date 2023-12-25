// @ts-nocheck

declare module 'fastify' {
  export interface FastifyInstance {
    /** Main Decorator for Fastify **/
    APP: any
  }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace fastifyPlugin {
  export interface fastifyPluginNO {
    [namespace: string]: any
  }
}
