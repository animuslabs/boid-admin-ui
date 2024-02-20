import { Types } from "src/lib/boid-contract-structure.js"

export interface AveragePowerData {
  date:string;
  boid_id:string;
  avgPower:number;
}

export interface SeriesDataInterface {
  name:string;
  type:string;
  data:number[];
  yAxisIndex:number;
}

export interface AccountsDeltasInterface {
  averagePower:AveragePowerData[];
  totalAverageAddedPower:{
    date:string;
    avgPower:number;
  }[];
}

export interface ChartOptions {
  chart:{
    id:string;
  };
  title:{
    text:string;
    align:string;
  };
  xaxis:{
    categories:string[];
    title:{
      text:string;
      style:{
        fontSize:string;
        fontWeight:string;
      };
    };
  };
  yaxis:{
    labels:{
      formatter:(value:number) =>number;
    };
    title:{
      text:string;
      style:{
        fontSize:string;
        fontWeight:string;
      };
    };
  };
  stroke:{
    width:number;
    curve:string;
  };
  fill:{
    type:string;
    opacity:number;
  };
}

export interface DoubleYChartOptions {
  colors:string[];
  chart:{
    id:string;
    stacked:boolean;
    toolbar:{
      show:boolean;
    };
  };
  title:{
    text:string;
    align:string;
  };
  xaxis:{
    categories:string[];
    labels:{
      rotate:number;
      trim:boolean;
    };
    tickAmount:number;
    title:{
      text:string;
      style:{
        fontSize:string;
        fontWeight:string;
        color:string;
      };
    };
  };
  yaxis:Array<{
    labels:{
      formatter:(value:number) =>number;
      style:{
        colors:string;
      };
    };
    title:{
      text:string;
      style:{
        fontSize:string;
        fontWeight:string;
        color:string;
      };
    };
    opposite?:boolean;
  }>;
  stroke:{
    width:number;
    curve:string;
  };
  fill:{
    type:string;
    opacity:number;
  };
}

export interface MintDataReply {
  boid_id?:string;
  perDay:{
    date:string;
    total:number;
  }[];
  total:number;
}

export interface DeltasDataItem {
  timeStamp:string;
  boid_id:string;
  balance:number;
  selfStaked:number;
  power:number;
  receivedDelegatedStake:number;
}
export interface DeltasDataItemWithDateObject extends Omit<DeltasDataItem, "timeStamp"> {
  timeStamp:Date;
}

export interface StakingData extends DeltasDataItemWithDateObject {
  powered_stake:number;
  max_powered_stake:number;
}


export interface CombinedDataItem {
  date:string;
  boid_id:string;
  staked:number;
  power:number;
  balance:number;
  score:string;
}


export interface BoidData {
  locked_BOID_EOS_IBC:string;
  mint_BOID_Telos:string;
  burned_BOID_Telos:string;
  staked_BOID_Telos:string;
  liquid_BOID_AlcorTelos:string;
  liquid_BOID_DefiboxEOS:string;
  boid_EOS_supply:string;
  boid_TLOS_supply:string;
  boid_max_total_supply:string;
}

export interface BoidAccData {
  acc:Types.Account;
  accumulated:MintObject;
}

export interface MintObject {
  power_mint:number;
  powered_stake_mint:number;
  account_earned:number;
  team_cut:number;
  team_owner_earned:number;
  overstake_mint:number;
  total:number;
}
export interface CalcDataStructure {
  acc:{
    stake:{
      self_staked:number;
    };
    power:{
      rating:number;
    };
    team:{
      team_cumulative_contribution:number;
    };
  };
  accumulated:MintObject;
}
