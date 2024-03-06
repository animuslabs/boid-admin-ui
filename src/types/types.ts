import { Types } from "src/lib/boid-contract-structure.js"
import { stringToBytes, bytesToJson } from "../lib/reuseFunctions"
import { Bytes } from "@wharfkit/antelope"

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

export class PayrollMeta {
  socialMediaLinks:Record<string, string>
  websiteLink:string
  mediaImages:{
      banner:string;
      avatar:string;
  }

  text:string
  title:string
  docIPFSCIDs:string[]

  constructor({
    socialMediaLinks = {},
    websiteLink = "",
    mediaImages = { banner: "", avatar: "" },
    text = "",
    title = "",
    docIPFSCIDs = [""]
  } = {}) {
    this.socialMediaLinks = socialMediaLinks
    this.websiteLink = websiteLink
    this.mediaImages = mediaImages
    this.text = text
    this.title = title
    this.docIPFSCIDs = docIPFSCIDs
  }

  // Social Media Links
  addSocialMediaLink(platform:string, link:string) {
    this.socialMediaLinks[platform] = link
  }

  editSocialMediaLink(platform:string, newLink:string) {
    if (this.socialMediaLinks[platform]) {
      this.socialMediaLinks[platform] = newLink
    }
  }

  removeSocialMediaLink(platform:string) {
    delete this.socialMediaLinks[platform]
  }

  // Website Link
  setWebsiteLink(link:string) {
    this.websiteLink = link
  }

  // Media Images
  setMediaImage(type:"banner" | "avatar", link:string) {
    this.mediaImages[type] = link
  }

  // Text
  setText(text:string) {
    this.text = text
  }

  // Title
  setTitle(title:string) {
    this.title = title
  }

  // Document IPFS CIDs
  addDocumentIPFSCID(cid:string) {
    if (!this.docIPFSCIDs.includes(cid)) {
      this.docIPFSCIDs.push(cid)
    }
  }

  removeDocumentIPFSCID(cid:string) {
    this.docIPFSCIDs = this.docIPFSCIDs.filter(item => item !== cid)
  }

  toJSONstring() {
    return JSON.stringify({
      socialMediaLinks: this.socialMediaLinks,
      websiteLink: this.websiteLink,
      mediaImages: this.mediaImages,
      text: this.text,
      title: this.title,
      docIPFSCIDs: this.docIPFSCIDs
    })
  }

  // Convert meta data to BytesType
  toBytes() {
    const metaString = this.toJSONstring()
    return stringToBytes(metaString)
  }

  static async fromBytes(bytes:Bytes):Promise<PayrollMeta> {
    const data = await bytesToJson<Partial<PayrollMeta>>(bytes)
    return new PayrollMeta(data)
  }
}

export interface PayrollConfigStructure {
  total:string;
  startTime:string;
  finishTime:string;
  receiverAccount:string;
  treasuryAccount:string;
  paused:boolean;
}


export interface PayrollDataItem extends PayrollConfigStructure {
  id:number;
  paid:string;
  lastPayout:string;
  minClaimFrequencySec:string;
  meta:PayrollMeta;
}

export interface TokensWhitelistItem {
  sym:string
  contract:string
}


export interface PayrollItem {
  total:string;
  paid:string;
}

interface Amounts {
  total:number;
  paid:number;
}

export interface AggregatedTotals {
  [symbol:string]:Amounts;
}
