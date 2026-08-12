export interface IncenseMoneyRecord {
  id: string;
  gameId: string;
  name: string;
  cost: number;
  remark: string;
  date: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IncenseMoneyInput {
  gameId: string;
  name: string;
  cost: number;
  remark: string;
  date: Date;
  createdBy: string;
}
