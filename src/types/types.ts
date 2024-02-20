import { Types } from "src/lib/boid-contract-structure.js"
export interface AccountsDeltaData {
  timeStamp:Date;
  boid_id:string;
  balance:number;
  selfStaked:number;
  power:number;
  receivedDelegatedStake:number;
}

export interface AveragePowerData {
  date:string;
  boid_id:string;
  avgPower:number;
}

export type TotalAveragePowerData = {
  date:string;
  avgPower:number;
};

export type DeltasByDateAndBoidId = {
  [date:string]:{ [boid_id:string]:{ totPower:number; count:number } };
};

export interface RequestQueryParams {
  from:Date;
  to:Date;
  boid_id?:string;
}
export interface MintTotalByDate {
  date:string;
  total:number;
}

export interface PwrClaimData {
  timeStamp:Date;
  boid_id:string;
  power_before:number;
  power_after:number;
  power_from_boosters:number;
  mint_total:number;
  mint_account_earned:number;
  mint_overstake_mint:number;
  mint_power_mint:number;
  mint_powered_stake_mint:number;
  mint_team_cut:number;
  mint_team_owner_earned:number;
}

export type GlobalDeltaResponse = {
  timeStamp:Date;
  total_power:string;
};

export interface RequestParams {
  from:Date;
  to:Date;
}

export type AccountResponse = {
  date:Date;
  boid_id:string;
  staked:number;
  power:number;
  balance:number;
};

export type FahDataResponse = {
  time:Date;
  name:string;
  score:bigint;
};

export type FahDataResTimeStamp = {
  timeStamp:Date;
  boid_id:string;
  score:bigint;
};

export type CombinedResponse = AccountResponse & { score:string };

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
