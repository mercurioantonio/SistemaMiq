export interface ILoginReq {
  USER_NAME: string;
  PASSWORD: string;
  sid: string;
  api_version: string;
}

export interface ITokenReq {
  api_version: string;
  r_token: string;
}

export interface ITokenRes {
  api_version: string;
  token_type: string;
  sid: string;
  token_id_r: string;
  token_id_a: string;
  token_id_um: string;
  user_id: number;
  user_name: string;
  success: boolean;
  ts_gen: Date;
  ts_exp: Date;
  a_token: string;
  r_token: string;
}

export interface IUser {
  user_id?: number;
  surname: string;
  name: string;
  pirelli_user: string;
  user_type_id?: number;
  mail: string;
  display_name: string;
  object_guid?: string;
  author?: number;
  ts_insert?: Date;
  ts_last_login?: Date;
  active?: boolean;
  type_desc?: string;
  default_fav?: boolean;
}

export interface ISSOUser {
  '@odata.context': string;
  businessPhones: string[];
  displayName: string;
  givenName: string;
  jobTitle: string;
  mail: string;
  mobilePhone: string;
  officeLocation: null;
  preferredLanguage: null;
  surname: string;
  userPrincipalName: string;
  id: string;
}

export interface IUmData extends ITokenRes {
  currentUser: IUser;
}

export interface IUserRes {
  r_token: string;
  a_token: string;
  um_token: string;
  success: boolean;
  um_data: IUmData;
}
