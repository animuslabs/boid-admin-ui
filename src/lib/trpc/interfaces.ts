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
  [key:string]:string | number;
}

export interface CombinedDataItem {
  date:string;
  boid_id:string;
  staked:number;
  power:number;
  balance:number;
  score:string;
}
