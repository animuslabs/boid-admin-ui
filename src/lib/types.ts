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
};

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
