import { APIClient, APIClientOptions, PublicKey, PrivateKey } from "@wharfkit/antelope"
import { Contract as BoidContract, abi as boidABI } from "src/lib/boid-contract-structure"
import { Contract as EosioMsigContract, abi as msigABI } from "src/lib/eosio-msig-contract-telos-mainnet"
import { Contract as ScoresBoidContract, abi as scoresBoidABI } from "src/lib/gaming/scores.boid"

export class ParsedAccountMeta {
  text:{
    tagline:string
    info:string
    eosAccount:string
    telosAccount:string
  } = {
      tagline: "",
      info: "",
      eosAccount: "",
      telosAccount: ""
    }

  media:{
    profile:string
    banner:string
  } = {
      profile: "",
      banner: ""
    }
}

export type AccountRowData = {
  boid_id:string;
  owners:string;
  auth_keys:string;
  meta:ParsedAccountMeta;
  max_powered_stake:number;
  powered_stake:number;
};

export type AccountStakingData = {
  boid_id:string;
  balance:number;
  self_staked:number;
  received_delegated_stake:number;
  total_stake:number;
  unstaking:TeamTokenUnstake[];
}

export class TeamMeta {
  links:[string, string][] = []
  media:[string, string][] = []
  text:[string, string][] = []
  extra?:[string, string][] = []
}

export class AccountMeta {
  links:[string, string][] = []
  media:[string, string][] = []
  text:[string, string][] = []
  extra?:[string, string][] = []
}

export interface TeamTokenUnstake {
  redeemable_after_round:number
  quantity:number
}

interface TeamAccountStake {
  unstaking:TeamTokenUnstake[]
  self_staked:number
  received_delegated_stake:number
}

export interface DeserializedTeam {
  team_id:number;
  balance:number;
  stake:TeamAccountStake;
  owner:string;
  managers:string[];
  min_pwr_tax_mult:number;
  owner_cut_mult:number;
  url_safe_name:string;
  power:number;
  members:number;
  last_edit_round:number;
  meta:TeamMeta | null;
}

export interface NftMint {
  mint_template_id:string;
  mint_schema_name:string;
  mint_collection_name:string;
  match_immutable_attributes:NftAttribute[],
  match_mutable_attributes:NftAttribute[],
  quantity:string;
}

export interface NftAction {
  collection_name:string;
  schema_name:string;
  template_id:number;
  match_immutable_attributes:NftAttribute[],
  match_mutable_attributes:NftAttribute[],
  burn:boolean;
  lock_rounds:number;
}

export interface NftAttribute {
  key:string;
  type:string; // Type selected from dropdown
  value:string; // Value entered by user
}


// multising signers store
export interface Signer {
  actor:string;
  permission:string;
}

export class ContractFactory {
  private client:APIClient

  constructor(url:string) {
    const apiClientOptions:APIClientOptions = { url }
    this.client = new APIClient(apiClientOptions)
  }

  createBoidContract():BoidContract {
    return new BoidContract({
      client: this.client,
      abi: boidABI,
      account: "boid"
    })
  }

  createEosioMsigContract():EosioMsigContract {
    return new EosioMsigContract({
      client: this.client,
      abi: msigABI,
      account: "eosio.msig"
    })
  }

  createScoresBoidContract():ScoresBoidContract {
    return new ScoresBoidContract({
      client: this.client,
      abi: scoresBoidABI,
      account: "scores.boid"
    })
  }
}

export interface KeyPair {
  privateKey:{
    key:PrivateKey;
    wif:string;
  };
  publicKey:{
    key:PublicKey;
    eosFormat:string;
  };
}
