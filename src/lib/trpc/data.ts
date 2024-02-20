import { DoubleYChartOptions, BoidData, BoidAccData, DeltasDataItem, CombinedDataItem, PwrClaimData } from "src/types/types"
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
