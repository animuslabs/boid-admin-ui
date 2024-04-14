import { BoidData, BoidAccData, DeltasDataItem, CombinedDataItem, PwrClaimData } from "src/types/types"
import { SentReportsResponse, OraclePayResponse, PowerReportResponse } from "src/lib/trpc/api4DeltasTypes"
import { useApiStore } from "src/stores/apiStore"
import { computed } from "vue"

const apiStore = useApiStore()
const trpcClient = computed(() => apiStore.trpcClient)

export const fetchGetDeltasBoidIDData = (
  boid_id:string,
  from:string,
  to:string
):Promise<DeltasDataItem[]> => trpcClient.value.GetDeltasBoidID.query({ boid_id, from, to })

export const fetchGetCombinedData = (
  boid_id:string,
  from:string,
  to:string
):Promise<CombinedDataItem[]> => trpcClient.value.GetCombinedData.query({ boid_id, from, to })

export const fetchGetLogPwrClaimData = (
  boid_id:string,
  from:string,
  to:string
):Promise<PwrClaimData[]> => trpcClient.value.GetLogPwrClaim.query({ boid_id, from, to })

export const fetchCalculatorData = (
  rounds:number,
  basePowerPerRound:number,
  stake:number,
  userConfig:{
    power:{
      sponsor_tax_mult:number,
      powered_stake_mult:number
    },
    mint:{
      round_powered_stake_mult:number,
      round_power_mult:number
    }},
  liveSim:boolean,
  activeSponsor:boolean,
  configAccount:{
    min_pwr_tax_mult:number
  }
):Promise<BoidAccData> => trpcClient.value.GetCalculatedData.query({ rounds, basePowerPerRound, stake, userConfig, liveSim, activeSponsor, configAccount }).then((data:BoidAccData) => { return data })

export const fetchBOIDtokenData = ():Promise<
  {tokenInfo:BoidData, avTotals:{ averageStaked:number; averagePower:number; totalUsers:number }}
> => trpcClient.value.GetBOIDtokenInfo.query()

export const fetchPowerReports = (
  from:string,
  to:string,
  protocol_id?:number,
  round?:number,
  boid_id?:string
):Promise<SentReportsResponse[]> => trpcClient.value.GetPowerReports.query({ from, to, protocol_id, round, boid_id })

export const fetchPayOracle = (
  from:string,
  to:string,
  oracle?:string,
  round?:number
):Promise<OraclePayResponse[]> => trpcClient.value.GetPayOracle.query({ from, to, oracle, round })

export const fetchOraclePowerReport = (
  from:string,
  to:string,
  boid_id?:string,
  oracle?:string,
  round?:number,
  protocol_id?:number
):Promise<PowerReportResponse[]> => trpcClient.value.GetOraclePowerReport.query({ from, to, boid_id, oracle, round, protocol_id })
