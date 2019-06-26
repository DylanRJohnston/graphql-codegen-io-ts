import * as t from "io-ts";

type Billing = t.TypeOf<typeof Billing>;
const Billing = t.type({
  trialDaysLeft: t.number,
  plan: BillingPlan,
  card: Card,
  nextPaymentDue: t.string
});

type BillingPlan = t.TypeOf<typeof BillingPlan>;
const BillingPlan = t.keyof({
  FREE: null,
  SOLO: null,
  TEAM: null
});

type Card = t.TypeOf<typeof Card>;
const Card = t.type({
  lastFourDigits: t.string,
  type: t.string
});

type Company = t.TypeOf<typeof Company>;
const Company = t.type({
  id: t.string,
  name: t.string
});

type CurrentUser = t.TypeOf<typeof CurrentUser>;
const CurrentUser = t.type({
  id: t.string,
  authToken: t.string,
  firstName: t.string,
  lastName: t.string,
  email: t.string,
  mobile: t.string,
  isOwner: t.boolean,
  company: Company
});

type RootMutationType = t.TypeOf<typeof RootMutationType>;
const RootMutationType = t.type({
  registerUser: CurrentUser,
  registerCompany: Company,
  resetPassword: CurrentUser,
  login: CurrentUser,
  logout: CurrentUser,
  updateBilling: Billing
});

type RootQueryType = t.TypeOf<typeof RootQueryType>;
const RootQueryType = t.type({
  currentUser: CurrentUser,
  billing: Billing
});
