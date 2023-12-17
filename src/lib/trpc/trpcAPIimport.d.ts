declare const appRouter: import('@trpc/server').CreateRouterInner<import('@trpc/server').RootConfig<{
    ctx: object;
    meta: object;
    errorShape: import('@trpc/server').DefaultErrorShape;
    transformer: import('@trpc/server').DefaultDataTransformer;
}>, {
    BoidIDlist: import('@trpc/server').BuildProcedure<'query', {
        _config: import('@trpc/server').RootConfig<{
            ctx: object;
            meta: object;
            errorShape: import('@trpc/server').DefaultErrorShape;
            transformer: import('@trpc/server').DefaultDataTransformer;
        }>;
        _ctx_out: object;
        _input_in: typeof import('@trpc/server').unsetMarker;
        _input_out: typeof import('@trpc/server').unsetMarker;
        _output_in: typeof import('@trpc/server').unsetMarker;
        _output_out: typeof import('@trpc/server').unsetMarker;
        _meta: object;
    }, string[]>;
    GetDeltasBoidID: import('@trpc/server').BuildProcedure<'query', {
        _config: import('@trpc/server').RootConfig<{
            ctx: object;
            meta: object;
            errorShape: import('@trpc/server').DefaultErrorShape;
            transformer: import('@trpc/server').DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: object;
        _input_in: {
            from: string;
            to: string;
            boid_id?: string | undefined;
        };
        _input_out: {
            from: string;
            to: string;
            boid_id?: string | undefined;
        };
        _output_in: typeof import('@trpc/server').unsetMarker;
        _output_out: typeof import('@trpc/server').unsetMarker;
    }, import('./api4DeltasTypes.js').AccountsDeltaData[]>;
    GetLogPwrClaim: import('@trpc/server').BuildProcedure<'query', {
        _config: import('@trpc/server').RootConfig<{
            ctx: object;
            meta: object;
            errorShape: import('@trpc/server').DefaultErrorShape;
            transformer: import('@trpc/server').DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: object;
        _input_in: {
            from: string;
            to: string;
            boid_id?: string | undefined;
        };
        _input_out: {
            from: string;
            to: string;
            boid_id?: string | undefined;
        };
        _output_in: typeof import('@trpc/server').unsetMarker;
        _output_out: typeof import('@trpc/server').unsetMarker;
    }, import('./api4DeltasTypes.js').PwrClaimData[]>;
    GetCombinedData: import('@trpc/server').BuildProcedure<'query', {
        _config: import('@trpc/server').RootConfig<{
            ctx: object;
            meta: object;
            errorShape: import('@trpc/server').DefaultErrorShape;
            transformer: import('@trpc/server').DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: object;
        _input_in: {
            from: string;
            to: string;
            boid_id?: string | undefined;
        };
        _input_out: {
            from: string;
            to: string;
            boid_id?: string | undefined;
        };
        _output_in: typeof import('@trpc/server').unsetMarker;
        _output_out: typeof import('@trpc/server').unsetMarker;
    }, import('./api4DeltasTypes.js').CombinedResponse[]>;
    GetGlobalDeltas: import('@trpc/server').BuildProcedure<'query', {
        _config: import('@trpc/server').RootConfig<{
            ctx: object;
            meta: object;
            errorShape: import('@trpc/server').DefaultErrorShape;
            transformer: import('@trpc/server').DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: object;
        _input_in: {
            from: string;
            to: string;
            boid_id?: string | undefined;
        };
        _input_out: {
            from: string;
            to: string;
            boid_id?: string | undefined;
        };
        _output_in: typeof import('@trpc/server').unsetMarker;
        _output_out: typeof import('@trpc/server').unsetMarker;
    }, import('./api4DeltasTypes.js').GlobalDeltaResponse[]>;
}>;
export type AppRouter = typeof appRouter;
export {};
