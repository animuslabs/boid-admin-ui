declare const appRouter:import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx:object;
    meta:object;
    errorShape:import("@trpc/server").DefaultErrorShape;
    transformer:import("@trpc/server").DefaultDataTransformer;
}>, {
    BoidIDlist:import("@trpc/server").BuildProcedure<"query", {
        _config:import("@trpc/server").RootConfig<{
            ctx:object;
            meta:object;
            errorShape:import("@trpc/server").DefaultErrorShape;
            transformer:import("@trpc/server").DefaultDataTransformer;
        }>;
        _ctx_out:object;
        _input_in:typeof import("@trpc/server").unsetMarker;
        _input_out:typeof import("@trpc/server").unsetMarker;
        _output_in:typeof import("@trpc/server").unsetMarker;
        _output_out:typeof import("@trpc/server").unsetMarker;
        _meta:object;
    }, string[]>;
    GetDeltasBoidID:import("@trpc/server").BuildProcedure<"query", {
        _config:import("@trpc/server").RootConfig<{
            ctx:object;
            meta:object;
            errorShape:import("@trpc/server").DefaultErrorShape;
            transformer:import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta:object;
        _ctx_out:object;
        _input_in:{
            from:string;
            to:string;
            boid_id?:string | undefined;
        };
        _input_out:{
            from:string;
            to:string;
            boid_id?:string | undefined;
        };
        _output_in:typeof import("@trpc/server").unsetMarker;
        _output_out:typeof import("@trpc/server").unsetMarker;
    }, import("../../types/api4DeltasTypes.js").AccountsDeltaData[]>;
    GetLogPwrClaim:import("@trpc/server").BuildProcedure<"query", {
        _config:import("@trpc/server").RootConfig<{
            ctx:object;
            meta:object;
            errorShape:import("@trpc/server").DefaultErrorShape;
            transformer:import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta:object;
        _ctx_out:object;
        _input_in:{
            from:string;
            to:string;
            boid_id?:string | undefined;
        };
        _input_out:{
            from:string;
            to:string;
            boid_id?:string | undefined;
        };
        _output_in:typeof import("@trpc/server").unsetMarker;
        _output_out:typeof import("@trpc/server").unsetMarker;
    }, import("../../types/api4DeltasTypes.js").PwrClaimData[]>;
    GetCombinedData:import("@trpc/server").BuildProcedure<"query", {
        _config:import("@trpc/server").RootConfig<{
            ctx:object;
            meta:object;
            errorShape:import("@trpc/server").DefaultErrorShape;
            transformer:import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta:object;
        _ctx_out:object;
        _input_in:{
            from:string;
            to:string;
            boid_id?:string | undefined;
        };
        _input_out:{
            from:string;
            to:string;
            boid_id?:string | undefined;
        };
        _output_in:typeof import("@trpc/server").unsetMarker;
        _output_out:typeof import("@trpc/server").unsetMarker;
    }, import("../../types/api4DeltasTypes.js").CombinedResponse[]>;
    GetGlobalDeltas:import("@trpc/server").BuildProcedure<"query", {
        _config:import("@trpc/server").RootConfig<{
            ctx:object;
            meta:object;
            errorShape:import("@trpc/server").DefaultErrorShape;
            transformer:import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta:object;
        _ctx_out:object;
        _input_in:{
            from:string;
            to:string;
            boid_id?:string | undefined;
        };
        _input_out:{
            from:string;
            to:string;
            boid_id?:string | undefined;
        };
        _output_in:typeof import("@trpc/server").unsetMarker;
        _output_out:typeof import("@trpc/server").unsetMarker;
    }, import("../../types/api4DeltasTypes.js").GlobalDeltaResponse[]>;
    GetCalculatedData:import("@trpc/server").BuildProcedure<"query", {
        _config:import("@trpc/server").RootConfig<{
            ctx:object;
            meta:object;
            errorShape:import("@trpc/server").DefaultErrorShape;
            transformer:import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta:object;
        _ctx_out:object;
        _input_in:{
            rounds:number;
            basePowerPerRound:number;
            stake:number;
            userConfig:{
                power:{
                    sponsor_tax_mult:number;
                    powered_stake_mult:number;
                };
                mint:{
                    round_powered_stake_mult:number;
                    round_power_mult:number;
                };
            };
            liveSim:boolean;
            activeSponsor:boolean;
            configAccount:{
                min_pwr_tax_mult:number;
            };
        };
        _input_out:{
            rounds:number;
            basePowerPerRound:number;
            stake:number;
            userConfig:{
                power:{
                    sponsor_tax_mult:number;
                    powered_stake_mult:number;
                };
                mint:{
                    round_powered_stake_mult:number;
                    round_power_mult:number;
                };
            };
            liveSim:boolean;
            activeSponsor:boolean;
            configAccount:{
                min_pwr_tax_mult:number;
            };
        };
        _output_in:typeof import("@trpc/server").unsetMarker;
        _output_out:typeof import("@trpc/server").unsetMarker;
    }, any>;
    GetBOIDtokenInfo:import("@trpc/server").BuildProcedure<"query", {
        _config:import("@trpc/server").RootConfig<{
            ctx:object;
            meta:object;
            errorShape:import("@trpc/server").DefaultErrorShape;
            transformer:import("@trpc/server").DefaultDataTransformer;
        }>;
        _ctx_out:object;
        _input_in:typeof import("@trpc/server").unsetMarker;
        _input_out:typeof import("@trpc/server").unsetMarker;
        _output_in:typeof import("@trpc/server").unsetMarker;
        _output_out:typeof import("@trpc/server").unsetMarker;
        _meta:object;
    }, {
        tokenInfo:import("../../lib/types/calc-types.js").BoidData;
        avTotals:{
            averageStaked:number;
            averagePower:number;
            totalUsers:number;
        };
    }>;
}>
export type AppRouter = typeof appRouter;
export {}
